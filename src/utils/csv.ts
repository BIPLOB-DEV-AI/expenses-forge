import { Expense, CategoryBudget } from '../types';

/**
 * Escapes CSV field value according to RFC 4180
 */
function escapeCSV(value: string | number | undefined | null): string {
  if (value === undefined || value === null) return '""';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return `"${str}"`;
}

/**
 * Exports all transactions to standard CSV format
 */
export function exportExpensesToCSV(expenses: Expense[], filenamePrefix: string = 'ExpenseForge_Transactions'): void {
  const headers = [
    'Transaction ID',
    'Date (YYYY-MM-DD)',
    'Title / Description',
    'Category',
    'Amount (INR)',
    'Payment Method',
    'Expense Type',
    'Notes',
    'Tags'
  ];

  const rows = expenses.map(item => [
    escapeCSV(item.id),
    escapeCSV(item.date),
    escapeCSV(item.title),
    escapeCSV(item.category),
    escapeCSV(item.amount),
    escapeCSV(item.paymentMethod),
    escapeCSV(item.type),
    escapeCSV(item.notes || ''),
    escapeCSV((item.tags || []).join('; '))
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  downloadBlob(csvContent, `${filenamePrefix}_${new Date().toISOString().slice(0, 10)}.csv`, 'text/csv;charset=utf-8;');
}

/**
 * Exports category-wise budget vs actual variance analysis to CSV
 */
export function exportBudgetSummaryToCSV(
  budgets: CategoryBudget[],
  expenses: Expense[],
  filenamePrefix: string = 'ExpenseForge_Budget_Report'
): void {
  const headers = [
    'Category',
    'Monthly Target (INR)',
    'Actual Spent (INR)',
    'Variance (INR)',
    'Percentage Consumed (%)',
    'Status'
  ];

  const rows = budgets.map(b => {
    const actual = expenses
      .filter(e => e.category === b.category)
      .reduce((sum, e) => sum + e.amount, 0);
    const variance = b.monthlyTarget - actual;
    const pct = b.monthlyTarget > 0 ? Math.round((actual / b.monthlyTarget) * 100) : 0;
    const status = actual > b.monthlyTarget ? 'OVER BUDGET' : (pct >= 85 ? 'WARNING' : 'ON TRACK');

    return [
      escapeCSV(b.category),
      escapeCSV(b.monthlyTarget),
      escapeCSV(actual),
      escapeCSV(variance),
      escapeCSV(`${pct}%`),
      escapeCSV(status)
    ];
  });

  const totalTarget = budgets.reduce((sum, b) => sum + b.monthlyTarget, 0);
  const totalActual = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalVariance = totalTarget - totalActual;
  const totalPct = totalTarget > 0 ? Math.round((totalActual / totalTarget) * 100) : 0;

  rows.push([
    escapeCSV('TOTAL SUMMARY'),
    escapeCSV(totalTarget),
    escapeCSV(totalActual),
    escapeCSV(totalVariance),
    escapeCSV(`${totalPct}%`),
    escapeCSV(totalActual > totalTarget ? 'OVERALL DEFICIT' : 'SURPLUS SAVED')
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  downloadBlob(csvContent, `${filenamePrefix}_${new Date().toISOString().slice(0, 10)}.csv`, 'text/csv;charset=utf-8;');
}

/**
 * Helper to trigger client download without third-party libraries
 */
function downloadBlob(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Parses user-uploaded CSV text into structured Expense array
 */
export function parseCSVToExpenses(csvText: string): Expense[] {
  const lines = csvText.split(/\r\n|\n/).filter(line => line.trim().length > 0);
  if (lines.length < 2) return [];

  const parsedExpenses: Expense[] = [];

  // Simple parser that handles quotes
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const columns: string[] = [];
    let insideQuote = false;
    let entry = '';

    for (let charIndex = 0; charIndex < line.length; charIndex++) {
      const char = line[charIndex];
      if (char === '"') {
        if (insideQuote && line[charIndex + 1] === '"') {
          entry += '"';
          charIndex++;
        } else {
          insideQuote = !insideQuote;
        }
      } else if (char === ',' && !insideQuote) {
        columns.push(entry.trim());
        entry = '';
      } else {
        entry += char;
      }
    }
    columns.push(entry.trim());

    if (columns.length >= 4) {
      // Expected minimum: Date, Title, Category, Amount
      const date = columns[1] && columns[1].match(/^\d{4}-\d{2}-\d{2}$/) 
        ? columns[1] 
        : new Date().toISOString().slice(0, 10);
      const title = columns[2] || columns[0] || 'Imported Transaction';
      const category = (columns[3] as any) || 'Miscellaneous';
      const rawAmount = parseFloat(columns[4]?.replace(/[^\d.-]/g, '') || '0');
      const amount = isNaN(rawAmount) ? 0 : Math.abs(rawAmount);

      const paymentMethod = (['UPI', 'Credit Card', 'Debit Card', 'Cash', 'NetBanking'].includes(columns[5])
        ? columns[5]
        : 'UPI') as any;

      const type = (['Essential', 'Discretionary', 'Investment', 'Recurring'].includes(columns[6])
        ? columns[6]
        : 'Discretionary') as any;

      const notes = columns[7] || 'Imported via CSV';

      if (amount > 0) {
        parsedExpenses.push({
          id: `imp_${Date.now()}_${i}`,
          title,
          amount,
          category,
          date,
          paymentMethod,
          type,
          notes,
          tags: ['imported']
        });
      }
    }
  }

  return parsedExpenses;
}

export function getSampleCSVTemplate(): string {
  return [
    'Transaction ID,Date (YYYY-MM-DD),Title / Description,Category,Amount (INR),Payment Method,Expense Type,Notes,Tags',
    'exp_001,2026-10-01,"Fresh Grocery Mart","Groceries",1250,"UPI","Essential","Weekly vegetables and staples","supermarket; monthly"',
    'exp_002,2026-10-02,"Electricity Bill BESCOM","Utilities & Bills",2400,"NetBanking","Essential","September bill","power; home"',
    'exp_003,2026-10-03,"Weekend Coffee & Brunch","Food & Dining",650,"Credit Card","Discretionary","Third Wave Coffee with friend","cafe"',
    'exp_004,2026-10-04,"Metro Smart Card Recharge","Transportation",500,"UPI","Essential","Namma Metro monthly pass","commute"',
    'exp_005,2026-10-05,"SIP Mutual Fund","Investments & Savings",5000,"NetBanking","Investment","Index Fund auto debit","wealth"'
  ].join('\r\n');
}
