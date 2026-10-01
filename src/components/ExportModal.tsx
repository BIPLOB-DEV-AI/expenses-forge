import React, { useState, useRef } from 'react';
import { 
  X, Download, Upload, FileText, CheckCircle2, 
  AlertCircle, Table, Sparkles, ShieldCheck
} from 'lucide-react';
import { Expense, CategoryBudget, UserSubscription } from '../types';
import { exportExpensesToCSV, exportBudgetSummaryToCSV, parseCSVToExpenses, getSampleCSVTemplate } from '../utils/csv';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  expenses: Expense[];
  categories: CategoryBudget[];
  subscription: UserSubscription;
  onImportExpenses: (imported: Expense[]) => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  expenses,
  categories,
  subscription,
  onImportExpenses,
}) => {
  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export');
  const [exportType, setExportType] = useState<'all' | 'budget_report'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'this_month' | 'last_month'>('this_month');
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleExecuteExport = () => {
    let filtered = [...expenses];
    if (dateFilter === 'this_month') {
      const currentYearMonth = new Date().toISOString().slice(0, 7);
      filtered = filtered.filter(e => e.date.startsWith(currentYearMonth));
    }

    if (exportType === 'all') {
      exportExpensesToCSV(filtered, 'ExpenseForge_Detailed_Expenses');
    } else {
      exportBudgetSummaryToCSV(categories, filtered, 'ExpenseForge_Budget_Variance');
    }

    onClose();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = parseCSVToExpenses(text);
        if (parsed.length > 0) {
          onImportExpenses(parsed);
          setImportStatus(`Successfully imported ${parsed.length} transactions into your ledger!`);
          setTimeout(() => {
            setImportStatus(null);
            onClose();
          }, 1800);
        } else {
          setImportStatus('No valid expense records could be parsed. Check column headers.');
        }
      } catch (err) {
        setImportStatus('Error reading file. Ensure it is a valid UTF-8 CSV.');
      }
    };
    reader.readAsText(file);
  };

  const handleDownloadTemplate = () => {
    const sample = getSampleCSVTemplate();
    const blob = new Blob([sample], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ExpenseForge_Sample_Template.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-xl w-full overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">
              CSV Data Management
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-200 px-6 pt-3 gap-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('export')}
            className={`pb-3 transition-colors relative ${
              activeTab === 'export' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Export to CSV
            {activeTab === 'export' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`pb-3 transition-colors relative ${
              activeTab === 'import' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Import CSV File
            {activeTab === 'import' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
            )}
          </button>
        </div>

        <div className="p-6 space-y-5">
          {activeTab === 'export' ? (
            <div className="space-y-4">
              
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between">
                <span>Free Unlimited CSV Exports · RFC-4180 format</span>
                <span className="font-semibold text-emerald-900">Instant Download</span>
              </div>

              {/* Format selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select CSV Report Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setExportType('all')}
                    className={`p-3 rounded-xl border text-left text-xs transition-colors ${
                      exportType === 'all'
                        ? 'border-blue-600 bg-blue-50/50 text-blue-900 font-semibold'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-bold text-slate-900 mb-0.5">All Transactions</div>
                    <div className="text-[11px] text-slate-500">Every item with ID, date, category, tags, and amounts.</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setExportType('budget_report')}
                    className={`p-3 rounded-xl border text-left text-xs transition-colors ${
                      exportType === 'budget_report'
                        ? 'border-blue-600 bg-blue-50/50 text-blue-900 font-semibold'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-bold text-slate-900 mb-0.5">Budget Variance Report</div>
                    <div className="text-[11px] text-slate-500">Category targets, actual spend, variance, and % consumed.</div>
                  </button>
                </div>
              </div>

              {/* Date Filter */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Date Range
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setDateFilter('this_month')}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold ${
                      dateFilter === 'this_month' ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-200 text-slate-700'
                    }`}
                  >
                    Current Month (October 2026)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDateFilter('all')}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold ${
                      dateFilter === 'all' ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-200 text-slate-700'
                    }`}
                  >
                    All Available Records ({expenses.length} rows)
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleExecuteExport}
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download CSV
                </button>
              </div>

            </div>
          ) : (
            <div className="space-y-4">
              
              <p className="text-xs text-slate-600">
                Import expenses from standard bank statements, credit card exports, or previous ExpenseForge backups.
              </p>

              {/* Drop area */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-6 text-center cursor-pointer bg-slate-50/50 hover:bg-blue-50/20 transition-colors"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Upload className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-xs font-bold text-slate-800">
                  Click to select a .CSV file from your computer
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Supports comma-delimited columns: Date, Title, Category, Amount
                </div>
              </div>

              {importStatus && (
                <div className="p-3 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg text-xs font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>{importStatus}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handleDownloadTemplate}
                  className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download Sample CSV Template
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Close
                </button>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
};
