/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  INITIAL_EXPENSES, 
  INITIAL_CATEGORIES, 
  INITIAL_SPENDING_CIRCLES, 
  INITIAL_USER_PROFILE, 
  INITIAL_USER_SUBSCRIPTION 
} from './data/initialData';
import { Expense, CategoryBudget, SpendingCircle, UserProfile, UserSubscription, SharedExpense } from './types';
import { TopNav } from './components/TopNav';
import { DashboardOverview } from './components/DashboardOverview';
import { ExpenseTrackerSpreadsheet } from './components/ExpenseTrackerSpreadsheet';
import { SocialCircles } from './components/SocialCircles';
import { CloudSyncView } from './components/CloudSyncView';
import { ExpenseModal } from './components/ExpenseModal';
import { ExportModal } from './components/ExportModal';
import { SecuritySettingsModal } from './components/SecuritySettingsModal';
import { ProductLandingBanner } from './components/ProductLandingBanner';
import { MobileBottomNav } from './components/MobileBottomNav';
import { OfflineIndicator } from './components/OfflineIndicator';
import { Plus } from 'lucide-react';

export default function App() {
  // Local storage state initialization
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    try {
      const saved = localStorage.getItem('ef_expenses');
      return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
    } catch {
      return INITIAL_EXPENSES;
    }
  });

  const [categories, setCategories] = useState<CategoryBudget[]>(() => {
    try {
      const saved = localStorage.getItem('ef_categories');
      return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  });

  const [circles, setCircles] = useState<SpendingCircle[]>(() => {
    try {
      const saved = localStorage.getItem('ef_circles');
      return saved ? JSON.parse(saved) : INITIAL_SPENDING_CIRCLES;
    } catch {
      return INITIAL_SPENDING_CIRCLES;
    }
  });

  const [activeCircleId, setActiveCircleId] = useState<string>(() => {
    return INITIAL_SPENDING_CIRCLES[0].id;
  });

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('ef_user_profile');
      return saved ? JSON.parse(saved) : INITIAL_USER_PROFILE;
    } catch {
      return INITIAL_USER_PROFILE;
    }
  });

  const [subscription, setSubscription] = useState<UserSubscription>(() => {
    try {
      const saved = localStorage.getItem('ef_subscription');
      return saved ? JSON.parse(saved) : INITIAL_USER_SUBSCRIPTION;
    } catch {
      return INITIAL_USER_SUBSCRIPTION;
    }
  });

  const [currentTab, setCurrentTab] = useState<string>('overview');

  // Modal open states
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  // Sync state to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('ef_expenses', JSON.stringify(expenses));
    } catch (e) {
      console.warn('Storage save error:', e);
    }
  }, [expenses]);

  useEffect(() => {
    try {
      localStorage.setItem('ef_categories', JSON.stringify(categories));
    } catch (e) {
      console.warn('Storage save error:', e);
    }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem('ef_circles', JSON.stringify(circles));
    } catch (e) {
      console.warn('Storage save error:', e);
    }
  }, [circles]);

  useEffect(() => {
    try {
      localStorage.setItem('ef_user_profile', JSON.stringify(userProfile));
    } catch (e) {
      console.warn('Storage save error:', e);
    }
  }, [userProfile]);

  useEffect(() => {
    try {
      localStorage.setItem('ef_subscription', JSON.stringify(subscription));
    } catch (e) {
      console.warn('Storage save error:', e);
    }
  }, [subscription]);

  // Actions
  const handleAddExpense = (newExp: Omit<Expense, 'id'>) => {
    const expenseWithId: Expense = {
      ...newExp,
      id: `exp_${Date.now()}`,
    };
    setExpenses(prev => [expenseWithId, ...prev]);
  };

  const handleEditExpense = (updated: Expense) => {
    setExpenses(prev => prev.map(e => e.id === updated.id ? updated : e));
    setEditingExpense(null);
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  const handleOpenEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setIsExpenseModalOpen(true);
  };

  const handleImportExpenses = (imported: Expense[]) => {
    setExpenses(prev => [...imported, ...prev]);
  };

  const handleTriggerSync = () => {
    setSubscription(prev => ({
      ...prev,
      lastCloudSync: 'Just now',
    }));
  };

  const handleRestoreSnapshot = (snapshotName: string) => {
    setSubscription(prev => ({
      ...prev,
      lastCloudSync: `Restored: ${snapshotName}`,
    }));
  };

  const handleTogglePrivacyMask = () => {
    setUserProfile(prev => ({
      ...prev,
      privacyMaskEnabled: !prev.privacyMaskEnabled,
    }));
  };

  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    setUserProfile(prev => ({
      ...prev,
      ...updated,
    }));
  };

  const handleResetData = () => {
    setExpenses(INITIAL_EXPENSES);
    setCategories(INITIAL_CATEGORIES);
    setCircles(INITIAL_SPENDING_CIRCLES);
    setUserProfile(INITIAL_USER_PROFILE);
    setSubscription(INITIAL_USER_SUBSCRIPTION);
  };

  const handleRestoreDataFromJSON = (data: { expenses: Expense[]; categories: CategoryBudget[] }) => {
    setExpenses(data.expenses);
    if (data.categories) setCategories(data.categories);
  };

  // Spending Circle handlers
  const handleCreateCircle = (name: string, description: string) => {
    const newCircle: SpendingCircle = {
      id: `circle_${Date.now()}`,
      name,
      description,
      inviteCode: `${name.replace(/[^A-Z0-9]/gi, '').slice(0, 5).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      createdDate: new Date().toISOString().slice(0, 10),
      sharedCategories: ['Food & Dining', 'Groceries', 'Utilities & Bills'],
      members: [
        {
          id: userProfile.id,
          name: `${userProfile.name} (You)`,
          avatar: userProfile.name.split(' ').map(n => n[0]).join('').slice(0, 2),
          role: 'admin',
          totalMonthlySpent: expenses.reduce((s, e) => s + e.amount, 0),
          topCategory: 'Housing & Rent',
          savingsRate: 35,
          joinedDate: new Date().toISOString().slice(0, 10),
          isCurrentUser: true,
        }
      ],
      sharedExpenses: []
    };

    setCircles(prev => [newCircle, ...prev]);
    setActiveCircleId(newCircle.id);
  };

  const handleJoinCircle = (inviteCode: string) => {
    const existing = circles.find(c => c.inviteCode === inviteCode);
    if (existing) {
      setActiveCircleId(existing.id);
      return;
    }
    const simulatedCircle: SpendingCircle = {
      id: `circle_joined_${Date.now()}`,
      name: `Private Group (${inviteCode})`,
      description: 'Shared habit comparison group',
      inviteCode,
      createdDate: new Date().toISOString().slice(0, 10),
      sharedCategories: ['Food & Dining', 'Groceries'],
      members: [
        {
          id: `usr_host_${Date.now()}`,
          name: 'Host Member',
          avatar: 'HM',
          role: 'admin',
          totalMonthlySpent: 34000,
          topCategory: 'Food & Dining',
          savingsRate: 30,
          joinedDate: '2026-09-10',
        },
        {
          id: userProfile.id,
          name: `${userProfile.name} (You)`,
          avatar: 'MS',
          role: 'member',
          totalMonthlySpent: expenses.reduce((s, e) => s + e.amount, 0),
          topCategory: 'Housing & Rent',
          savingsRate: 35,
          joinedDate: new Date().toISOString().slice(0, 10),
          isCurrentUser: true,
        }
      ],
      sharedExpenses: []
    };
    setCircles(prev => [simulatedCircle, ...prev]);
    setActiveCircleId(simulatedCircle.id);
  };

  const handleAddSharedExpense = (circleId: string, expense: Omit<SharedExpense, 'id'>) => {
    const fullExpense: SharedExpense = {
      ...expense,
      id: `sh_exp_${Date.now()}`,
    };
    setCircles(prev => prev.map(c => {
      if (c.id === circleId) {
        return {
          ...c,
          sharedExpenses: [fullExpense, ...c.sharedExpenses]
        };
      }
      return c;
    }));
  };

  const handleSettleSharedExpense = (circleId: string, expenseId: string) => {
    setCircles(prev => prev.map(c => {
      if (c.id === circleId) {
        return {
          ...c,
          sharedExpenses: c.sharedExpenses.map(e => e.id === expenseId ? { ...e, settled: true } : e)
        };
      }
      return c;
    }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 pb-16 md:pb-0 selection:bg-blue-100 selection:text-blue-900">
      
      {/* Top Bar Header */}
      <TopNav
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        userProfile={userProfile}
        subscription={subscription}
        onTogglePrivacyMask={handleTogglePrivacyMask}
        onOpenExpenseModal={() => {
          setEditingExpense(null);
          setIsExpenseModalOpen(true);
        }}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onOpenSecurityModal={() => setIsSecurityModalOpen(true)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {currentTab === 'overview' && (
          <>
            <DashboardOverview
              expenses={expenses}
              categories={categories}
              subscription={subscription}
              userProfile={userProfile}
              onOpenExpenseModal={() => {
                setEditingExpense(null);
                setIsExpenseModalOpen(true);
              }}
              onOpenExportModal={() => setIsExportModalOpen(true)}
              onNavigateTab={setCurrentTab}
            />
            {/* 100% Free & Local Product Showcase */}
            <ProductLandingBanner
              subscription={subscription}
              onNavigateTab={setCurrentTab}
              onOpenExpenseModal={() => {
                setEditingExpense(null);
                setIsExpenseModalOpen(true);
              }}
            />
          </>
        )}

        {currentTab === 'tracker' && (
          <ExpenseTrackerSpreadsheet
            expenses={expenses}
            categories={categories}
            subscription={subscription}
            userProfile={userProfile}
            onAddExpense={handleAddExpense}
            onEditExpense={handleOpenEditExpense}
            onDeleteExpense={handleDeleteExpense}
            onOpenExpenseModal={() => {
              setEditingExpense(null);
              setIsExpenseModalOpen(true);
            }}
            onOpenExportModal={() => setIsExportModalOpen(true)}
          />
        )}

        {currentTab === 'social' && (
          <SocialCircles
            circles={circles}
            activeCircleId={activeCircleId}
            onSelectCircle={setActiveCircleId}
            onCreateCircle={handleCreateCircle}
            onJoinCircle={handleJoinCircle}
            onAddSharedExpense={handleAddSharedExpense}
            onSettleSharedExpense={handleSettleSharedExpense}
            subscription={subscription}
            userProfile={userProfile}
          />
        )}

        {currentTab === 'cloud' && (
          <CloudSyncView
            subscription={subscription}
            userProfile={userProfile}
            onTriggerSync={handleTriggerSync}
            onRestoreSnapshot={handleRestoreSnapshot}
          />
        )}

        {currentTab === 'export' && (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div className="max-w-xl">
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded inline-block mb-1">
                Unlimited & Free
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                CSV Export & Data Management
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Download your full expense transactions, monthly budget performance reports, or import bank statements without any locks.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <h3 className="text-base font-bold text-slate-900">
                  Export Detailed Transactions
                </h3>
                <p className="text-xs text-slate-600">
                  Formatted in standard RFC-4180 CSV with IDs, timestamps, payment methods, categories, and amounts.
                </p>
                <button
                  onClick={() => setIsExportModalOpen(true)}
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
                >
                  Download Detailed CSV
                </button>
              </div>

              <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <h3 className="text-base font-bold text-slate-900">
                  Import Bank Statement or CSV
                </h3>
                <p className="text-xs text-slate-600">
                  Quickly import previous transactions from any spreadsheet, CSV export, or accounting software.
                </p>
                <button
                  onClick={() => setIsExportModalOpen(true)}
                  className="px-5 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg shadow-xs transition-colors"
                >
                  Upload CSV File
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Global Modals */}
      <ExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => {
          setIsExpenseModalOpen(false);
          setEditingExpense(null);
        }}
        categories={categories}
        onSaveExpense={(exp) => {
          if ('id' in exp) {
            handleEditExpense(exp as Expense);
          } else {
            handleAddExpense(exp);
          }
        }}
        editingExpense={editingExpense}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        expenses={expenses}
        categories={categories}
        subscription={subscription}
        onImportExpenses={handleImportExpenses}
      />

      <SecuritySettingsModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
        userProfile={userProfile}
        onUpdateProfile={handleUpdateProfile}
        expenses={expenses}
        categories={categories}
        onResetData={handleResetData}
        onRestoreDataFromJSON={handleRestoreDataFromJSON}
      />

      {/* Desktop/Tablet Floating Quick Add button for ultra convenience */}
      <button
        onClick={() => {
          setEditingExpense(null);
          setIsExpenseModalOpen(true);
        }}
        className="hidden md:flex fixed bottom-6 right-6 z-30 w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white items-center justify-center shadow-lg transition-transform"
        title="Quick Log Expense"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Mobile-first bottom navigation bar */}
      <MobileBottomNav
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenExpenseModal={() => {
          setEditingExpense(null);
          setIsExpenseModalOpen(true);
        }}
      />

      {/* Offline Toast Indicator */}
      <OfflineIndicator />

      {/* Subtle Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">ExpenseForge</span>
            <span>·</span>
            <span>Local & Mobile Offline Personal Expense Planner</span>
          </div>

          <div className="flex items-center gap-4 text-slate-600">
            <button onClick={() => setIsSecurityModalOpen(true)} className="hover:text-slate-900 transition-colors">
              Security Vault
            </button>
            <button onClick={() => setIsExportModalOpen(true)} className="hover:text-slate-900 transition-colors">
              CSV Export
            </button>
            <button onClick={() => setCurrentTab('cloud')} className="hover:text-blue-600 font-semibold transition-colors">
              Local Mobile Host
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
