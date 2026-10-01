import React, { useState } from 'react';
import { 
  Plus, Search, Filter, Trash2, Edit3, ArrowUpDown, 
  CheckSquare, Square, Download, Sparkles, AlertTriangle, 
  Calendar, Check, Layers
} from 'lucide-react';
import { Expense, CategoryBudget, ExpenseCategory, UserSubscription, UserProfile } from '../types';
import { formatCurrency, formatDate, calculatePercentage } from '../utils/formatters';

interface ExpenseTrackerSpreadsheetProps {
  expenses: Expense[];
  categories: CategoryBudget[];
  subscription: UserSubscription;
  userProfile: UserProfile;
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
  onEditExpense: (expense: Expense) => void;
  onDeleteExpense: (id: string) => void;
  onOpenExpenseModal: () => void;
  onOpenExportModal: () => void;
}

interface FinancialTodo {
  id: string;
  task: string;
  completed: boolean;
  dueDate: string;
  category: string;
}

const INITIAL_FINANCIAL_TODOS: FinancialTodo[] = [
  { id: 'todo_1', task: 'Review pending electricity & fiber bill', completed: true, dueDate: 'Oct 05', category: 'Utilities' },
  { id: 'todo_2', task: 'Verify grocery charges against weekly limit', completed: true, dueDate: 'Oct 07', category: 'Groceries' },
  { id: 'todo_3', task: 'Schedule Nifty 50 Index Fund SIP transfer', completed: true, dueDate: 'Oct 08', category: 'Investments' },
  { id: 'todo_4', task: 'Export monthly CSV statement for tax filing', completed: false, dueDate: 'Oct 15', category: 'Tax & Export' },
  { id: 'todo_5', task: 'Check family circle split for weekend lunch', completed: false, dueDate: 'Oct 18', category: 'Social Circle' },
  { id: 'todo_6', task: 'Review card reward points & subscription renewals', completed: false, dueDate: 'Oct 25', category: 'Subscriptions' },
];

export const ExpenseTrackerSpreadsheet: React.FC<ExpenseTrackerSpreadsheetProps> = ({
  expenses,
  categories,
  subscription,
  userProfile,
  onAddExpense,
  onEditExpense,
  onDeleteExpense,
  onOpenExpenseModal,
  onOpenExportModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [selectedPaymentFilter, setSelectedPaymentFilter] = useState<string>('all');
  const [todos, setTodos] = useState<FinancialTodo[]>(INITIAL_FINANCIAL_TODOS);
  const [newTodoText, setNewTodoText] = useState('');
  const [sortField, setSortField] = useState<'date' | 'amount' | 'category'>('date');
  const [sortAsc, setSortAsc] = useState(false);

  // Quick inline entry state
  const [quickTitle, setQuickTitle] = useState('');
  const [quickAmount, setQuickAmount] = useState('');
  const [quickCategory, setQuickCategory] = useState<ExpenseCategory>('Groceries');
  const [quickMethod, setQuickMethod] = useState<'UPI' | 'Credit Card' | 'Debit Card' | 'Cash' | 'NetBanking'>('UPI');

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(quickAmount);
    if (!quickTitle.trim() || isNaN(parsedAmount) || parsedAmount <= 0) return;

    onAddExpense({
      title: quickTitle.trim(),
      amount: parsedAmount,
      category: quickCategory,
      date: new Date().toISOString().slice(0, 10),
      paymentMethod: quickMethod,
      type: quickCategory === 'Investments & Savings' ? 'Investment' : 'Essential',
      notes: 'Quick inline entry',
    });

    setQuickTitle('');
    setQuickAmount('');
  };

  const toggleTodo = (id: string) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;
    const newTodo: FinancialTodo = {
      id: `todo_${Date.now()}`,
      task: newTodoText.trim(),
      completed: false,
      dueDate: 'This Month',
      category: 'General',
    };
    setTodos(prev => [newTodo, ...prev]);
    setNewTodoText('');
  };

  // Weekly matrix aggregation calculation
  // Categorize expenses by date into weeks (Week 1: days 1-7, Week 2: 8-14, Week 3: 15-21, Week 4: 22-28, Week 5: 29-31)
  const matrixData = categories.map(cat => {
    const catExpenses = expenses.filter(e => e.category === cat.category);
    let week1 = 0;
    let week2 = 0;
    let week3 = 0;
    let week4 = 0;
    let week5 = 0;

    catExpenses.forEach(exp => {
      const day = parseInt(exp.date.split('-')[2] || '1', 10);
      if (day <= 7) week1 += exp.amount;
      else if (day <= 14) week2 += exp.amount;
      else if (day <= 21) week3 += exp.amount;
      else if (day <= 28) week4 += exp.amount;
      else week5 += exp.amount;
    });

    const totalActual = week1 + week2 + week3 + week4 + week5;
    const pct = cat.monthlyTarget > 0 ? Math.round((totalActual / cat.monthlyTarget) * 100) : 0;

    return {
      category: cat.category,
      color: cat.color,
      goal: cat.monthlyTarget,
      week1,
      week2,
      week3,
      week4,
      week5,
      totalActual,
      pct,
    };
  });

  const matrixTotalGoal = categories.reduce((sum, c) => sum + c.monthlyTarget, 0);
  const matrixTotalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const matrixOverallPct = matrixTotalGoal > 0 ? Math.round((matrixTotalSpent / matrixTotalGoal) * 100) : 0;

  // Filter and sort transactions
  const filteredExpenses = expenses.filter(exp => {
    const matchesSearch = exp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (exp.notes && exp.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategoryFilter === 'all' || exp.category === selectedCategoryFilter;
    const matchesPayment = selectedPaymentFilter === 'all' || exp.paymentMethod === selectedPaymentFilter;
    return matchesSearch && matchesCategory && matchesPayment;
  }).sort((a, b) => {
    if (sortField === 'amount') {
      return sortAsc ? a.amount - b.amount : b.amount - a.amount;
    }
    if (sortField === 'category') {
      return sortAsc ? a.category.localeCompare(b.category) : b.category.localeCompare(a.category);
    }
    // Default date
    return sortAsc ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date);
  });

  const completedTodosCount = todos.filter(t => t.completed).length;
  const todoProgressPct = calculatePercentage(completedTodosCount, todos.length);

  return (
    <div className="space-y-8">
      
      {/* SECTION 1: Flagship Weekly Matrix & Habit Planner (Inspired by Screenshots 1 & 2) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        
        {/* Banner Header matching Habit Forge style */}
        <div className="bg-[#1E40AF] text-white p-6 sm:p-7">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold tracking-wider uppercase text-blue-200 mb-1">
                Madeline's Expense Planner & Matrix
              </div>
              <h2 className="text-2xl font-black tracking-tight text-white">
                Weekly Expense Habits & Budget Targets
              </h2>
              <p className="text-xs text-blue-100 mt-1 max-w-xl">
                Stay consistent with weekly expenditure limits across all categories. Automatically calculates totals and progress.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-2.5 text-center">
                <div className="text-xs text-blue-200 font-medium">Monthly Goal</div>
                <div className="text-lg font-bold text-white tabular-nums">
                  {formatCurrency(matrixTotalGoal, userProfile.privacyMaskEnabled)}
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-2.5 text-center">
                <div className="text-xs text-blue-200 font-medium">Pace Score</div>
                <div className="text-lg font-bold text-emerald-300 tabular-nums">
                  {matrixOverallPct}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Highlights sub-strip */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-2.5 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              Automated Calculation
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              Live Variance Alerts
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-purple-600" />
              Spreadsheet View
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenExportModal}
              className="text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-1 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Export Matrix to CSV
            </button>
          </div>
        </div>

        {/* Spreadsheet Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/90 text-slate-700 border-b border-slate-200 font-semibold">
                <th className="py-3 px-4 min-w-[180px]">Expense Category</th>
                <th className="py-3 px-3 text-right">Target Goal</th>
                <th className="py-3 px-3 text-right">Week 1 (1–7)</th>
                <th className="py-3 px-3 text-right">Week 2 (8–14)</th>
                <th className="py-3 px-3 text-right text-slate-400">Week 3 (15–21)</th>
                <th className="py-3 px-3 text-right text-slate-400">Week 4 (22–28)</th>
                <th className="py-3 px-3 text-right text-slate-400">Week 5 (29–31)</th>
                <th className="py-3 px-3 text-right font-bold text-slate-900">Total Spent</th>
                <th className="py-3 px-4 text-center min-w-[140px]">Progress / Utilization</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {matrixData.map((row) => {
                const isOverBudget = row.totalActual > row.goal;
                const isWarning = row.pct >= 85 && !isOverBudget;

                return (
                  <tr key={row.category} className="hover:bg-blue-50/40 transition-colors">
                    <td className="py-3 px-4 font-sans font-medium text-slate-900 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: row.color }} />
                      <span className="truncate">{row.category}</span>
                    </td>
                    <td className="py-3 px-3 text-right text-slate-700 tabular-nums">
                      {formatCurrency(row.goal, userProfile.privacyMaskEnabled)}
                    </td>
                    <td className="py-3 px-3 text-right text-slate-800 tabular-nums font-semibold">
                      {row.week1 > 0 ? formatCurrency(row.week1, userProfile.privacyMaskEnabled) : <span className="text-slate-300">-</span>}
                    </td>
                    <td className="py-3 px-3 text-right text-slate-800 tabular-nums font-semibold">
                      {row.week2 > 0 ? formatCurrency(row.week2, userProfile.privacyMaskEnabled) : <span className="text-slate-300">-</span>}
                    </td>
                    <td className="py-3 px-3 text-right text-slate-400 tabular-nums">
                      {row.week3 > 0 ? formatCurrency(row.week3, userProfile.privacyMaskEnabled) : <span className="text-slate-300">-</span>}
                    </td>
                    <td className="py-3 px-3 text-right text-slate-400 tabular-nums">
                      {row.week4 > 0 ? formatCurrency(row.week4, userProfile.privacyMaskEnabled) : <span className="text-slate-300">-</span>}
                    </td>
                    <td className="py-3 px-3 text-right text-slate-400 tabular-nums">
                      {row.week5 > 0 ? formatCurrency(row.week5, userProfile.privacyMaskEnabled) : <span className="text-slate-300">-</span>}
                    </td>
                    <td className={`py-3 px-3 text-right tabular-nums font-bold ${
                      isOverBudget ? 'text-rose-600' : isWarning ? 'text-amber-600' : 'text-slate-900'
                    }`}>
                      {formatCurrency(row.totalActual, userProfile.privacyMaskEnabled)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-300 ${
                              isOverBudget ? 'bg-rose-500' : isWarning ? 'bg-amber-500' : 'bg-blue-600'
                            }`}
                            style={{ width: `${Math.min(100, row.pct)}%` }}
                          />
                        </div>
                        <span className={`text-[11px] font-bold shrink-0 ${
                          isOverBudget ? 'text-rose-600' : isWarning ? 'text-amber-600' : 'text-slate-600'
                        }`}>
                          {row.pct}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-slate-50 font-bold border-t-2 border-slate-200 text-slate-900 font-mono">
                <td className="py-3.5 px-4 font-sans uppercase text-[11px] tracking-wider text-slate-600">
                  Total Summary
                </td>
                <td className="py-3.5 px-3 text-right tabular-nums">
                  {formatCurrency(matrixTotalGoal, userProfile.privacyMaskEnabled)}
                </td>
                <td className="py-3.5 px-3 text-right tabular-nums">
                  {formatCurrency(matrixData.reduce((s, r) => s + r.week1, 0), userProfile.privacyMaskEnabled)}
                </td>
                <td className="py-3.5 px-3 text-right tabular-nums">
                  {formatCurrency(matrixData.reduce((s, r) => s + r.week2, 0), userProfile.privacyMaskEnabled)}
                </td>
                <td className="py-3.5 px-3 text-right text-slate-400 tabular-nums">
                  {formatCurrency(matrixData.reduce((s, r) => s + r.week3, 0), userProfile.privacyMaskEnabled)}
                </td>
                <td className="py-3.5 px-3 text-right text-slate-400 tabular-nums">
                  {formatCurrency(matrixData.reduce((s, r) => s + r.week4, 0), userProfile.privacyMaskEnabled)}
                </td>
                <td className="py-3.5 px-3 text-right text-slate-400 tabular-nums">
                  {formatCurrency(matrixData.reduce((s, r) => s + r.week5, 0), userProfile.privacyMaskEnabled)}
                </td>
                <td className="py-3.5 px-3 text-right tabular-nums text-blue-700">
                  {formatCurrency(matrixTotalSpent, userProfile.privacyMaskEnabled)}
                </td>
                <td className="py-3.5 px-4 text-center font-sans text-xs">
                  <span className="font-extrabold text-blue-700">{matrixOverallPct}% Overall Pace</span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Footer Guarantee Strip matching screenshot #1 */}
        <div className="bg-blue-600 text-white px-6 py-3 flex flex-wrap items-center justify-between text-xs gap-3">
          <div className="flex items-center gap-6">
            <span>✓ Simple & Powerful</span>
            <span>✓ Automated Tracking</span>
            <span>✓ Works on All Devices</span>
            <span>✓ Auto Updates</span>
            <span>✓ 100% Secure & Private</span>
          </div>
          <button
            onClick={onOpenExpenseModal}
            className="px-3 py-1 bg-white text-blue-800 hover:bg-blue-50 font-bold rounded shadow-xs text-xs transition-colors"
          >
            + Add New Expense Row
          </button>
        </div>

      </div>

      {/* SECTION 2: Financial Habits To-Do Checklist (Inspired by Screenshot #3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 2 Cols: Quick Entry + Filtered Transactions */}
        <div className="lg:col-span-2 space-y-6">

          {/* Quick Inline Entry Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>Quick Log Transaction</span>
              <span className="text-[11px] text-slate-500 font-normal">Press Enter or click Add to record instantly</span>
            </div>

            <form onSubmit={handleQuickAdd} className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
              <div className="sm:col-span-4">
                <input
                  type="text"
                  placeholder="Expense description (e.g. Metro Pass)"
                  value={quickTitle}
                  onChange={(e) => setQuickTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white transition-colors"
                />
              </div>

              <div className="sm:col-span-2">
                <input
                  type="number"
                  placeholder="Amount ₹"
                  value={quickAmount}
                  onChange={(e) => setQuickAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white transition-colors"
                />
              </div>

              <div className="sm:col-span-3">
                <select
                  value={quickCategory}
                  onChange={(e) => setQuickCategory(e.target.value as any)}
                  className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white"
                >
                  {categories.map((c) => (
                    <option key={c.category} value={c.category}>
                      {c.category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <select
                  value={quickMethod}
                  onChange={(e) => setQuickMethod(e.target.value as any)}
                  className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white"
                >
                  <option value="UPI">UPI</option>
                  <option value="Credit Card">Card</option>
                  <option value="Debit Card">Debit</option>
                  <option value="NetBanking">NetBank</option>
                  <option value="Cash">Cash</option>
                </select>
              </div>

              <div className="sm:col-span-1">
                <button
                  type="submit"
                  className="w-full h-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center justify-center transition-colors shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>

          {/* Search, Filter & Transaction Ledger */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            
            {/* Filter Bar */}
            <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {/* Category filter */}
                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                  className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-600"
                >
                  <option value="all">All Categories</option>
                  {categories.map(c => (
                    <option key={c.category} value={c.category}>{c.category}</option>
                  ))}
                </select>

                {/* Payment filter */}
                <select
                  value={selectedPaymentFilter}
                  onChange={(e) => setSelectedPaymentFilter(e.target.value)}
                  className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-600"
                >
                  <option value="all">All Payment Modes</option>
                  <option value="UPI">UPI</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Debit Card">Debit Card</option>
                  <option value="NetBanking">NetBanking</option>
                  <option value="Cash">Cash</option>
                </select>

                <button
                  onClick={onOpenExportModal}
                  className="p-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                  title="Export to CSV"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Transaction List */}
            <div className="divide-y divide-slate-100 max-h-[460px] overflow-y-auto">
              {filteredExpenses.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs">
                  No transactions found matching your filter criteria.
                </div>
              ) : (
                filteredExpenses.map((exp) => (
                  <div 
                    key={exp.id} 
                    className="p-3.5 hover:bg-slate-50 flex items-center justify-between gap-3 transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 font-bold text-xs">
                        {exp.category.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-slate-900 truncate">
                          {exp.title}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                          <span>{formatDate(exp.date)}</span>
                          <span aria-hidden="true">·</span>
                          <span>{exp.category}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono text-slate-600">{exp.paymentMethod}</span>
                          {exp.type && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="text-slate-400">{exp.type}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs font-bold text-slate-900 tabular-nums">
                        {formatCurrency(exp.amount, userProfile.privacyMaskEnabled)}
                      </span>

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onEditExpense(exp)}
                          className="p-1 text-slate-400 hover:text-blue-600 rounded transition-colors"
                          title="Edit transaction"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteExpense(exp.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                          title="Delete transaction"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex justify-between items-center">
              <span>Showing {filteredExpenses.length} of {expenses.length} records</span>
              <span className="font-mono font-semibold text-slate-700">
                Sum: {formatCurrency(filteredExpenses.reduce((s, e) => s + e.amount, 0), userProfile.privacyMaskEnabled)}
              </span>
            </div>

          </div>

        </div>

        {/* 1 Col: To-Do Checklist (Inspired by Screenshot #3) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between space-y-5">
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  Bonus Tool
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  Financial Habit To-Do List
                </h3>
                <p className="text-xs text-slate-500">
                  Stay disciplined with monthly accountability tasks.
                </p>
              </div>
            </div>

            {/* Progress Bar matching Screenshot #3 */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
                <span>Monthly Discipline Progress</span>
                <span className="font-mono text-blue-600">{todoProgressPct}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 rounded-full transition-all duration-300"
                  style={{ width: `${todoProgressPct}%` }}
                />
              </div>
            </div>

            {/* Checklist */}
            <div className="space-y-2.5 pt-1">
              {todos.map((todo) => (
                <div 
                  key={todo.id}
                  onClick={() => toggleTodo(todo.id)}
                  className={`flex items-start gap-3 p-2.5 rounded-xl border transition-colors cursor-pointer ${
                    todo.completed 
                      ? 'bg-slate-50/70 border-slate-200 text-slate-400' 
                      : 'bg-white border-slate-200 hover:border-blue-400 text-slate-800'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {todo.completed ? (
                      <CheckSquare className="w-4 h-4 text-blue-600" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-xs font-medium leading-tight ${todo.completed ? 'line-through text-slate-400' : ''}`}>
                      {todo.task}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1 font-mono">
                      <span>{todo.dueDate}</span>
                      <span>·</span>
                      <span>{todo.category}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add new todo form */}
            <form onSubmit={handleAddTodo} className="flex gap-2 pt-2">
              <input
                type="text"
                placeholder="Add financial habit task..."
                value={newTodoText}
                onChange={(e) => setNewTodoText(e.target.value)}
                className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                Add
              </button>
            </form>
          </div>

          <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-xl text-xs text-blue-800">
            <strong>Pro Tip:</strong> Completing monthly financial audits on time prevents overspending by up to 18%.
          </div>

        </div>

      </div>

    </div>
  );
};
