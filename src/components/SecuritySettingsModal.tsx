import React, { useState } from 'react';
import { 
  X, ShieldCheck, Lock, EyeOff, Eye, Download, 
  Upload, Trash2, KeyRound, CheckCircle2 
} from 'lucide-react';
import { UserProfile, Expense, CategoryBudget } from '../types';

interface SecuritySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  expenses: Expense[];
  categories: CategoryBudget[];
  onResetData: () => void;
  onRestoreDataFromJSON: (data: { expenses: Expense[]; categories: CategoryBudget[] }) => void;
}

export const SecuritySettingsModal: React.FC<SecuritySettingsModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onUpdateProfile,
  expenses,
  categories,
  onResetData,
  onRestoreDataFromJSON,
}) => {
  const [passcode, setPasscode] = useState(userProfile.passcode || '');
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTogglePrivacy = () => {
    onUpdateProfile({ privacyMaskEnabled: !userProfile.privacyMaskEnabled });
  };

  const handleSavePasscode = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      isPasscodeProtected: passcode.length > 0,
      passcode: passcode.length > 0 ? passcode : undefined,
    });
    setStatusMsg('Passcode security preferences saved successfully.');
    setTimeout(() => setStatusMsg(null), 2500);
  };

  const handleExportJSON = () => {
    const backupData = {
      user: userProfile,
      exportedAt: new Date().toISOString(),
      expenses,
      categories,
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ExpenseForge_SecureBackup_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.expenses && Array.isArray(json.expenses)) {
          onRestoreDataFromJSON({
            expenses: json.expenses,
            categories: json.categories || categories,
          });
          setStatusMsg(`Restored ${json.expenses.length} records from backup file.`);
          setTimeout(() => setStatusMsg(null), 2500);
        }
      } catch (err) {
        setStatusMsg('Invalid JSON backup file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">
              Security & Privacy Vault
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">

          {statusMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{statusMsg}</span>
            </div>
          )}

          {/* User Account Info */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
            <div>
              <div className="font-bold text-slate-900">{userProfile.name}</div>
              <div className="text-slate-500 font-mono text-[11px]">{userProfile.email}</div>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
              VERIFIED
            </span>
          </div>

          {/* Privacy Screen Mode Toggle */}
          <div className="flex items-center justify-between p-3.5 border border-slate-200 rounded-xl">
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                {userProfile.privacyMaskEnabled ? <EyeOff className="w-3.5 h-3.5 text-blue-600" /> : <Eye className="w-3.5 h-3.5" />}
                <span>Privacy Screen (Mask Currency Numbers)</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Replaces all visible Rupee values with ₹ ••••• when viewing in public cafes or offices.
              </p>
            </div>
            <button
              onClick={handleTogglePrivacy}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                userProfile.privacyMaskEnabled ? 'bg-blue-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  userProfile.privacyMaskEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Passcode Security */}
          <form onSubmit={handleSavePasscode} className="space-y-3 border border-slate-200 p-3.5 rounded-xl">
            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-blue-600" />
              <span>4-Digit Security Passcode</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Optional vault passcode required when switching to expense tabs.
            </p>
            <div className="flex gap-2">
              <input
                type="password"
                maxLength={4}
                placeholder="e.g. 1234 (Leave blank to disable)"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-mono tracking-widest focus:ring-1 focus:ring-blue-600 focus:outline-none"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
              >
                Save
              </button>
            </div>
          </form>

          {/* Data Backup & Restore */}
          <div className="space-y-2 pt-1">
            <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Local Vault Data Management
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleExportJSON}
                className="flex-1 py-2 px-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Backup JSON
              </button>

              <label className="flex-1 py-2 px-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span>Restore JSON</span>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleImportJSON}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Reset Data */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => {
                if (window.confirm('Reset sample records back to initial state?')) {
                  onResetData();
                  onClose();
                }
              }}
              className="text-xs text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Reset to Demo Seed Data
            </button>

            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
            >
              Done
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
