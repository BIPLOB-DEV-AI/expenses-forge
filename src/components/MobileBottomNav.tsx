import React from 'react';
import { LayoutDashboard, Table2, Plus, Users, Download, Database } from 'lucide-react';

interface MobileBottomNavProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenExpenseModal: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  onSelectTab,
  onOpenExpenseModal,
}) => {
  const items = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'tracker', label: 'Matrix', icon: Table2 },
    { id: 'quick_log', label: 'Add', icon: Plus, isAction: true },
    { id: 'social', label: 'Groups', icon: Users },
    { id: 'export', label: 'Data', icon: Download },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 shadow-lg">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          if (item.isAction) {
            return (
              <button
                key={item.id}
                onClick={onOpenExpenseModal}
                className="flex flex-col items-center justify-center -mt-5"
                title="Log New Expense"
              >
                <div className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white flex items-center justify-center shadow-lg transition-transform">
                  <Plus className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold text-blue-700 mt-0.5">Add</span>
              </button>
            );
          }

          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-col items-center py-1 px-2.5 rounded-lg transition-colors ${
                isActive ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
