import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule, seconds } from '@nestjs/throttler';

import type { ApiEnv } from '../../config/env.js';
import { API_ENV } from '../../config/env.token.js';

/**
 * Rate limiting.
 *
 * ── How this differs from the account lockout ────────────────────────────────
 * They are not the same defence and neither replaces the other. Lockout is per ACCOUNT: it stops somebody
 * guessing one person's password. Throttling is per CLIENT: it stops one source spraying a single guess
 * across ten thousand accounts, which is exactly the attack lockout cannot see, because no single account
 * ever accumulates failures.
 *
 * ── Why the limits are where they are ────────────────────────────────────────
 * The global ceiling is generous, because a dashboard loading a screen makes a dozen requests before
 * anybody blinks and a limit that a legitimate session can trip is a limit that gets switched off. The
 * authentication routes get their own, much tighter budget, and they are the ones that matter: a person
 * signs in a few times an hour, so ten attempts a minute is far above human use and far below what a
 * spray needs.
 *
 * ── The unit is the CLIENT, so `trust proxy` is load-bearing ─────────────────
 * In production this sits behind a proxy, and without `trust proxy` every request appears to come from
 * the proxy — which would make the limit a global one, so one busy attacker would lock out everybody.
 * `configure-app.ts` sets it for the production environment; see the note there.
 */
@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      inject: [API_ENV],
      useFactory: (env: ApiEnv) => ({
        throttlers: [DEFAULT_THROTTLE],
        // Storage is left at the default (in-process) on purpose. See the note on Redis-backed storage at
        // the bottom of this file for why it is not merely a matter of passing a URL.
        //
        // Off in the automated test environment: the suites that exercise cookies, guards and validation
        // make many requests from the same address, and would be rate-limited by a component they are not
        // testing. The limits themselves are covered by `throttling.spec.ts`, which builds its own module
        // with them switched on rather than relying on this one.
        skipIf: () => env.nodeEnv === 'test',
      }),
    }),
  ],
  providers: [
    // Registered as the FIRST global guard. The order is what makes it worth having: the whole point is to
    // reject a flood BEFORE the expensive work — an Argon2 verify, a database round trip, a breach lookup
    // — rather than after it. It is registered in a module imported before AuthModule, and the e2e suite
    // asserts the observable consequence: a throttled login never reaches the password check.
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class ThrottlingModule {}

/**
 * The global ceiling: per client, per minute.
 *
 * High enough that no ordinary screen or page load reaches it, low enough that a script pointed at the API
 * cannot walk away with the database at speed.
 */
export const DEFAULT_THROTTLE = { name: 'default', ttl: seconds(60), limit: 120 } as const;

/**
 * Sign-in. Far above human use, far below what a credential spray needs.
 *
 * Combined with the account lockout, this closes both halves: the spray trips this within a minute, and
 * the single-account guesser trips the lockout within a handful of attempts.
 */
export const LOGIN_THROTTLE = { default: { ttl: seconds(60), limit: 10 } } as const;

/** Account creation. Low, because nobody legitimately registers ten accounts a minute. */
export const REGISTER_THROTTLE = { default: { ttl: seconds(60), limit: 5 } } as const;

/**
 * Second-factor and token endpoints.
 *
 * Tighter than login for the MFA check: a six-digit code has only a million possibilities, and an
 * unattended endpoint that accepts guesses is a brute-force target in a way a password is not.
 */
export const MFA_THROTTLE = { default: { ttl: seconds(60), limit: 10 } } as const;

/** Refresh happens on almost every page load in an SPA, so its budget is the loosest of the lot. */
export const REFRESH_THROTTLE = { default: { ttl: seconds(60), limit: 60 } } as const;

/** Verification links are clicked once, by a human, following an e-mail. */
export const VERIFY_EMAIL_THROTTLE = { default: { ttl: seconds(60), limit: 10 } } as const;

/*
 * ── Why there is no Redis-backed storage here yet ────────────────────────────
 *
 * In-process storage means the limit is per INSTANCE: behind four replicas the effective ceiling is four
 * times what is configured. Redis is the fix, and it is deliberately not wired yet because the obvious
 * wiring is worse than the limitation.
 *
 * `buildRedisConnection` sets `maxRetriesPerRequest: null`, which BullMQ requires and which is wrong on a
 * request path: with it, a command issued while the connection is down is retried forever instead of
 * failing, and ioredis's offline queue holds it meanwhile. For a queue that is the correct behaviour — the
 * job waits for Redis to come back. For the throttler it means that when Redis is unavailable EVERY
 * REQUEST HANGS, so a cache outage becomes a total outage, and the component that exists to absorb abuse
 * becomes the thing that causes it.
 *
 * What it needs, then, is a wrapper that fails FAST and falls back:
 *   • connection options with `enableOfflineQueue: false` and a small `maxRetriesPerRequest`, so a
 *     disconnected Redis rejects immediately rather than queueing;
 *   • a short deadline around each increment (the `withTimeout` helper in common/async exists for this);
 *   • a fall back to in-process counting when it rejects, so a Redis outage degrades the limit to
 *     per-instance instead of breaking every request;
 *   • a test for exactly that: Redis unavailable ⇒ requests still succeed.
 *
 * Until then the honest statement is what this comment says: the limit is per instance.
 */
