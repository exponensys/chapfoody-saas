import type { NextConfig } from 'next';

/**
 * Deliberately minimal in M0.
 *
 * What is NOT here yet, and why:
 *   - Route groups ((marketing), (auth), admin, dashboard, (storefront)) — M4/M7.
 *   - `images.remotePatterns` for media storage — M5.
 *   - The security header set (CSP, HSTS, Referrer-Policy, Permissions-Policy) and
 *     `experimental.optimizePackageImports` — M14, alongside the OWASP review.
 *
 * `poweredByHeader: false` is kept from the start: advertising the framework
 * version buys nothing and costs a small amount of information disclosure.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
