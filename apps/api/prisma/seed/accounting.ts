/**
 * Demo accounting: a chart of accounts, and the journal entry for the completed demo sale.
 *
 * ── The order of operations here is the point ────────────────────────────────
 * The entry is created as a DRAFT, its lines are added, and only then is it posted. That is not
 * stylistic: the RLS policies permit lines to be written ONLY while the parent entry is a draft, so
 * any other order is refused by the database. The seed is therefore also a test that the draft-only
 * policy permits the workflow it was written for.
 *
 * The arithmetic must balance too, because the deferred trigger checks the committed state:
 * off by one cent and the whole seed fails at commit.
 *
 * ── A cash sale, in double entry ─────────────────────────────────────────────
 *   debit   530 Caisse ............ total
 *   credit  707 Ventes ............ subtotal
 *   credit  44571 TVA collectée ... tax
 *
 * Cash rather than bank (530, not 512): a business that has not yet banked the day's takings is
 * holding cash.
 */

import type { TenantTransaction } from '../../src/infra/prisma/tenant-context.js';

export interface AccountingCounters {
  accounts: number;
  journalEntries: number;
  journalLines: number;
  documents: number;
  snapshots: number;
}

/** A small chart, in the French numbering a francophone accountant will recognise. */
const CHART: readonly {
  code: string;
  name: string;
  type: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';
}[] = [
  { code: '401', name: 'Fournisseurs', type: 'LIABILITY' },
  { code: '411', name: 'Clients', type: 'ASSET' },
  { code: '427', name: 'Pourboires à reverser', type: 'LIABILITY' },
  { code: '44571', name: 'TVA collectée', type: 'LIABILITY' },
  { code: '512', name: 'Banque', type: 'ASSET' },
  { code: '530', name: 'Caisse', type: 'ASSET' },
  { code: '607', name: 'Achats de marchandises', type: 'EXPENSE' },
  { code: '707', name: 'Ventes de marchandises', type: 'REVENUE' },
];

/** Integer cents, as elsewhere: the trigger compares exact figures, so nothing may be a float. */
const cents = (value: string | number): number => Math.round(Number(value) * 100);
const money = (value: number): string => (value / 100).toFixed(2);

export async function seedChartOfAccounts(
  tx: TenantTransaction,
  businessId: string,
): Promise<{ count: number; idByCode: Map<string, string> }> {
  const idByCode = new Map<string, string>();

  for (const [index, account] of CHART.entries()) {
    const data = { name: account.name, type: account.type, isActive: true, sortOrder: index };

    const row = await tx.accountPlan.upsert({
      where: { businessId_code: { businessId, code: account.code } },
      create: { businessId, code: account.code, ...data },
      update: data,
    });

    idByCode.set(account.code, row.id);
  }

  return { count: CHART.length, idByCode };
}

/** Posts the completed demo order to the sales journal, and issues its invoice. */
export async function seedSalesAccounting(
  tx: TenantTransaction,
  businessId: string,
  currency: string,
  accountIdByCode: ReadonlyMap<string, string>,
  postedById: string,
): Promise<AccountingCounters> {
  const counters: AccountingCounters = {
    accounts: 0,
    journalEntries: 0,
    journalLines: 0,
    documents: 0,
    snapshots: 0,
  };

  const order = await tx.order.findFirst({
    where: { businessId, number: 'DEMO-0001' },
    select: {
      id: true,
      number: true,
      subtotal: true,
      taxAmount: true,
      tipAmount: true,
      total: true,
      placedAt: true,
      salesEntry: { select: { id: true } },
    },
  });

  // Already posted (a re-run), or nothing to post.
  if (order === null || order.salesEntry !== null) {
    return counters;
  }

  const caisse = accountIdByCode.get('530');
  const ventes = accountIdByCode.get('707');
  const tva = accountIdByCode.get('44571');
  const pourboires = accountIdByCode.get('427');

  if (
    caisse === undefined ||
    ventes === undefined ||
    tva === undefined ||
    pourboires === undefined
  ) {
    throw new Error('The chart of accounts is missing an account the sales entry needs.');
  }

  // 1. The entry, as a DRAFT — the only state in which the policies allow its lines to be written.
  const entry = await tx.journalEntry.create({
    data: {
      businessId,
      number: `VE-${order.number}`,
      journal: 'SALES',
      entryDate: order.placedAt,
      description: `Vente ${order.number}`,
      currency,
      status: 'DRAFT',
      totalDebit: order.total.toString(),
      totalCredit: order.total.toString(),
      referenceType: 'order',
      referenceId: order.id,
    },
  });

  // 2. The lines. Their insert order does not matter: the trigger verifies the committed state.
  //
  //    The TIP is a credit to a liability, not to revenue. It is money the business is holding for
  //    its staff, and booking it as turnover would overstate both the VAT base and the taxable
  //    profit. The order's own CHECK forces this to be dealt with: its total includes the tip, so
  //    omitting the line would leave the entry unbalanced by exactly that amount.
  const lines = [
    { accountId: caisse, label: `Encaissement ${order.number}`, debit: order.total.toString(), credit: '0.00' },
    { accountId: ventes, label: `Vente ${order.number}`, debit: '0.00', credit: order.subtotal.toString() },
    { accountId: tva, label: `TVA collectée ${order.number}`, debit: '0.00', credit: order.taxAmount.toString() },
  ];

  if (cents(order.tipAmount.toString()) > 0) {
    lines.push({
      accountId: pourboires,
      label: `Pourboires ${order.number}`,
      debit: '0.00',
      credit: order.tipAmount.toString(),
    });
  }

  await tx.journalLine.createMany({
    data: lines.map((line, index) => ({
      businessId,
      journalEntryId: entry.id,
      position: index,
      ...line,
    })),
  });

  return finishSalesAccounting(tx, businessId, currency, postedById, {
    counters,
    entryId: entry.id,
    order: {
      id: order.id,
      number: order.number,
      subtotal: order.subtotal.toString(),
      taxAmount: order.taxAmount.toString(),
      tipAmount: order.tipAmount.toString(),
      total: order.total.toString(),
      placedAt: order.placedAt,
    },
    lineCount: lines.length,
    ventesAccountId: ventes,
  });
}

interface SalesPostingContext {
  counters: AccountingCounters;
  entryId: string;
  lineCount: number;
  ventesAccountId: string;
  order: {
    id: string;
    number: string;
    subtotal: string;
    taxAmount: string;
    tipAmount: string;
    total: string;
    placedAt: Date;
  };
}

/** Posting, the invoice, and the balance sheet that follows from one sale. */
async function finishSalesAccounting(
  tx: TenantTransaction,
  businessId: string,
  currency: string,
  postedById: string,
  context: SalesPostingContext,
): Promise<AccountingCounters> {
  const { counters, entryId, lineCount, order, ventesAccountId } = context;

  // 3. Posting. Possible because the row is still a draft, and impossible afterwards — the policy
  //    allows the transition and forbids any further edit.
  await tx.journalEntry.update({
    where: { id: entryId },
    data: { status: 'POSTED', postedAt: new Date(), postedById },
  });

  // 4. The "already posted" marker. A second accounting run must fail loudly here rather than
  //    double the period's revenue.
  await tx.salesJournalEntry.create({
    data: { businessId, orderId: order.id, journalEntryId: entryId },
  });

  counters.journalEntries += 1;
  counters.journalLines += lineCount;

  // 5. The document the customer would be given, tied to the entry that accounts for it.
  //
  //    Its total is subtotal + tax, which is NOT the order's total: an invoice covers the goods and
  //    the tax on them, while the tip is money collected on the staff's behalf. The document's own
  //    CHECK enforces that distinction, which is how the mismatch was caught in the first place.
  const invoiceTotal = money(cents(order.subtotal) + cents(order.taxAmount));

  const document = await tx.document.create({
    data: {
      businessId,
      type: 'SALES_INVOICE',
      number: `FA-${order.number}`,
      issueDate: order.placedAt,
      partyName: 'Client comptoir (démonstration)',
      subtotal: order.subtotal,
      taxAmount: order.taxAmount,
      total: invoiceTotal,
      currency,
      status: 'PAID',
      journalEntryId: entryId,
      createdById: postedById,
    },
  });

  await tx.documentLine.create({
    data: {
      businessId,
      documentId: document.id,
      description: `Vente ${order.number}`,
      quantity: '1.000',
      unitPrice: order.subtotal,
      taxRate: '0.00',
      taxAmount: order.taxAmount,
      // round(1.000 × subtotal + tax, 2) must equal this, which is the CHECK on the line.
      lineTotal: invoiceTotal,
      accountId: ventesAccountId,
    },
  });

  counters.documents += 1;

  // 6. A balance sheet that follows from that single entry and satisfies the equation the database
  //    checks: cash held (asset) = what is owed out (tax + tips, liabilities) + what was earned
  //    (equity). The tip appears on the liability side, which is where a tip held for staff belongs.
  const asOfDate = new Date(order.placedAt.toDateString());
  const liabilities = money(cents(order.taxAmount) + cents(order.tipAmount));

  await tx.balanceSheetSnapshot.upsert({
    where: { businessId_asOfDate_basis: { businessId, asOfDate, basis: 'PROVISIONAL' } },
    create: {
      businessId,
      asOfDate,
      basis: 'PROVISIONAL',
      totalAssets: order.total,
      totalLiabilities: liabilities,
      totalEquity: order.subtotal,
      revenue: order.subtotal,
      expenses: '0.00',
      // No expenses in the demo, so the result equals the revenue.
      netResult: order.subtotal,
      currency,
      note: 'Bilan provisoire (démonstration)',
    },
    update: {},
  });

  counters.snapshots += 1;

  return counters;
}
