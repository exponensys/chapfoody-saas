/**
 * Demo marketing and integrations: loyalty, segments, audiences, campaigns, automations, webhooks.
 *
 * ── The loyalty balance is RECONCILED from its ledger ────────────────────────
 * The same discipline as the customer counters: `Customer.loyaltyPoints` is denormalised, so the seed
 * computes it by SUMMING the transactions it just wrote rather than by inventing a number. A balance
 * that does not equal its ledger is the bug the ledger exists to expose, and seeding one would hide it.
 *
 * ── The campaign's counters respect the ordering constraint ──────────────────
 * A CHECK refuses a campaign that delivered more than it sent. The demo numbers are therefore chosen to
 * satisfy it in the order the constraint describes, which is also the order a real send produces them.
 */

import type { TenantTransaction } from '../../src/infra/prisma/tenant-context.js';

export interface MarketingCounters {
  loyaltyPrograms: number;
  loyaltyTiers: number;
  loyaltyTransactions: number;
  rewardRules: number;
  segments: number;
  audiences: number;
  audienceMembers: number;
  campaignTemplates: number;
  emailTemplates: number;
  campaigns: number;
  smsCampaigns: number;
  automations: number;
  integrations: number;
  integrationMappings: number;
  webhookEndpoints: number;
  webhookDeliveries: number;
  jobRuns: number;
}

export async function seedMarketing(
  tx: TenantTransaction,
  businessId: string,
  userId: string,
): Promise<MarketingCounters> {
  const counters: MarketingCounters = {
    loyaltyPrograms: 0,
    loyaltyTiers: 0,
    loyaltyTransactions: 0,
    rewardRules: 0,
    segments: 0,
    audiences: 0,
    audienceMembers: 0,
    campaignTemplates: 0,
    emailTemplates: 0,
    campaigns: 0,
    smsCampaigns: 0,
    automations: 0,
    integrations: 0,
    integrationMappings: 0,
    webhookEndpoints: 0,
    webhookDeliveries: 0,
    jobRuns: 0,
  };

  // ── The loyalty programme ──────────────────────────────────────────────────
  const existingProgram = await tx.loyaltyProgram.findFirst({
    where: { businessId },
    select: { id: true },
  });

  const program =
    existingProgram ??
    (await tx.loyaltyProgram.create({
      data: {
        businessId,
        name: 'Carte fidélité',
        isActive: true,
        pointsPerCurrency: '1.0000',
        redemptionRate: '0.0100',
        minimumRedeemPoints: 100,
        // Points last a year, and EXPIRE is a ledger entry rather than a deletion — so the customer can
        // still be told why their balance changed.
        expiryDays: 365,
        tiersEnabled: true,
      },
      select: { id: true },
    }));

  if (existingProgram === null) {
    counters.loyaltyPrograms += 1;
  }

  const TIERS = [
    { name: 'Bronze', thresholdPoints: 0, multiplier: '1.00', benefits: { earlyAccess: false } },
    { name: 'Argent', thresholdPoints: 500, multiplier: '1.25', benefits: { earlyAccess: true } },
    { name: 'Or', thresholdPoints: 2000, multiplier: '2.00', benefits: { earlyAccess: true, freeDelivery: true } },
  ];

  for (const [index, plan] of TIERS.entries()) {
    const existing = await tx.loyaltyTier.findFirst({
      where: { programId: program.id, name: plan.name },
      select: { id: true },
    });

    if (existing !== null) {
      continue;
    }

    await tx.loyaltyTier.create({
      data: {
        businessId,
        programId: program.id,
        name: plan.name,
        thresholdPoints: plan.thresholdPoints,
        multiplier: plan.multiplier,
        benefits: plan.benefits,
        sortOrder: index,
      },
    });
    counters.loyaltyTiers += 1;
  }

  // ── Rewards ────────────────────────────────────────────────────────────────
  const REWARDS = [
    { name: '5 € de remise', type: 'DISCOUNT' as const, pointsCost: 500, value: '5.00' },
    { name: 'Livraison offerte', type: 'FREE_DELIVERY' as const, pointsCost: 250, value: '2.50' },
    { name: 'Dessert offert', type: 'FREE_ITEM' as const, pointsCost: 300, value: '4.00' },
  ];

  for (const [index, plan] of REWARDS.entries()) {
    const existing = await tx.rewardRule.findFirst({
      where: { businessId, name: plan.name },
      select: { id: true },
    });

    if (existing !== null) {
      continue;
    }

    await tx.rewardRule.create({
      data: {
        businessId,
        name: plan.name,
        type: plan.type,
        pointsCost: plan.pointsCost,
        valueAmount: plan.value,
        // A floor, because a free delivery on a €4 order is a loss dressed up as a reward.
        minimumOrderAmount: '10.00',
        isActive: true,
        // 0 means unlimited, which is different from "none left" and has to be expressible.
        usageLimit: 0,
        sortOrder: index,
      },
    });
    counters.rewardRules += 1;
  }

  return finishMarketing(tx, businessId, userId, program.id, counters);
}

/** The ledger, the segments, the campaigns and the integrations. */
async function finishMarketing(
  tx: TenantTransaction,
  businessId: string,
  userId: string,
  programId: string,
  counters: MarketingCounters,
): Promise<MarketingCounters> {
  // ── The points ledger, for the demo customer who bought ─────────────────────
  const customer = await tx.customer.findFirst({
    where: { businessId, number: 'CLI-000001' },
    select: { id: true },
  });

  if (customer !== null) {
    const existingLedger = await tx.loyaltyTransaction.findFirst({
      where: { businessId, customerId: customer.id },
      select: { id: true },
    });

    if (existingLedger === null) {
      // Signed points, and a running balance recorded per row rather than recomputed: a statement shows
      // the balance as it stood at each movement, and rebuilding it later means replaying the ledger.
      const movements = [
        { type: 'EARN' as const, points: 42, reason: 'Commande DEMO-0001', days: -20 },
        { type: 'EARN' as const, points: 18, reason: 'Commande DEMO-0002', days: -6 },
        { type: 'REDEEM' as const, points: -20, reason: 'Livraison offerte', days: -3 },
      ];

      let balance = 0;

      for (const movement of movements) {
        balance += movement.points;

        await tx.loyaltyTransaction.create({
          data: {
            businessId,
            customerId: customer.id,
            programId,
            type: movement.type,
            points: movement.points,
            balanceAfter: balance,
            reason: movement.reason,
            // Set at EARN time from the programme's policy, so changing the policy later does not
            // silently re-date points that are already earned.
            expiresAt:
              movement.type === 'EARN'
                ? new Date(Date.now() + 365 * 24 * 60 * 60_000)
                : null,
            createdById: userId,
            occurredAt: new Date(Date.now() + movement.days * 24 * 60 * 60_000),
          },
        });
        counters.loyaltyTransactions += 1;
      }

      // The balance is DERIVED from the ledger, not invented. A denormalised number that disagrees with
      // its own ledger is the bug the ledger exists to expose.
      await tx.customer.update({
        where: { id: customer.id },
        data: { loyaltyPoints: balance },
      });
    }
  }

  // ── A segment, and the audience resolved from it ────────────────────────────
  const existingSegment = await tx.customerSegment.findFirst({
    where: { businessId, code: 'vip' },
    select: { id: true },
  });

  const segment =
    existingSegment ??
    (await tx.customerSegment.create({
      data: {
        businessId,
        name: 'Clients fidèles',
        code: 'vip',
        description: 'Trois commandes ou plus, ou plus de 100 points.',
        type: 'DYNAMIC',
        rules: {
          operator: 'OR',
          conditions: [
            { field: 'totalOrders', op: 'gte', value: 3 },
            { field: 'loyaltyPoints', op: 'gte', value: 100 },
          ],
        },
        createdById: userId,
      },
      select: { id: true },
    }));

  if (existingSegment === null) {
    counters.segments += 1;
  }

  const existingAudience = await tx.audience.findFirst({
    where: { businessId, name: 'Fidèles — septembre' },
    select: { id: true },
  });

  const audience =
    existingAudience ??
    (await tx.audience.create({
      data: {
        businessId,
        segmentId: segment.id,
        name: 'Fidèles — septembre',
        description: 'Résolue une fois, pour pouvoir dire qui a reçu quoi.',
        memberCount: customer === null ? 0 : 1,
        lastResolvedAt: new Date(),
      },
      select: { id: true },
    }));

  if (existingAudience === null) {
    counters.audiences += 1;
  }

  if (customer !== null) {
    const existingMember = await tx.audienceMember.findFirst({
      where: { audienceId: audience.id, customerId: customer.id },
      select: { id: true },
    });

    if (existingMember === null) {
      await tx.audienceMember.create({
        data: { businessId, audienceId: audience.id, customerId: customer.id },
      });
      counters.audienceMembers += 1;
    }
  }

  return finishMarketingTwo(tx, businessId, userId, { segment, audience }, counters);
}


/** Templates, campaigns, automations, and the integration surface. */
async function finishMarketingTwo(
  tx: TenantTransaction,
  businessId: string,
  userId: string,
  refs: { segment: { id: string }; audience: { id: string } },
  counters: MarketingCounters,
): Promise<MarketingCounters> {
  void refs;

  // ── Templates ──────────────────────────────────────────────────────────────
  const existingTemplate = await tx.campaignTemplate.findFirst({
    where: { businessId, name: 'Offre du week-end' },
    select: { id: true },
  });

  const template =
    existingTemplate ??
    (await tx.campaignTemplate.create({
      data: {
        businessId,
        name: 'Offre du week-end',
        channel: 'EMAIL',
        subject: 'Bonjour {{prenom}}, -15 % ce week-end',
        body: 'Bonjour {{prenom}},\n\nVotre carte affiche {{points}} points.\n\nÀ très vite !',
        // The placeholders the template expects, so the editor is told when one is missing rather than
        // sending an e-mail that literally says "Bonjour {{prenom}}".
        variables: ['prenom', 'points'],
        isActive: true,
      },
    }));

  if (existingTemplate === null) {
    counters.campaignTemplates += 1;
  }

  const existingEmail = await tx.emailTemplate.findFirst({
    where: { businessId, key: 'welcome' },
    select: { id: true },
  });

  const emailTemplate =
    existingEmail ??
    (await tx.emailTemplate.create({
      data: {
        businessId,
        key: 'welcome',
        name: 'Bienvenue',
        subject: 'Bienvenue chez nous !',
        body: 'Merci pour votre première commande.',
        isCustom: false,
        updatedById: userId,
      },
      select: { id: true },
    }));

  if (existingEmail === null) {
    counters.emailTemplates += 1;
  }

  // ── A campaign that has already run ────────────────────────────────────────
  // The counters satisfy the ordering CHECK: targeted >= sent >= delivered >= opened >= clicked.
  const existingCampaign = await tx.campaign.findFirst({
    where: { businessId, name: 'Offre du week-end — septembre' },
    select: { id: true },
  });

  const campaign =
    existingCampaign ??
    (await tx.campaign.create({
      data: {
        businessId,
        audienceId: refs.audience.id,
        templateId: template.id,
        name: 'Offre du week-end — septembre',
        channel: 'EMAIL',
        status: 'COMPLETED',
        subject: 'Bonjour, -15 % ce week-end',
        body: 'La campagne telle qu’elle a été envoyée.',
        startedAt: new Date(Date.now() - 5 * 24 * 60 * 60_000),
        completedAt: new Date(Date.now() - 5 * 24 * 60 * 60_000 + 3_600_000),
        recipientCount: 412,
        sentCount: 408,
        deliveredCount: 401,
        openedCount: 244,
        clickedCount: 96,
        failedCount: 7,
        optOutCount: 2,
        budgetAmount: '50.00',
        spentAmount: '12.40',
        createdById: userId,
        approvedById: userId,
        approvedAt: new Date(Date.now() - 6 * 24 * 60 * 60_000),
      },
      select: { id: true },
    }));

  if (existingCampaign === null) {
    counters.campaigns += 1;
  }

  // ── The SMS-only detail ────────────────────────────────────────────────────
  // 161 characters is two billable segments, which is why both numbers are stored rather than derived.
  const existingSms = await tx.smsCampaign.findFirst({
    where: { campaignId: campaign.id },
    select: { id: true },
  });

  if (existingSms === null) {
    await tx.smsCampaign.create({
      data: {
        businessId,
        campaignId: campaign.id,
        senderId: 'CHAPFOODY',
        message: 'Bonjour, -15 % ce week-end sur votre carte fidélité !',
        characters: 54,
        segments: 1,
        creditsUsed: 1,
        provider: 'demo-gateway',
        sentAt: new Date(Date.now() - 5 * 24 * 60 * 60_000),
      },
    });
    counters.smsCampaigns += 1;
  }

  // ── Automations ────────────────────────────────────────────────────────────
  const AUTOMATIONS = [
    {
      name: 'Merci après la première commande',
      event: 'CUSTOMER_CREATED' as const,
      delayMinutes: 60,
      action: 'SEND_EMAIL' as const,
    },
    {
      name: 'Relance des clients dormants',
      event: 'INACTIVE_DAYS' as const,
      delayMinutes: 0,
      action: 'SEND_SMS' as const,
    },
  ];

  for (const plan of AUTOMATIONS) {
    const existing = await tx.automationTrigger.findFirst({
      where: { businessId, name: plan.name },
      select: { id: true },
    });

    if (existing !== null) {
      continue;
    }

    await tx.automationTrigger.create({
      data: {
        businessId,
        name: plan.name,
        event: plan.event,
        delayMinutes: plan.delayMinutes,
        conditions: { minOrderCount: plan.event === 'INACTIVE_DAYS' ? 1 : 0 },
        action: plan.action,
        templateId: emailTemplate.id,
        actionConfig: { tag: 'relance' },
        isActive: true,
      },
    });
    counters.automations += 1;
  }

  return finishMarketingThree(tx, businessId, userId, [template, emailTemplate], counters);
}


/** Integrations, one webhook endpoint with a delivery, and a job history. */
async function finishMarketingThree(
  tx: TenantTransaction,
  businessId: string,
  userId: string,
  templates: { id: string }[],
  counters: MarketingCounters,
): Promise<MarketingCounters> {
  void templates;

  // ── An integration ─────────────────────────────────────────────────────────
  const existingIntegration = await tx.integration.findFirst({
    where: { businessId, provider: 'ZOHO' },
    select: { id: true },
  });

  const integration =
    existingIntegration ??
    (await tx.integration.create({
      data: {
        businessId,
        provider: 'ZOHO',
        status: 'CONNECTED',
        name: 'Zoho Books',
        // ENCRYPTED AT THE APPLICATION LAYER. The demo value is obviously a placeholder; the point of
        // the column is that nothing ever writes a real token here in plaintext.
        credentials: { accessToken: 'enc:v1:demo', refreshToken: 'enc:v1:demo' },
        scopes: ['invoices.READ', 'contacts.CREATE'],
        externalAccountId: 'demo-org-1024',
        externalAccountName: 'Chapfoody Demo Org',
        settings: { syncFrequency: 'hourly' },
        connectedById: userId,
        connectedAt: new Date(),
        lastSyncAt: new Date(Date.now() - 3_600_000),
      },
      select: { id: true },
    }));

  if (existingIntegration === null) {
    counters.integrations += 1;
  }

  const existingMapping = await tx.integrationMapping.findFirst({
    where: { integrationId: integration.id, entity: 'INVOICE' },
    select: { id: true },
  });

  if (existingMapping === null) {
    await tx.integrationMapping.create({
      data: {
        businessId,
        integrationId: integration.id,
        entity: 'INVOICE',
        direction: 'PUSH',
        externalObject: 'invoices',
        mapping: { total: 'total', currency: 'currency_code', customerName: 'customer_name' },
        isActive: true,
        lastSyncAt: new Date(Date.now() - 3_600_000),
      },
    });
    counters.integrationMappings += 1;
  }

  // ── A webhook endpoint, and one delivery ───────────────────────────────────
  // HTTPS is a CHECK, not a convention: a webhook carries order and customer data.
  const endpointUrl = 'https://hooks.chapfoody.test/demo-tenant';

  const existingEndpoint = await tx.webhookEndpoint.findFirst({
    where: { businessId, url: endpointUrl },
    select: { id: true },
  });

  const endpoint =
    existingEndpoint ??
    (await tx.webhookEndpoint.create({
      data: {
        businessId,
        url: endpointUrl,
        description: 'Webhook de démonstration',
        // Hashed: the receiver verifies our signature with their copy, so we never need to read it back.
        secret: 'sha256:demo-hashed-secret',
        events: ['order.completed', 'customer.created', 'invoice.issued'],
        isActive: true,
        lastTriggeredAt: new Date(Date.now() - 7_200_000),
      },
      select: { id: true },
    }));

  if (existingEndpoint === null) {
    counters.webhookEndpoints += 1;
  }

  const existingDelivery = await tx.webhookDelivery.findFirst({
    where: { endpointId: endpoint.id, event: 'order.completed' },
    select: { id: true },
  });

  if (existingDelivery === null) {
    await tx.webhookDelivery.create({
      data: {
        businessId,
        endpointId: endpoint.id,
        event: 'order.completed',
        payload: { orderNumber: 'DEMO-0001', total: '20.35', currency: 'EUR' },
        status: 'SUCCESS',
        attempts: 1,
        responseStatus: 200,
        responseBody: '{"received":true}',
        durationMs: 214,
        scheduledAt: new Date(Date.now() - 7_200_000),
        deliveredAt: new Date(Date.now() - 7_200_000),
      },
    });
    counters.webhookDeliveries += 1;
  }

  // ── A job that ran, and one that failed ────────────────────────────────────
  // A failure carries its error, because the first question about a failed job is what it said.
  const JOBS = [
    { jobName: 'segments.evaluate', status: 'SUCCEEDED' as const, attempts: 1, error: null },
    {
      jobName: 'reports.daily-email',
      status: 'FAILED' as const,
      attempts: 3,
      error: 'SMTP timeout after 30s',
    },
  ];

  for (const plan of JOBS) {
    const existing = await tx.jobRun.findFirst({
      where: { businessId, jobName: plan.jobName },
      select: { id: true },
    });

    if (existing !== null) {
      continue;
    }

    await tx.jobRun.create({
      data: {
        businessId,
        jobName: plan.jobName,
        queue: 'default',
        status: plan.status,
        payload: { businessId },
        attempts: plan.attempts,
        workerId: 'worker-demo-1',
        startedAt: new Date(Date.now() - 10_800_000),
        finishedAt: new Date(Date.now() - 10_800_000 + 4_000),
        durationMs: 4_000,
        error: plan.error,
        // `result` is a nullable Json column, and Prisma distinguishes `undefined` (leave it alone)
        // from `Prisma.JsonNull` (write a JSON null) — so a job with no result omits the field.
        result: plan.status === 'SUCCEEDED' ? { evaluated: 2, updated: 1 } : undefined,
      },
    });
    counters.jobRuns += 1;
  }

  return counters;
}

