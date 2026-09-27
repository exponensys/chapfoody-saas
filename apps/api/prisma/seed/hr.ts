/**
 * Demo HR and payroll.
 *
 * ── Payroll is posted to the ledger, in double entry ─────────────────────────
 * Building accounting first pays off here: a payroll run is a cost, so it produces a journal entry,
 * and the two tables are linked. The entry for one run:
 *
 *   debit   641 Rémunérations ............ gross + the employer's contributions
 *   credit  421 Personnel, dû ............ the net paid to employees
 *   credit  431 Sécurité sociale ......... both contributions
 *
 * The employer's contribution appears on the DEBIT side, as part of the cost, and not as a deduction
 * from anyone. That is the difference between what an employee costs and what they take home, and
 * conflating the two understates the cost of employment — the classic payroll error.
 *
 * ── Everything is computed in integer cents ──────────────────────────────────
 * The run's net and each payslip's net are asserted by CHECK constraints, so a rounding difference
 * would fail at commit rather than quietly producing a payroll that does not add up.
 */

import type { TenantTransaction } from '../../src/infra/prisma/tenant-context.js';

export interface HrCounters {
  employees: number;
  contracts: number;
  shifts: number;
  timeEntries: number;
  payrollRuns: number;
  payslips: number;
  payrollEntries: number;
}

const cents = (value: string | number): number => Math.round(Number(value) * 100);
const money = (value: number): string => (value / 100).toFixed(2);

/** Contribution rates, as percentages — simplified, and labelled as such where they are shown. */
const EMPLOYEE_RATE = 22;
const EMPLOYER_RATE = 42;

interface EmployeeSeed {
  readonly number: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly jobTitle: string;
  readonly linked: boolean;
  readonly monthlySalary?: string;
  readonly hourlyRate?: string;
}

const EMPLOYEES: readonly EmployeeSeed[] = [
  {
    number: 'S-001',
    firstName: 'Awa',
    lastName: 'Traoré',
    jobTitle: 'Gérante',
    linked: true,
    monthlySalary: '2000.00',
  },
  {
    number: 'S-002',
    firstName: 'Moussa',
    lastName: 'Ndiaye',
    jobTitle: 'Serveur',
    linked: false,
    hourlyRate: '12.00',
  },
];

export async function seedHr(
  tx: TenantTransaction,
  businessId: string,
  currency: string,
  userId: string,
  accountIdByCode: ReadonlyMap<string, string>,
): Promise<HrCounters> {
  const counters: HrCounters = {
    employees: 0,
    contracts: 0,
    shifts: 0,
    timeEntries: 0,
    payrollRuns: 0,
    payslips: 0,
    payrollEntries: 0,
  };

  const hiredAt = new Date('2026-01-05T00:00:00.000Z');
  const contractIdByNumber = new Map<string, string>();
  const employeeIdByNumber = new Map<string, string>();

  for (const seed of EMPLOYEES) {
    const data = {
      firstName: seed.firstName,
      lastName: seed.lastName,
      jobTitle: seed.jobTitle,
      email: `${seed.firstName.toLowerCase()}.${seed.lastName.toLowerCase()}@demo.test`,
      status: 'ACTIVE' as const,
      hiredAt,
      createdById: userId,
    };

    const employee = await tx.employee.upsert({
      where: { businessId_employeeNumber: { businessId, employeeNumber: seed.number } },
      create: {
        businessId,
        employeeNumber: seed.number,
        userId: seed.linked ? userId : null,
        ...data,
      },
      update: data,
    });

    employeeIdByNumber.set(seed.number, employee.id);
    counters.employees += 1;

    // One contract each. `findFirst` rather than an upsert: contracts have no natural key (the
    // period IS the identity), and the EXCLUDE constraint would refuse a duplicate anyway.
    const existingContract = await tx.contract.findFirst({
      where: { businessId, employeeId: employee.id },
      select: { id: true },
    });

    const contract =
      existingContract ??
      (await tx.contract.create({
        data: {
          businessId,
          employeeId: employee.id,
          type: 'PERMANENT',
          startDate: hiredAt,
          jobTitle: seed.jobTitle,
          weeklyHours: seed.monthlySalary === undefined ? '35.00' : '39.00',
          monthlySalary: seed.monthlySalary ?? null,
          hourlyRate: seed.hourlyRate ?? null,
          currency,
          signedAt: hiredAt,
        },
      }));

    if (existingContract === null) {
      counters.contracts += 1;
    }

    contractIdByNumber.set(seed.number, contract.id);
  }

  return finishHr(tx, businessId, currency, userId, accountIdByCode, {
    counters,
    employeeIdByNumber,
    contractIdByNumber,
  });
}

interface HrContext {
  counters: HrCounters;
  employeeIdByNumber: Map<string, string>;
  contractIdByNumber: Map<string, string>;
}

/** The hours recorded for the hourly employee this month, and the shift they came from. */
const SHIFT_START_HOUR = 9;
const SHIFT_END_HOUR = 17;
const SHIFT_END_MINUTE = 30;
const SHIFT_BREAK_MINUTES = 30;
const MONTH_HOURS = 35;

async function finishHr(
  tx: TenantTransaction,
  businessId: string,
  currency: string,
  userId: string,
  accountIdByCode: ReadonlyMap<string, string>,
  context: HrContext,
): Promise<HrCounters> {
  const { counters, employeeIdByNumber, contractIdByNumber } = context;

  const hourlyEmployeeId = employeeIdByNumber.get('S-002');
  const salariedEmployeeId = employeeIdByNumber.get('S-001');

  if (hourlyEmployeeId === undefined || salariedEmployeeId === undefined) {
    throw new Error('The HR seed could not find the employees it just created.');
  }

  // ── 1. A shift, and the time entry that actually fulfils it ────────────────
  const startsAt = new Date();
  startsAt.setHours(SHIFT_START_HOUR, 0, 0, 0);
  const endsAt = new Date();
  endsAt.setHours(SHIFT_END_HOUR, SHIFT_END_MINUTE, 0, 0);

  const existingShift = await tx.shift.findFirst({
    where: { businessId, employeeId: hourlyEmployeeId, startsAt },
    select: { id: true },
  });

  const shift =
    existingShift ??
    (await tx.shift.create({
      data: {
        businessId,
        employeeId: hourlyEmployeeId,
        startsAt,
        endsAt,
        breakMinutes: SHIFT_BREAK_MINUTES,
        role: 'CASHIER',
        status: 'COMPLETED',
        createdById: userId,
      },
    }));

  if (existingShift === null) {
    counters.shifts += 1;
  }

  const existingEntry = await tx.timeEntry.findFirst({
    where: { businessId, employeeId: hourlyEmployeeId, shiftId: shift.id },
    select: { id: true },
  });

  if (existingEntry === null) {
    // Worked minutes are stored, and a CHECK keeps them equal to the interval less the break — so
    // this figure has to be exactly right or the insert fails.
    const elapsedMinutes = (endsAt.getTime() - startsAt.getTime()) / 60_000;

    await tx.timeEntry.create({
      data: {
        businessId,
        employeeId: hourlyEmployeeId,
        shiftId: shift.id,
        clockInAt: startsAt,
        clockOutAt: endsAt,
        breakMinutes: SHIFT_BREAK_MINUTES,
        workedMinutes: Math.trunc(elapsedMinutes) - SHIFT_BREAK_MINUTES,
        source: 'POS',
        note: 'Pointage de démonstration',
        approvedById: userId,
        approvedAt: new Date(),
      },
    });

    counters.timeEntries += 1;
  }

  return postPayroll(tx, businessId, currency, userId, accountIdByCode, {
    counters,
    salariedEmployeeId,
    hourlyEmployeeId,
    salariedContractId: contractIdByNumber.get('S-001') ?? null,
    hourlyContractId: contractIdByNumber.get('S-002') ?? null,
  });
}

interface PayrollContext {
  counters: HrCounters;
  salariedEmployeeId: string;
  hourlyEmployeeId: string;
  salariedContractId: string | null;
  hourlyContractId: string | null;
}

/**
 * The run, its payslips, and the journal entry they produce.
 *
 * The payroll period is a DATE RANGE, not a timestamp pair: a payroll period is the month of March,
 * not an instant. That is also why the columns are DATE in the schema.
 */
async function postPayroll(
  tx: TenantTransaction,
  businessId: string,
  currency: string,
  userId: string,
  accountIdByCode: ReadonlyMap<string, string>,
  context: PayrollContext,
): Promise<HrCounters> {
  const { counters, salariedEmployeeId, hourlyEmployeeId } = context;

  const periodStart = new Date();
  periodStart.setDate(1);
  periodStart.setHours(0, 0, 0, 0);

  const periodEnd = new Date(periodStart);
  periodEnd.setMonth(periodEnd.getMonth() + 1);

  // ── The figures, in integer cents ──────────────────────────────────────────
  const salariedGross = cents('2000.00');
  const hourlyGross = cents(MONTH_HOURS * 12); // 35 h × 12.00

  const contribution = (gross: number, rate: number) => Math.round((gross * rate) / 100);

  const lines = [
    {
      employeeId: salariedEmployeeId,
      contractId: context.salariedContractId,
      hours: null as string | null,
      gross: salariedGross,
    },
    {
      employeeId: hourlyEmployeeId,
      contractId: context.hourlyContractId,
      hours: MONTH_HOURS.toFixed(2),
      gross: hourlyGross,
    },
  ].map((line) => {
    const employeeContribution = contribution(line.gross, EMPLOYEE_RATE);

    return {
      ...line,
      employeeContribution,
      employerContribution: contribution(line.gross, EMPLOYER_RATE),
      // net = gross + bonuses − deductions − the employee's share. Both extras are zero in the demo,
      // which keeps the arithmetic legible without hiding the formula.
      net: line.gross - employeeContribution,
    };
  });

  const totals = {
    gross: lines.reduce((sum, line) => sum + line.gross, 0),
    employee: lines.reduce((sum, line) => sum + line.employeeContribution, 0),
    employer: lines.reduce((sum, line) => sum + line.employerContribution, 0),
    net: lines.reduce((sum, line) => sum + line.net, 0),
  };

  const runData = {
    status: 'APPROVED' as const,
    grossTotal: money(totals.gross),
    bonusTotal: '0.00',
    deductionTotal: '0.00',
    employeeContributionTotal: money(totals.employee),
    employerContributionTotal: money(totals.employer),
    netTotal: money(totals.net),
    currency,
    approvedById: userId,
    approvedAt: new Date(),
    createdById: userId,
    notes: 'Paie de démonstration',
  };

  const existingRun = await tx.payrollRun.findFirst({
    where: { businessId, periodStart, periodEnd },
    select: { id: true, journalEntryId: true },
  });

  const run =
    existingRun ??
    (await tx.payrollRun.create({
      data: { businessId, periodStart, periodEnd, ...runData },
    }));

  if (existingRun === null) {
    counters.payrollRuns += 1;
  }

  for (const line of lines) {
    const payslipData = {
      contractId: line.contractId,
      hours: line.hours,
      grossAmount: money(line.gross),
      employeeContributionAmount: money(line.employeeContribution),
      employerContributionAmount: money(line.employerContribution),
      netAmount: money(line.net),
      bonusAmount: '0.00',
      deductionAmount: '0.00',
      currency,
    };

    await tx.payslip.upsert({
      where: {
        payrollRunId_employeeId: { payrollRunId: run.id, employeeId: line.employeeId },
      },
      create: { businessId, payrollRunId: run.id, employeeId: line.employeeId, ...payslipData },
      update: payslipData,
    });

    counters.payslips += 1;
  }

  // ── The posting ────────────────────────────────────────────────────────────
  // Already posted? Then this run is done.
  if (existingRun?.journalEntryId != null) {
    return counters;
  }

  const remuneration = accountIdByCode.get('641');
  const personnel = accountIdByCode.get('421');
  const social = accountIdByCode.get('431');

  if (remuneration === undefined || personnel === undefined || social === undefined) {
    throw new Error('The chart of accounts is missing an account the payroll entry needs.');
  }

  // The employer's share is part of the COST, so it joins the debit side; it is not a deduction from
  // anyone. gross + employer = net + (employee + employer), which is what makes the entry balance.
  const cost = totals.gross + totals.employer;
  const contributions = totals.employee + totals.employer;

  const entry = await tx.journalEntry.create({
    data: {
      businessId,
      number: `PA-${periodStart.getFullYear()}-${String(periodStart.getMonth() + 1).padStart(2, '0')}`,
      journal: 'PAYROLL',
      entryDate: periodStart,
      description: `Paie ${periodStart.getFullYear()}-${String(periodStart.getMonth() + 1).padStart(2, '0')}`,
      currency,
      status: 'DRAFT',
      totalDebit: money(cost),
      totalCredit: money(cost),
      referenceType: 'payroll_run',
      referenceId: run.id,
    },
  });

  await tx.journalLine.createMany({
    data: [
      { accountId: remuneration, label: 'Rémunérations du personnel', debit: money(cost), credit: '0.00' },
      { accountId: personnel, label: 'Net à payer', debit: '0.00', credit: money(totals.net) },
      { accountId: social, label: 'Charges sociales', debit: '0.00', credit: money(contributions) },
    ].map((line, index) => ({ businessId, journalEntryId: entry.id, position: index, ...line })),
  });

  await tx.journalEntry.update({
    where: { id: entry.id },
    data: { status: 'POSTED', postedAt: new Date(), postedById: userId },
  });

  await tx.payrollRun.update({
    where: { id: run.id },
    data: { journalEntryId: entry.id },
  });

  counters.payrollEntries += 1;

  return counters;
}
