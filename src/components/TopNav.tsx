import React from 'react';
import { Eye, EyeOff, ShieldCheck, Plus, Lock, Download, Smartphone } from 'lucide-react';
import { UserProfile, UserSubscription } from '../types';
import { PWAInstallButton } from './PWAInstallButton';

interface TopNavProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  userProfile: UserProfile;
  subscription: UserSubscription;
  onTogglePrivacyMask: () => void;
  onOpenExpenseModal: () => void;
  onOpenExportModal: () => void;
  onOpenSecurityModal: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  currentTab,
  onSelectTab,
  userProfile,
  subscription,
  onTogglePrivacyMask,
  onOpenExpenseModal,
  onOpenExportModal,
  onOpenSecurityModal,
}) => {
  const navItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'tracker', label: 'Planner & Matrix' },
    { id: 'social', label: 'Family & Circles' },
    { id: 'cloud', label: 'Local & Sync' },
    { id: 'export', label: 'CSV Data' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onSelectTab('overview')}
            className="flex items-center gap-2.5 text-left focus:outline-none group"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm group-hover:bg-blue-700 transition-colors">
              EF
            </div>
            <span className="text-lg font-extrabold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
              ExpenseForge
            </span>
          </button>

          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            100% FREE & LOCAL
          </span>
        </div>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`transition-colors whitespace-nowrap py-1 relative ${
                  isActive
                    ? 'text-blue-600 font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* PWA Install Button & Local Mobile Hosting guide */}
          <PWAInstallButton />

          {/* Quick CSV Export */}
          <button
            onClick={onOpenExportModal}
            title="Export CSV"
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 hidden sm:flex items-center"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Privacy Mask Toggle */}
          <button
            onClick={onTogglePrivacyMask}
            title={userProfile.privacyMaskEnabled ? 'Show amounts' : 'Mask financial amounts for privacy'}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
          >
            {userProfile.privacyMaskEnabled ? (
              <EyeOff className="w-4 h-4 text-blue-600" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>

          {/* Security / Vault button */}
          <button
            onClick={onOpenSecurityModal}
            title="Security & Data Settings"
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 hidden sm:flex items-center"
          >
            <Lock className="w-4 h-4" />
          </button>

          {/* Quick Log Expense Button */}
          <button
            onClick={onOpenExpenseModal}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg transition-colors shadow-sm whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Log Expense</span>
          </button>
        </div>

      </div>

      {/* Mobile sub-bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-100 py-2 px-3 bg-slate-50/80 overflow-x-auto text-xs font-medium text-slate-600">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id)}
            className={`px-2 py-1 rounded transition-colors whitespace-nowrap ${
              currentTab === item.id ? 'bg-blue-600 text-white font-semibold' : 'hover:text-slate-900'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
