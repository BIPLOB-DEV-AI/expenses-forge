import React, { useState, useEffect } from 'react';
import { X, Check, DollarSign, Calendar, Tag, CreditCard, Layers } from 'lucide-react';
import { Expense, ExpenseCategory, PaymentMethod, ExpenseType, CategoryBudget } from '../types';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: CategoryBudget[];
  onSaveExpense: (expense: Omit<Expense, 'id'> | Expense) => void;
  editingExpense?: Expense | null;
}

export const ExpenseModal: React.FC<ExpenseModalProps> = ({
  isOpen,
  onClose,
  categories,
  onSaveExpense,
  editingExpense,
}) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Groceries');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [type, setType] = useState<ExpenseType>('Essential');
  const [notes, setNotes] = useState('');
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (editingExpense) {
      setTitle(editingExpense.title);
      setAmount(editingExpense.amount.toString());
      setCategory(editingExpense.category);
      setDate(editingExpense.date);
      setPaymentMethod(editingExpense.paymentMethod);
      setType(editingExpense.type);
      setNotes(editingExpense.notes || '');
      setTagInput((editingExpense.tags || []).join(', '));
    } else {
      setTitle('');
      setAmount('');
      setCategory('Groceries');
      setDate(new Date().toISOString().slice(0, 10));
      setPaymentMethod('UPI');
      setType('Essential');
      setNotes('');
      setTagInput('');
    }
  }, [editingExpense, isOpen]);

  if (!isOpen) return null;

  const quickAmounts = [50, 100, 250, 500, 1000, 2000, 5000];

  const handleAddQuickAmount = (val: number) => {
    const current = parseFloat(amount) || 0;
    setAmount((current + val).toString());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!title.trim() || isNaN(parsedAmount) || parsedAmount <= 0) return;

    const tags = tagInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    if (editingExpense) {
      onSaveExpense({
        ...editingExpense,
        title: title.trim(),
        amount: parsedAmount,
        category,
        date,
        paymentMethod,
        type,
        notes: notes.trim(),
        tags,
      });
    } else {
      onSaveExpense({
        title: title.trim(),
        amount: parsedAmount,
        category,
        date,
        paymentMethod,
        type,
        notes: notes.trim(),
        tags,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {editingExpense ? 'Edit Transaction' : 'Log New Expense'}
            </h3>
            <p className="text-xs text-slate-500">
              Record daily spending into your personal spreadsheet ledger
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description / Merchant Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Swiggy Gourmet, Metro Pass, Supermarket..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:ring-1 focus:ring-blue-600 focus:outline-none"
              required
            />
          </div>

          {/* Amount + Quick rupee pills */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Amount (INR ₹) *
            </label>
            <input
              type="number"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono font-bold text-slate-900 focus:ring-1 focus:ring-blue-600 focus:outline-none"
              required
              step="any"
            />
            {/* Quick addition buttons */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className="text-[11px] text-slate-500 py-0.5 mr-1">Quick Add:</span>
              {quickAmounts.map(v => (
                <button
                  key={v}
                  type="button"
                  onClick={() => handleAddQuickAmount(v)}
                  className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-mono transition-colors"
                >
                  +₹{v}
                </button>
              ))}
            </div>
          </div>

          {/* Category & Date Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-2.5 py-2 border border-slate-300 rounded-lg text-xs text-slate-800 focus:ring-1 focus:ring-blue-600 focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c.category} value={c.category}>
                    {c.category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-2.5 py-2 border border-slate-300 rounded-lg text-xs font-mono text-slate-800 focus:ring-1 focus:ring-blue-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Payment Method & Type */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full px-2.5 py-2 border border-slate-300 rounded-lg text-xs text-slate-800 focus:ring-1 focus:ring-blue-600 focus:outline-none"
              >
                <option value="UPI">UPI (GPay / PhonePe / Paytm)</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="NetBanking">NetBanking</option>
                <option value="Cash">Cash</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Expense Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-2.5 py-2 border border-slate-300 rounded-lg text-xs text-slate-800 focus:ring-1 focus:ring-blue-600 focus:outline-none"
              >
                <option value="Essential">Essential (Need)</option>
                <option value="Discretionary">Discretionary (Want)</option>
                <option value="Investment">Investment (Savings/SIP)</option>
                <option value="Recurring">Recurring (Subscription)</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Notes (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Shared with roommates, tax deductible receipt..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:ring-1 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          {/* Footer actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-xs transition-colors"
            >
              {editingExpense ? 'Save Changes' : 'Record Transaction'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
