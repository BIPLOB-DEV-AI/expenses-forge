import React, { useState } from 'react';
import { 
  TrendingUp, TrendingDown, DollarSign, Wallet, 
  ArrowUpRight, PieChart as PieIcon, LineChart as ChartIcon, 
  Sparkles, CheckCircle2, AlertCircle, ShieldAlert
} from 'lucide-react';
import { Expense, CategoryBudget, UserSubscription, UserProfile } from '../types';
import { formatCurrency, calculatePercentage } from '../utils/formatters';

interface DashboardOverviewProps {
  expenses: Expense[];
  categories: CategoryBudget[];
  subscription: UserSubscription;
  userProfile: UserProfile;
  onOpenExpenseModal: () => void;
  onOpenExportModal: () => void;
  onNavigateTab: (tab: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  expenses,
  categories,
  subscription,
  userProfile,
  onOpenExpenseModal,
  onOpenExportModal,
  onNavigateTab,
}) => {
  const [activeDonutIndex, setActiveDonutIndex] = useState<number | null>(null);
  const [hoveredDayIndex, setHoveredDayIndex] = useState<number | null>(null);

  // Calculations
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalBudget = userProfile.monthlyBudget;
  const remainingBudget = totalBudget - totalSpent;
  const budgetUtilization = calculatePercentage(totalSpent, totalBudget);

  // Daily burn rate (assuming 10 days into October for sample)
  const currentDayOfMonth = Math.max(1, new Date().getDate());
  const dailyBurnRate = Math.round(totalSpent / Math.min(currentDayOfMonth, 30));
  const daysRemainingInMonth = 31 - currentDayOfMonth;
  const projectedMonthEndSpend = totalSpent + (dailyBurnRate * daysRemainingInMonth);

  // 50/30/20 Rule Breakdown
  const needsSpend = expenses.filter(e => e.type === 'Essential').reduce((sum, e) => sum + e.amount, 0);
  const wantsSpend = expenses.filter(e => e.type === 'Discretionary').reduce((sum, e) => sum + e.amount, 0);
  const savingsSpend = expenses.filter(e => e.type === 'Investment').reduce((sum, e) => sum + e.amount, 0);
  
  const needsPct = totalSpent > 0 ? Math.round((needsSpend / totalSpent) * 100) : 0;
  const wantsPct = totalSpent > 0 ? Math.round((wantsSpend / totalSpent) * 100) : 0;
  const savingsPct = totalSpent > 0 ? Math.round((savingsSpend / totalSpent) * 100) : 0;

  // Category breakdown calculation
  const categorySpending = categories.map(cat => {
    const spent = expenses
      .filter(e => e.category === cat.category)
      .reduce((sum, e) => sum + e.amount, 0);
    const pctOfTotal = totalSpent > 0 ? (spent / totalSpent) * 100 : 0;
    return {
      category: cat.category,
      spent,
      target: cat.monthlyTarget,
      pctOfTotal,
      color: cat.color,
    };
  }).filter(c => c.spent > 0).sort((a, b) => b.spent - a.spent);

  const topCategory = categorySpending[0] || { category: 'None', spent: 0, pctOfTotal: 0 };

  // Daily trend data generation for SVG chart (Days 1 to 10)
  const daysInPeriod = 10;
  const dailyData: { day: number; label: string; amount: number }[] = [];
  for (let d = 1; d <= daysInPeriod; d++) {
    const dayStr = d < 10 ? `2026-10-0${d}` : `2026-10-${d}`;
    const dayTotal = expenses
      .filter(e => e.date === dayStr)
      .reduce((sum, e) => sum + e.amount, 0);
    dailyData.push({
      day: d,
      label: `Oct ${d}`,
      amount: dayTotal,
    });
  }

  const maxDailyAmount = Math.max(...dailyData.map(d => d.amount), 5000);
  const chartHeight = 180;
  const chartWidth = 600;

  // Build SVG path
  const points = dailyData.map((d, index) => {
    const x = (index / (dailyData.length - 1)) * chartWidth;
    const y = chartHeight - (d.amount / maxDailyAmount) * (chartHeight - 30) - 15;
    return { x, y, ...d };
  });

  const svgAreaPath = points.length > 0
    ? `M 0 ${chartHeight} ` +
      points.map(p => `L ${p.x} ${p.y}`).join(' ') +
      ` L ${chartWidth} ${chartHeight} Z`
    : '';

  const svgLinePath = points.length > 0
    ? `M ${points[0].x} ${points[0].y} ` +
      points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ')
    : '';

  // Donut chart path calculations
  let accumulatedAngle = 0;
  const donutSlices = categorySpending.slice(0, 6).map((item) => {
    const sliceAngle = (item.spent / (totalSpent || 1)) * 360;
    const startAngle = accumulatedAngle;
    accumulatedAngle += sliceAngle;
    return {
      ...item,
      startAngle,
      endAngle: accumulatedAngle,
    };
  });

  return (
    <div className="space-y-6">

      {/* Easy Quick Actions Bar for effortless mobile/desktop tracking */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-0.5 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded tracking-wide">
              100% Free & Unlocked
            </span>
            <span className="text-xs text-slate-500">· Offline Local Storage Ready</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            Personal Financial Dashboard
          </h2>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={onOpenExpenseModal}
            className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            + Quick Add Expense
          </button>
          <button
            onClick={onOpenExportModal}
            className="flex-1 sm:flex-none px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
          >
            Download CSV
          </button>
          <button
            onClick={() => onNavigateTab('tracker')}
            className="hidden md:flex px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors items-center justify-center gap-1.5"
          >
            Open Matrix
          </button>
        </div>
      </div>

      {/* 4 Core Financial KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Spend */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
            <span>Total Month Spend</span>
            <Wallet className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 tabular-nums">
            {formatCurrency(totalSpent, userProfile.privacyMaskEnabled)}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs">
            <span className="text-slate-500">of</span>
            <span className="font-semibold text-slate-700">
              {formatCurrency(totalBudget, userProfile.privacyMaskEnabled)}
            </span>
            <span className="text-slate-400">·</span>
            <span className={`font-semibold tabular-nums ${budgetUtilization > 90 ? 'text-rose-600' : 'text-blue-600'}`}>
              {budgetUtilization}% utilized
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-full h-1.5 bg-slate-100 rounded-full mt-3 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                budgetUtilization > 90 ? 'bg-rose-500' : budgetUtilization > 75 ? 'bg-amber-500' : 'bg-blue-600'
              }`}
              style={{ width: `${Math.min(100, budgetUtilization)}%` }}
            />
          </div>
        </div>

        {/* Budget Remaining */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
            <span>Remaining Budget</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className={`text-2xl font-black tabular-nums ${remainingBudget < 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
            {formatCurrency(remainingBudget, userProfile.privacyMaskEnabled)}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-500">
            {remainingBudget >= 0 ? (
              <span className="text-emerald-600 flex items-center gap-0.5 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" /> Within safe limit
              </span>
            ) : (
              <span className="text-rose-600 flex items-center gap-0.5 font-medium">
                <AlertCircle className="w-3.5 h-3.5" /> Over budget by {formatCurrency(Math.abs(remainingBudget), userProfile.privacyMaskEnabled)}
              </span>
            )}
            <span className="text-slate-400">·</span>
            <span>{daysRemainingInMonth} days left</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full mt-3 overflow-hidden">
            <div 
              className="h-full bg-emerald-500 rounded-full transition-all"
              style={{ width: `${Math.max(0, 100 - budgetUtilization)}%` }}
            />
          </div>
        </div>

        {/* Daily Burn Rate */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
            <span>Daily Burn Rate</span>
            <TrendingUp className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 tabular-nums">
            {formatCurrency(dailyBurnRate, userProfile.privacyMaskEnabled)}
            <span className="text-xs font-normal text-slate-500"> /day</span>
          </div>
          <div className="text-xs text-slate-500 mt-2 flex items-center gap-1">
            <span>Projected month-end:</span>
            <span className="font-semibold text-slate-700 tabular-nums">
              {formatCurrency(projectedMonthEndSpend, userProfile.privacyMaskEnabled)}
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full mt-3 overflow-hidden">
            <div 
              className="h-full bg-amber-500 rounded-full transition-all"
              style={{ width: `${Math.min(100, Math.round((dailyBurnRate / 3000) * 100))}%` }}
            />
          </div>
        </div>

        {/* Top Spending Category */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
            <span>Top Spend Driver</span>
            <ArrowUpRight className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-xl font-bold text-slate-900 truncate">
            {topCategory.category}
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-800 tabular-nums">
              {formatCurrency(topCategory.spent, userProfile.privacyMaskEnabled)}
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-purple-600 font-semibold tabular-nums">
              {Math.round(topCategory.pctOfTotal)}% of total
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full mt-3 overflow-hidden">
            <div 
              className="h-full bg-purple-600 rounded-full transition-all"
              style={{ width: `${Math.min(100, Math.round(topCategory.pctOfTotal))}%` }}
            />
          </div>
        </div>

      </div>

      {/* Main Visualization Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* 2 Cols: Monthly Spending Progression Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ChartIcon className="w-5 h-5 text-blue-600" />
              <h3 className="text-base font-bold text-slate-900">
                Daily Spending Trend & Velocity
              </h3>
            </div>
            <div className="text-xs text-slate-500 font-medium">
              October 2026 · Days 1–10
            </div>
          </div>

          {/* SVG Area Chart */}
          <div className="relative pt-4 pb-2">
            <svg 
              viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
              className="w-full h-48 overflow-visible"
            >
              <defs>
                <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                const y = chartHeight - ratio * (chartHeight - 30) - 15;
                return (
                  <g key={ratio}>
                    <line
                      x1="0"
                      y1={y}
                      x2={chartWidth}
                      y2={y}
                      stroke="#E2E8F0"
                      strokeDasharray="4 4"
                      strokeWidth="1"
                    />
                    <text
                      x="0"
                      y={y - 4}
                      fill="#94A3B8"
                      fontSize="9"
                      fontFamily="JetBrains Mono"
                    >
                      {formatCurrency(Math.round(ratio * maxDailyAmount))}
                    </text>
                  </g>
                );
              })}

              {/* Area fill */}
              <path d={svgAreaPath} fill="url(#spendGradient)" />

              {/* Line path */}
              <path
                d={svgLinePath}
                fill="none"
                stroke="#2563EB"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points */}
              {points.map((p, idx) => (
                <g 
                  key={idx}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredDayIndex(idx)}
                  onMouseLeave={() => setHoveredDayIndex(null)}
                >
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={hoveredDayIndex === idx ? 6 : 4}
                    fill={hoveredDayIndex === idx ? "#1D4ED8" : "#FFFFFF"}
                    stroke="#2563EB"
                    strokeWidth={hoveredDayIndex === idx ? "3" : "2"}
                    className="transition-all duration-150"
                  />
                  <text
                    x={p.x}
                    y={chartHeight + 14}
                    textAnchor="middle"
                    fill="#64748B"
                    fontSize="10"
                    fontFamily="Plus Jakarta Sans"
                    fontWeight="500"
                  >
                    {p.day}
                  </text>
                </g>
              ))}
            </svg>

            {/* Hover Tooltip display */}
            {hoveredDayIndex !== null && points[hoveredDayIndex] && (
              <div 
                className="absolute top-2 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-mono shadow-lg pointer-events-none flex items-center gap-2"
              >
                <span className="text-slate-300">{points[hoveredDayIndex].label}:</span>
                <span className="font-bold text-emerald-400">
                  {formatCurrency(points[hoveredDayIndex].amount, userProfile.privacyMaskEnabled)}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span>Peak Day: <strong className="text-slate-800">Oct 1 (Rent ₹22,000)</strong></span>
            <span>Median Spend: <strong className="text-slate-800">₹980 / day</strong></span>
            <button
              onClick={() => onNavigateTab('tracker')}
              className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
            >
              View Detailed Matrix &rarr;
            </button>
          </div>
        </div>

        {/* 1 Col: Category Donut / Ring Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-indigo-600" />
              <h3 className="text-base font-bold text-slate-900">
                Category Distribution
              </h3>
            </div>
          </div>

          {/* SVG Donut */}
          <div className="flex items-center justify-center py-2 relative">
            <svg viewBox="0 0 160 160" className="w-40 h-40 transform -rotate-90">
              {donutSlices.map((slice, index) => {
                const strokeDasharray = `${(slice.spent / (totalSpent || 1)) * 377} 377`;
                const strokeDashoffset = -donutSlices
                  .slice(0, index)
                  .reduce((acc, s) => acc + (s.spent / (totalSpent || 1)) * 377, 0);

                return (
                  <circle
                    key={slice.category}
                    cx="80"
                    cy="80"
                    r="60"
                    fill="transparent"
                    stroke={slice.color}
                    strokeWidth={activeDonutIndex === index ? "18" : "14"}
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-200 cursor-pointer"
                    onMouseEnter={() => setActiveDonutIndex(index)}
                    onMouseLeave={() => setActiveDonutIndex(null)}
                  />
                );
              })}
            </svg>

            {/* Inner Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                {activeDonutIndex !== null ? donutSlices[activeDonutIndex]?.category : 'Total Spent'}
              </span>
              <span className="text-sm font-black text-slate-900 tabular-nums">
                {activeDonutIndex !== null 
                  ? formatCurrency(donutSlices[activeDonutIndex]?.spent || 0, userProfile.privacyMaskEnabled)
                  : formatCurrency(totalSpent, userProfile.privacyMaskEnabled)
                }
              </span>
            </div>
          </div>

          {/* Category List */}
          <div className="space-y-2 text-xs">
            {categorySpending.slice(0, 5).map((item, idx) => (
              <div 
                key={item.category} 
                onMouseEnter={() => setActiveDonutIndex(idx)}
                onMouseLeave={() => setActiveDonutIndex(null)}
                className={`flex items-center justify-between p-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeDonutIndex === idx ? 'bg-slate-100 font-semibold' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-700 truncate">{item.category}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0 font-mono">
                  <span className="text-slate-900 font-medium">
                    {formatCurrency(item.spent, userProfile.privacyMaskEnabled)}
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    {Math.round(item.pctOfTotal)}%
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* 50/30/20 Rule Section & Financial Health */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              50 / 30 / 20 Budget Health Metric
            </h3>
            <p className="text-xs text-slate-500">
              Recommended balance: 50% Needs (Rent, Utilities, Food) · 30% Wants (Leisure, Shopping) · 20% Savings/Investments
            </p>
          </div>
          <div className="text-xs font-semibold px-2.5 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200">
            Current Status: Healthy Accumulation
          </div>
        </div>

        {/* Multi-segment Progress Bar */}
        <div className="w-full h-4 bg-slate-100 rounded-full flex overflow-hidden">
          <div 
            className="bg-blue-600 transition-all duration-500 hover:opacity-90"
            style={{ width: `${needsPct}%` }}
            title={`Needs: ${needsPct}% (${formatCurrency(needsSpend)})`}
          />
          <div 
            className="bg-purple-500 transition-all duration-500 hover:opacity-90"
            style={{ width: `${wantsPct}%` }}
            title={`Wants: ${wantsPct}% (${formatCurrency(wantsSpend)})`}
          />
          <div 
            className="bg-emerald-500 transition-all duration-500 hover:opacity-90"
            style={{ width: `${savingsPct}%` }}
            title={`Investments: ${savingsPct}% (${formatCurrency(savingsSpend)})`}
          />
        </div>

        {/* 3 Metric Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100">
            <div className="flex items-center justify-between text-xs text-blue-800 font-semibold mb-1">
              <span>Needs (Target 50%)</span>
              <span className="font-mono">{needsPct}%</span>
            </div>
            <div className="text-lg font-bold text-slate-900 tabular-nums">
              {formatCurrency(needsSpend, userProfile.privacyMaskEnabled)}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Rent, Groceries, Utilities, Health</div>
          </div>

          <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100">
            <div className="flex items-center justify-between text-xs text-purple-800 font-semibold mb-1">
              <span>Wants (Target 30%)</span>
              <span className="font-mono">{wantsPct}%</span>
            </div>
            <div className="text-lg font-bold text-slate-900 tabular-nums">
              {formatCurrency(wantsSpend, userProfile.privacyMaskEnabled)}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Dining Out, Shopping, Entertainment</div>
          </div>

          <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
            <div className="flex items-center justify-between text-xs text-emerald-800 font-semibold mb-1">
              <span>Savings & SIP (Target 20%)</span>
              <span className="font-mono">{savingsPct}%</span>
            </div>
            <div className="text-lg font-bold text-slate-900 tabular-nums">
              {formatCurrency(savingsSpend, userProfile.privacyMaskEnabled)}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Mutual Fund Index SIPs, Emergency Pool</div>
          </div>
        </div>
      </div>

    </div>
  );
};
