export function formatCurrency(amount: number, masked: boolean = false): string {
  if (masked) return '₹ •••••';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function getMonthName(monthIndex: number = new Date().getMonth()): string {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[monthIndex];
}

export function calculatePercentage(part: number, total: number): number {
  if (total <= 0) return 0;
  return Math.min(100, Math.round((part / total) * 100));
}

export function getCategoryBadgeStyle(category: string): { bg: string; text: string; border: string } {
  switch (category) {
    case 'Housing & Rent':
      return { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' };
    case 'Food & Dining':
      return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' };
    case 'Groceries':
      return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' };
    case 'Utilities & Bills':
      return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' };
    case 'Transportation':
      return { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' };
    case 'Shopping & Retail':
      return { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' };
    case 'Health & Wellness':
      return { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' };
    case 'Entertainment':
      return { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' };
    case 'Subscriptions':
      return { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200' };
    case 'Investments & Savings':
      return { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' };
    default:
      return { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' };
  }
}
