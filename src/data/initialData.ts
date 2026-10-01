import { Expense, CategoryBudget, SpendingCircle, UserSubscription, UserProfile } from '../types';

export const INITIAL_USER_PROFILE: UserProfile = {
  id: 'usr_madeline_01',
  name: 'Madeline Sharma',
  email: 'db139228@gmail.com',
  currency: 'INR',
  monthlyBudget: 65000,
  privacyMaskEnabled: false,
  isPasscodeProtected: false,
};

export const INITIAL_USER_SUBSCRIPTION: UserSubscription = {
  isLifetimeUnlocked: true, // 100% Free & Unlocked by default
  unlockedAt: '2026-10-01',
  licenseKey: 'EXPENSEFORGE-LOCAL-FREE',
  isCloudSubscribed: true, // Fully enabled
  subscriptionTier: 'free_unlocked',
  lastCloudSync: 'Today at 09:30 AM',
  autoSyncEnabled: true,
  cloudBackupCount: 4,
};

export const INITIAL_CATEGORIES: CategoryBudget[] = [
  { category: 'Housing & Rent', monthlyTarget: 22000, color: '#3B82F6', iconName: 'Home' },
  { category: 'Groceries', monthlyTarget: 8500, color: '#10B981', iconName: 'ShoppingBag' },
  { category: 'Food & Dining', monthlyTarget: 6000, color: '#F59E0B', iconName: 'Utensils' },
  { category: 'Utilities & Bills', monthlyTarget: 4500, color: '#6366F1', iconName: 'Zap' },
  { category: 'Transportation', monthlyTarget: 3500, color: '#06B6D4', iconName: 'Car' },
  { category: 'Shopping & Retail', monthlyTarget: 5000, color: '#EC4899', iconName: 'Tag' },
  { category: 'Health & Wellness', monthlyTarget: 3000, color: '#EF4444', iconName: 'HeartPulse' },
  { category: 'Entertainment', monthlyTarget: 2500, color: '#8B5CF6', iconName: 'Film' },
  { category: 'Subscriptions', monthlyTarget: 1500, color: '#14B8A6', iconName: 'Clock' },
  { category: 'Investments & Savings', monthlyTarget: 15000, color: '#059669', iconName: 'TrendingUp' },
  { category: 'Miscellaneous', monthlyTarget: 2000, color: '#64748B', iconName: 'Layers' },
];

export const INITIAL_EXPENSES: Expense[] = [
  {
    id: 'exp_01',
    title: 'Apartment Monthly Rent',
    amount: 22000,
    category: 'Housing & Rent',
    date: '2026-10-01',
    paymentMethod: 'NetBanking',
    type: 'Essential',
    notes: 'October flat rent transfer to landlord',
    tags: ['rent', 'fixed']
  },
  {
    id: 'exp_02',
    title: 'Nature Basket Supermarket',
    amount: 2840,
    category: 'Groceries',
    date: '2026-10-02',
    paymentMethod: 'UPI',
    type: 'Essential',
    notes: 'Monthly grains, olive oil, and organic veggies',
    tags: ['groceries', 'household']
  },
  {
    id: 'exp_03',
    title: 'Airtel Xstream Fiber & DTH',
    amount: 1179,
    category: 'Utilities & Bills',
    date: '2026-10-02',
    paymentMethod: 'Credit Card',
    type: 'Essential',
    notes: 'High speed internet 300mbps',
    tags: ['internet', 'bills']
  },
  {
    id: 'exp_04',
    title: 'Third Wave Coffee Roasters',
    amount: 480,
    category: 'Food & Dining',
    date: '2026-10-03',
    paymentMethod: 'UPI',
    type: 'Discretionary',
    notes: 'Cold brew and almond croissant with team',
    tags: ['cafe', 'coffee']
  },
  {
    id: 'exp_05',
    title: 'Uber Premier to Client Office',
    amount: 620,
    category: 'Transportation',
    date: '2026-10-03',
    paymentMethod: 'UPI',
    type: 'Essential',
    notes: 'Meeting commute to Whitefield',
    tags: ['cab', 'work']
  },
  {
    id: 'exp_06',
    title: 'Zomato Gourmet Dinner Box',
    amount: 890,
    category: 'Food & Dining',
    date: '2026-10-04',
    paymentMethod: 'UPI',
    type: 'Discretionary',
    notes: 'Paneer tikka and naan dinner',
    tags: ['dinner', 'delivery']
  },
  {
    id: 'exp_07',
    title: 'Weekly Farm Fresh Veggies & Fruits',
    amount: 1450,
    category: 'Groceries',
    date: '2026-10-05',
    paymentMethod: 'UPI',
    type: 'Essential',
    notes: 'Local farmers market harvest basket',
    tags: ['fresh', 'veggies']
  },
  {
    id: 'exp_08',
    title: 'Nifty 50 Index Mutual Fund SIP',
    amount: 10000,
    category: 'Investments & Savings',
    date: '2026-10-05',
    paymentMethod: 'NetBanking',
    type: 'Investment',
    notes: 'Monthly automated wealth accumulation',
    tags: ['sip', 'longterm']
  },
  {
    id: 'exp_09',
    title: 'Apollo Pharmacy Vitamins & Care',
    amount: 850,
    category: 'Health & Wellness',
    date: '2026-10-06',
    paymentMethod: 'Debit Card',
    type: 'Essential',
    notes: 'Multivitamins and Omega-3 capsules',
    tags: ['health', 'wellness']
  },
  {
    id: 'exp_10',
    title: 'Zara Autumn Linen Shirt',
    amount: 2490,
    category: 'Shopping & Retail',
    date: '2026-10-07',
    paymentMethod: 'Credit Card',
    type: 'Discretionary',
    notes: 'Work wardrobe upgrade',
    tags: ['apparel', 'fashion']
  },
  {
    id: 'exp_11',
    title: 'Spotify Family & Netflix HD',
    amount: 649,
    category: 'Subscriptions',
    date: '2026-10-07',
    paymentMethod: 'Credit Card',
    type: 'Recurring',
    notes: 'Monthly digital entertainment pack',
    tags: ['entertainment', 'monthly']
  },
  {
    id: 'exp_12',
    title: 'PVR INOX Weekend Movie Tickets',
    amount: 980,
    category: 'Entertainment',
    date: '2026-10-08',
    paymentMethod: 'UPI',
    type: 'Discretionary',
    notes: 'IMAX 3D cinema night with popcorn',
    tags: ['movies', 'weekend']
  },
  {
    id: 'exp_13',
    title: 'Indian Oil Fuel Refill',
    amount: 1800,
    category: 'Transportation',
    date: '2026-10-09',
    paymentMethod: 'Credit Card',
    type: 'Essential',
    notes: 'Full tank petrol for city runs',
    tags: ['fuel', 'car']
  },
  {
    id: 'exp_14',
    title: 'Swiggy Instamart Dairy & Snacks',
    amount: 620,
    category: 'Groceries',
    date: '2026-10-10',
    paymentMethod: 'UPI',
    type: 'Essential',
    notes: 'Milk, Greek yogurt, sourdough loaf',
    tags: ['dairy', 'quick']
  }
];

export const INITIAL_SPENDING_CIRCLES: SpendingCircle[] = [
  {
    id: 'circle_family_01',
    name: 'Sharma Family Household Circle',
    description: 'Shared family transparency to optimize groceries, home utilities, and leisure budgets.',
    inviteCode: 'SHARMA-7729',
    createdDate: '2026-08-15',
    sharedCategories: ['Housing & Rent', 'Groceries', 'Utilities & Bills', 'Food & Dining'],
    members: [
      {
        id: 'usr_madeline_01',
        name: 'Madeline Sharma (You)',
        avatar: 'MS',
        role: 'admin',
        totalMonthlySpent: 45878,
        topCategory: 'Housing & Rent',
        savingsRate: 34,
        joinedDate: '2026-08-15',
        isCurrentUser: true,
      },
      {
        id: 'mbr_02',
        name: 'Aarav Sharma',
        avatar: 'AS',
        role: 'member',
        totalMonthlySpent: 38200,
        topCategory: 'Food & Dining',
        savingsRate: 28,
        joinedDate: '2026-08-16',
      },
      {
        id: 'mbr_03',
        name: 'Pooja Sharma',
        avatar: 'PS',
        role: 'member',
        totalMonthlySpent: 29500,
        topCategory: 'Shopping & Retail',
        savingsRate: 42,
        joinedDate: '2026-08-18',
      },
      {
        id: 'mbr_04',
        name: 'Rohan Sharma',
        avatar: 'RS',
        role: 'member',
        totalMonthlySpent: 21400,
        topCategory: 'Investments & Savings',
        savingsRate: 51,
        joinedDate: '2026-09-01',
      },
    ],
    sharedExpenses: [
      {
        id: 'sh_exp_01',
        title: 'Electricity & Water Utility Bill',
        amount: 3200,
        category: 'Utilities & Bills',
        date: '2026-10-02',
        paidBy: 'usr_madeline_01',
        splitAmong: ['usr_madeline_01', 'mbr_02', 'mbr_03', 'mbr_04'],
        settled: true,
      },
      {
        id: 'sh_exp_02',
        title: 'Diwali Home Sweets & Gift Hampers',
        amount: 4800,
        category: 'Groceries',
        date: '2026-10-06',
        paidBy: 'mbr_02',
        splitAmong: ['usr_madeline_01', 'mbr_02', 'mbr_03'],
        settled: false,
      },
      {
        id: 'sh_exp_03',
        title: 'Family Weekend Lunch at Punjab Grill',
        amount: 5400,
        category: 'Food & Dining',
        date: '2026-10-08',
        paidBy: 'mbr_03',
        splitAmong: ['usr_madeline_01', 'mbr_02', 'mbr_03', 'mbr_04'],
        settled: false,
      }
    ]
  },
  {
    id: 'circle_friends_02',
    name: 'Bangalore Flat 4B Roommates',
    description: 'Track rent splits, cook maid salary, grocery stock, and Friday pizza nights.',
    inviteCode: 'FLAT4B-BLR',
    createdDate: '2026-09-01',
    sharedCategories: ['Groceries', 'Utilities & Bills', 'Food & Dining'],
    members: [
      {
        id: 'usr_madeline_01',
        name: 'Madeline Sharma (You)',
        avatar: 'MS',
        role: 'member',
        totalMonthlySpent: 45878,
        topCategory: 'Housing & Rent',
        savingsRate: 34,
        joinedDate: '2026-09-01',
        isCurrentUser: true,
      },
      {
        id: 'mbr_f1',
        name: 'Vikram Mehta',
        avatar: 'VM',
        role: 'admin',
        totalMonthlySpent: 52100,
        topCategory: 'Food & Dining',
        savingsRate: 19,
        joinedDate: '2026-09-01',
      },
      {
        id: 'mbr_f2',
        name: 'Karan Singhania',
        avatar: 'KS',
        role: 'member',
        totalMonthlySpent: 34500,
        topCategory: 'Entertainment',
        savingsRate: 38,
        joinedDate: '2026-09-03',
      }
    ],
    sharedExpenses: [
      {
        id: 'sh_exp_f1',
        title: 'Flat High-Speed Internet Bill',
        amount: 1499,
        category: 'Utilities & Bills',
        date: '2026-10-04',
        paidBy: 'usr_madeline_01',
        splitAmong: ['usr_madeline_01', 'mbr_f1', 'mbr_f2'],
        settled: true,
      },
      {
        id: 'sh_exp_f2',
        title: 'Cook & Housekeeping Monthly Pay',
        amount: 9000,
        category: 'Utilities & Bills',
        date: '2026-10-05',
        paidBy: 'mbr_f1',
        splitAmong: ['usr_madeline_01', 'mbr_f1', 'mbr_f2'],
        settled: false,
      }
    ]
  }
];

export const TESTIMONIALS_DATA = [
  {
    name: 'Emily Watson',
    role: 'Product Designer',
    rating: 5,
    quote: 'This expense tracker is so beautifully structured. It completely eliminated my chaotic spreadsheet formulas and keeps me mindful every single week.'
  },
  {
    name: 'Daniel R. Rao',
    role: 'Fintech Engineer',
    rating: 5,
    quote: 'Clean, simple, and incredibly fast. The ₹21 lifetime access is the best digital purchase I made this year. CSV export is instantaneous.'
  },
  {
    name: 'Mallory Jenkins',
    role: 'Freelance Architect',
    rating: 5,
    quote: 'The weekly matrix layout mirrors exactly how I review my project accounts. Being able to compare dining habits in our family circle saved us ₹8,000 last month.'
  },
  {
    name: 'Samantha K.',
    role: 'Health Consultant',
    rating: 5,
    quote: 'Such a thoughtfully engineered tool. Thoughtfully designed, no subscriptions needed for core usage, and 100% private on my device.'
  }
];
