export type ExpenseCategory =
  | 'Housing & Rent'
  | 'Food & Dining'
  | 'Groceries'
  | 'Utilities & Bills'
  | 'Transportation'
  | 'Shopping & Retail'
  | 'Health & Wellness'
  | 'Entertainment'
  | 'Subscriptions'
  | 'Investments & Savings'
  | 'Education & Learning'
  | 'Miscellaneous';

export type PaymentMethod =
  | 'UPI'
  | 'Credit Card'
  | 'Debit Card'
  | 'Cash'
  | 'NetBanking';

export type ExpenseType = 'Essential' | 'Discretionary' | 'Investment' | 'Recurring';

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: string; // YYYY-MM-DD
  paymentMethod: PaymentMethod;
  type: ExpenseType;
  notes?: string;
  tags?: string[];
  groupId?: string; // Optional if shared with a group
  paidBy?: string;
}

export interface CategoryBudget {
  category: ExpenseCategory;
  monthlyTarget: number;
  color: string;
  iconName: string;
}

export interface WeeklyMatrixRow {
  category: ExpenseCategory;
  monthlyGoal: number;
  week1: number;
  week2: number;
  week3: number;
  week4: number;
  week5: number;
}

export interface GroupMember {
  id: string;
  name: string;
  avatar: string;
  role: 'admin' | 'member';
  totalMonthlySpent: number;
  topCategory: ExpenseCategory;
  savingsRate: number; // percentage
  joinedDate: string;
  isCurrentUser?: boolean;
}

export interface SharedExpense {
  id: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  paidBy: string; // member id
  splitAmong: string[]; // member ids
  settled: boolean;
}

export interface SpendingCircle {
  id: string;
  name: string;
  description: string;
  inviteCode: string;
  createdDate: string;
  members: GroupMember[];
  sharedExpenses: SharedExpense[];
  sharedCategories: ExpenseCategory[];
}

export interface UserSubscription {
  isLifetimeUnlocked: boolean; // Always true (100% free & unlocked)
  unlockedAt?: string;
  licenseKey?: string;
  isCloudSubscribed: boolean; // Always true for sync
  subscriptionTier?: 'free_unlocked' | 'local_pwa';
  lastCloudSync?: string;
  autoSyncEnabled: boolean;
  cloudBackupCount: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  currency: string;
  monthlyBudget: number;
  privacyMaskEnabled: boolean;
  isPasscodeProtected: boolean;
  passcode?: string;
}
