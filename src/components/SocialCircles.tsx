import React, { useState } from 'react';
import { 
  Users, UserPlus, Share2, Award, ArrowRight, Check, 
  Copy, ShieldCheck, DollarSign, Split, Sparkles, AlertCircle
} from 'lucide-react';
import { SpendingCircle, GroupMember, SharedExpense, UserSubscription, UserProfile } from '../types';
import { formatCurrency, calculatePercentage } from '../utils/formatters';

interface SocialCirclesProps {
  circles: SpendingCircle[];
  activeCircleId: string;
  onSelectCircle: (id: string) => void;
  onCreateCircle: (name: string, description: string) => void;
  onJoinCircle: (inviteCode: string) => void;
  onAddSharedExpense: (circleId: string, expense: Omit<SharedExpense, 'id'>) => void;
  onSettleSharedExpense: (circleId: string, expenseId: string) => void;
  subscription: UserSubscription;
  userProfile: UserProfile;
}

export const SocialCircles: React.FC<SocialCirclesProps> = ({
  circles,
  activeCircleId,
  onSelectCircle,
  onCreateCircle,
  onJoinCircle,
  onAddSharedExpense,
  onSettleSharedExpense,
  subscription,
  userProfile,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showAddSharedModal, setShowAddSharedModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Form states
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  const [joinCodeInput, setJoinCodeInput] = useState('');

  // Shared bill form
  const [billTitle, setBillTitle] = useState('');
  const [billAmount, setBillAmount] = useState('');
  const [billCategory, setBillCategory] = useState<any>('Food & Dining');
  const [billPaidBy, setBillPaidBy] = useState('');

  const currentCircle = circles.find(c => c.id === activeCircleId) || circles[0];

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    onCreateCircle(newGroupName.trim(), newGroupDesc.trim() || 'Private family & friends spending circle');
    setShowCreateModal(false);
    setNewGroupName('');
    setNewGroupDesc('');
  };

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCodeInput.trim()) return;
    onJoinCircle(joinCodeInput.trim().toUpperCase());
    setShowJoinModal(false);
    setJoinCodeInput('');
  };

  const handleAddSharedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(billAmount);
    if (!currentCircle || !billTitle.trim() || isNaN(amount) || amount <= 0) return;

    onAddSharedExpense(currentCircle.id, {
      title: billTitle.trim(),
      amount,
      category: billCategory,
      date: new Date().toISOString().slice(0, 10),
      paidBy: billPaidBy || currentCircle.members[0].id,
      splitAmong: currentCircle.members.map(m => m.id),
      settled: false,
    });

    setShowAddSharedModal(false);
    setBillTitle('');
    setBillAmount('');
  };

  if (!currentCircle) {
    return (
      <div className="p-8 text-center text-slate-500">
        No active spending circle found.
      </div>
    );
  }

  // Calculate Group Average Spend
  const totalGroupSpend = currentCircle.members.reduce((sum, m) => sum + m.totalMonthlySpent, 0);
  const avgMemberSpend = Math.round(totalGroupSpend / Math.max(1, currentCircle.members.length));
  const currentUserMember = currentCircle.members.find(m => m.isCurrentUser) || currentCircle.members[0];

  // Compare spending metrics
  const differenceFromAvg = currentUserMember.totalMonthlySpent - avgMemberSpend;
  const isMoreFrugal = differenceFromAvg <= 0;
  const frugalityPercent = avgMemberSpend > 0 ? Math.abs(Math.round((differenceFromAvg / avgMemberSpend) * 100)) : 0;

  // Split ledger unsettled balance calculation for current user
  const unsettledExpenses = currentCircle.sharedExpenses.filter(e => !e.settled);
  let totalUserOwedToOthers = 0;
  let totalOthersOwedToUser = 0;

  unsettledExpenses.forEach(exp => {
    const splitCount = exp.splitAmong.length || 1;
    const sharePerPerson = exp.amount / splitCount;

    if (exp.paidBy === currentUserMember.id) {
      // User paid, others owe user
      totalOthersOwedToUser += sharePerPerson * (splitCount - 1);
    } else if (exp.splitAmong.includes(currentUserMember.id)) {
      // Someone else paid, user owes their share
      totalUserOwedToOthers += sharePerPerson;
    }
  });

  return (
    <div className="space-y-6">

      {/* Group Selector & Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              Private Group Sharing
            </span>
            <span className="text-xs text-slate-500">· Opt-in Habit Benchmarking</span>
          </div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {currentCircle.name}
            </h2>
            <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-lg text-xs font-mono text-slate-700">
              <span>Code: {currentCircle.inviteCode}</span>
              <button 
                onClick={() => handleCopyCode(currentCircle.inviteCode)}
                className="hover:text-blue-600 transition-colors"
                title="Copy Invite Code"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            {currentCircle.description}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Group Switcher Dropdown */}
          <select
            value={currentCircle.id}
            onChange={(e) => onSelectCircle(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
          >
            {circles.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <button
            onClick={() => setShowJoinModal(true)}
            className="px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors"
          >
            Join Group
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors whitespace-nowrap"
          >
            <UserPlus className="w-3.5 h-3.5" />
            + New Circle
          </button>
        </div>
      </div>

      {/* Spending Habits Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Card 1: Your Habit vs Group Benchmark */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Habit Benchmark
          </div>
          <div className="text-2xl font-black text-slate-900 tabular-nums">
            {isMoreFrugal ? (
              <span className="text-emerald-700">{frugalityPercent}% More Frugal</span>
            ) : (
              <span className="text-amber-700">{frugalityPercent}% Above Average</span>
            )}
          </div>
          <p className="text-xs text-slate-600">
            Your monthly spend is <strong className="text-slate-900">{formatCurrency(currentUserMember.totalMonthlySpent, userProfile.privacyMaskEnabled)}</strong> compared to group average of <strong className="text-slate-900">{formatCurrency(avgMemberSpend, userProfile.privacyMaskEnabled)}</strong>.
          </p>
          <div className="pt-1">
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex">
              <div 
                className="bg-blue-600 h-full"
                style={{ width: `${Math.min(100, (currentUserMember.totalMonthlySpent / (avgMemberSpend * 1.5 || 1)) * 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>You: {formatCurrency(currentUserMember.totalMonthlySpent, userProfile.privacyMaskEnabled)}</span>
              <span>Group Avg: {formatCurrency(avgMemberSpend, userProfile.privacyMaskEnabled)}</span>
            </div>
          </div>
        </div>

        {/* Card 2: Smart Saver Champion */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
            <span>Discipline Leaderboard</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          {(() => {
            const sortedBySavings = [...currentCircle.members].sort((a, b) => b.savingsRate - a.savingsRate);
            const leader = sortedBySavings[0];
            return (
              <>
                <div className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <span>{leader.name}</span>
                  <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                    ★ #1 Saver
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  Leading this circle with a <strong className="text-emerald-700 font-bold">{leader.savingsRate}% monthly savings rate</strong>. Top focused category: {leader.topCategory}.
                </p>
                <div className="text-[11px] text-slate-500">
                  Your rank: #{sortedBySavings.findIndex(m => m.isCurrentUser) + 1} of {currentCircle.members.length} members
                </div>
              </>
            );
          })()}
        </div>

        {/* Card 3: Shared Split Balances */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
            <span>Shared Bills Ledger</span>
            <Split className="w-4 h-4 text-blue-600" />
          </div>
          <div className="space-y-1">
            {totalOthersOwedToUser > totalUserOwedToOthers ? (
              <div className="text-2xl font-black text-emerald-700 tabular-nums">
                +{formatCurrency(Math.round(totalOthersOwedToUser - totalUserOwedToOthers), userProfile.privacyMaskEnabled)}
                <span className="text-xs font-normal text-slate-500 ml-1.5">owed to you</span>
              </div>
            ) : totalUserOwedToOthers > totalOthersOwedToUser ? (
              <div className="text-2xl font-black text-rose-600 tabular-nums">
                -{formatCurrency(Math.round(totalUserOwedToOthers - totalOthersOwedToUser), userProfile.privacyMaskEnabled)}
                <span className="text-xs font-normal text-slate-500 ml-1.5">you owe group</span>
              </div>
            ) : (
              <div className="text-2xl font-black text-slate-700 tabular-nums">
                All Settled Up
              </div>
            )}
          </div>
          <p className="text-xs text-slate-600">
            {unsettledExpenses.length} pending shared expenses in this group pool.
          </p>
          <button
            onClick={() => setShowAddSharedModal(true)}
            className="w-full py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors"
          >
            + Split a New Bill / Dinner
          </button>
        </div>

      </div>

      {/* Main Grid: Member Comparison Table & Shared Expense Split Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* 7 Cols: Member Spending Habits Matrix */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Member Spending Habits & Profiles
              </h3>
              <p className="text-xs text-slate-500">
                End-to-end encrypted sharing with opt-in category visibility
              </p>
            </div>
            <span className="text-xs font-medium text-slate-500">
              {currentCircle.members.length} Active Members
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/70 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">Member</th>
                  <th className="py-2.5 px-3 text-right">Total Spend</th>
                  <th className="py-2.5 px-3">Top Category</th>
                  <th className="py-2.5 px-3 text-right">Savings Rate</th>
                  <th className="py-2.5 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {currentCircle.members.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-sans font-medium text-slate-900 flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                        {member.avatar}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">
                          {member.name}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          Joined {member.joinedDate}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right text-slate-800 font-semibold tabular-nums">
                      {formatCurrency(member.totalMonthlySpent, userProfile.privacyMaskEnabled)}
                    </td>
                    <td className="py-3 px-3 font-sans text-slate-700">
                      {member.topCategory}
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums text-emerald-700 font-bold">
                      {member.savingsRate}%
                    </td>
                    <td className="py-3 px-4 text-center font-sans">
                      {member.role === 'admin' ? (
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                          ADMIN
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                          MEMBER
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Zero raw bank statements shared. Only summarized habit distribution is synced.</span>
          </div>
        </div>

        {/* 5 Cols: Shared Expenses & Split Bills Ledger */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Shared Group Pool & Splits
            </h3>
            <button
              onClick={() => setShowAddSharedModal(true)}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              + Add Bill
            </button>
          </div>

          <div className="divide-y divide-slate-100 max-h-[360px] overflow-y-auto">
            {currentCircle.sharedExpenses.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                No shared expenses logged yet. Add your first shared dinner or bill!
              </div>
            ) : (
              currentCircle.sharedExpenses.map((exp) => {
                const payer = currentCircle.members.find(m => m.id === exp.paidBy)?.name || 'Someone';
                const splitAmount = Math.round(exp.amount / (exp.splitAmong.length || 1));

                return (
                  <div key={exp.id} className="p-3.5 hover:bg-slate-50 transition-colors flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 truncate">
                        {exp.title}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <span>Paid by {payer}</span>
                        <span>·</span>
                        <span className="font-mono text-slate-700">₹{splitAmount}/person</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className="text-right">
                        <div className="text-xs font-bold text-slate-900 tabular-nums">
                          {formatCurrency(exp.amount, userProfile.privacyMaskEnabled)}
                        </div>
                        <div className="text-[10px]">
                          {exp.settled ? (
                            <span className="text-emerald-600 font-semibold">Settled</span>
                          ) : (
                            <span className="text-amber-600 font-semibold">Pending</span>
                          )}
                        </div>
                      </div>

                      {!exp.settled && (
                        <button
                          onClick={() => onSettleSharedExpense(currentCircle.id, exp.id)}
                          className="px-2 py-1 text-[11px] font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 rounded transition-colors"
                        >
                          Settle
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-600 flex justify-between items-center">
            <span>Invite family via code: <strong className="font-mono text-blue-700">{currentCircle.inviteCode}</strong></span>
            <button
              onClick={() => handleCopyCode(currentCircle.inviteCode)}
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Copy
            </button>
          </div>
        </div>

      </div>

      {/* Modal: Create Circle */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900">
              Create New Spending Circle
            </h3>
            <p className="text-xs text-slate-500">
              Set up a private group for your household, couple budgeting, or travel group.
            </p>

            <form onSubmit={handleCreateSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Group Name</label>
                <input
                  type="text"
                  placeholder="e.g. Goa Trip Squad 2026"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-blue-600 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Purpose / Description</label>
                <input
                  type="text"
                  placeholder="e.g. Tracking villa stays, dinners, and taxi cabs"
                  value={newGroupDesc}
                  onChange={(e) => setNewGroupDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                >
                  Create Circle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Join Circle */}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900">
              Join Private Group with Invite Code
            </h3>
            <p className="text-xs text-slate-500">
              Enter the 6 to 10 character code provided by your family member or friend.
            </p>

            <form onSubmit={handleJoinSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Invite Code</label>
                <input
                  type="text"
                  placeholder="e.g. SHARMA-7729"
                  value={joinCodeInput}
                  onChange={(e) => setJoinCodeInput(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono uppercase focus:ring-1 focus:ring-blue-600 focus:outline-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowJoinModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                >
                  Join Circle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Shared Bill */}
      {showAddSharedModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900">
              Split a Group Expense
            </h3>
            <p className="text-xs text-slate-500">
              Splits automatically across all {currentCircle.members.length} members of {currentCircle.name}.
            </p>

            <form onSubmit={handleAddSharedSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Bill Description</label>
                <input
                  type="text"
                  placeholder="e.g. Weekend Barbeque & Drinks"
                  value={billTitle}
                  onChange={(e) => setBillTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-blue-600 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Amount ₹</label>
                  <input
                    type="number"
                    placeholder="2500"
                    value={billAmount}
                    onChange={(e) => setBillAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:ring-1 focus:ring-blue-600 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Paid By</label>
                  <select
                    value={billPaidBy}
                    onChange={(e) => setBillPaidBy(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-blue-600 focus:outline-none"
                  >
                    {currentCircle.members.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddSharedModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                >
                  Save & Split
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
