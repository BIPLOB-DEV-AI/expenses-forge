import React from 'react';
import { Star, ShieldCheck, Check, Sparkles, RefreshCw, Smartphone, Award, Lock, Download, Wifi } from 'lucide-react';
import { TESTIMONIALS_DATA } from '../data/initialData';
import { UserSubscription } from '../types';

interface ProductLandingBannerProps {
  subscription: UserSubscription;
  onNavigateTab: (tab: string) => void;
  onOpenExpenseModal: () => void;
}

export const ProductLandingBanner: React.FC<ProductLandingBannerProps> = ({
  subscription,
  onNavigateTab,
  onOpenExpenseModal,
}) => {
  return (
    <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mt-8">
      
      {/* Hero Showcase Header */}
      <div className="p-8 sm:p-12 text-center max-w-4xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>100% Free · No Payment Required · Local Mobile Hosting</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Track Freely, Use Forever
        </h2>

        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
          One unified system for all your personal expenses, weekly matrix habit planning, visual analytics, and family sharing. Works completely offline on mobile.
        </p>

        {/* Action CTAs */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onOpenExpenseModal}
            className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-extrabold rounded-xl shadow-md hover:shadow-lg transition-all text-sm flex items-center justify-center gap-2"
          >
            <span>+ Log New Transaction</span>
            <span className="text-blue-200 text-xs font-normal">· Instant</span>
          </button>

          <button
            onClick={() => onNavigateTab('tracker')}
            className="w-full sm:w-auto px-6 py-3.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold rounded-xl border border-slate-200 transition-colors text-sm"
          >
            Explore Weekly Matrix Planner
          </button>
        </div>
      </div>

      {/* 3 Interactive Feature Mockup Previews */}
      <div className="px-6 pb-8 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Mockup 1: Weekly Matrix */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-blue-600 flex items-center justify-between">
            <span>01. Weekly Habits Matrix</span>
            <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-mono">AUTOMATED</span>
          </div>
          <div className="bg-white rounded-xl p-3 border border-slate-200 text-[11px] font-mono space-y-1.5 shadow-2xs">
            <div className="flex justify-between font-semibold text-slate-700 border-b pb-1">
              <span>Category</span>
              <span>W1 · W2 · W3</span>
              <span>Goal</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Groceries</span>
              <span className="text-emerald-600">₹2.8k · ₹1.4k</span>
              <span>₹8.5k</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Dining Out</span>
              <span className="text-amber-600">₹1.2k · ₹900</span>
              <span>₹6.0k</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>SIP Mutual</span>
              <span className="text-blue-600">₹10k · 0</span>
              <span>₹15k</span>
            </div>
          </div>
          <p className="text-xs text-slate-600">
            Categorize daily spending across 5 weekly buckets. Calculates completion rings and status flags.
          </p>
        </div>

        {/* Mockup 2: Visual Charts & Analytics */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 flex items-center justify-between">
            <span>02. Dynamic Visuals</span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-mono">REAL-TIME</span>
          </div>
          <div className="bg-white rounded-xl p-3 border border-slate-200 text-[11px] space-y-2 shadow-2xs">
            <div className="flex justify-between text-slate-700 font-semibold">
              <span>Burn Rate Velocity</span>
              <span className="font-mono text-blue-600">₹1,580/day</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex">
              <div className="bg-blue-600 w-1/2 h-full" />
              <div className="bg-purple-500 w-1/4 h-full" />
              <div className="bg-emerald-500 w-1/4 h-full" />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>Needs 50%</span>
              <span>Wants 30%</span>
              <span>Savings 20%</span>
            </div>
          </div>
          <p className="text-xs text-slate-600">
            Instant SVG charts, interactive category breakdown rings, and 50/30/20 financial health compliance.
          </p>
        </div>

        {/* Mockup 3: Private Social Sharing */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-purple-600 flex items-center justify-between">
            <span>03. Family & Friend Circles</span>
            <span className="text-[10px] bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded font-mono">PRIVATE</span>
          </div>
          <div className="bg-white rounded-xl p-3 border border-slate-200 text-[11px] space-y-1.5 shadow-2xs">
            <div className="flex justify-between items-center text-slate-800 font-semibold">
              <span>Sharma Family Circle</span>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1 rounded font-mono">4 Members</span>
            </div>
            <div className="text-[10px] text-slate-500">
              Benchmark: You are <strong>34% more frugal</strong> in Food & Dining this month.
            </div>
            <div className="pt-1 text-[10px] font-mono text-slate-600 flex justify-between">
              <span>Split Bills Ledger:</span>
              <span className="text-blue-700 font-bold">₹1,200 owed to you</span>
            </div>
          </div>
          <p className="text-xs text-slate-600">
            Compare spending habits anonymously within private groups. Split dinner and household utility bills.
          </p>
        </div>

      </div>

      {/* 5-Star Testimonials */}
      <div className="border-t border-slate-200 bg-slate-50/60 p-8 sm:p-10">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-1 text-amber-400 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400" />
              ))}
            </div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">
              Loved by 160,000+ Mindful Savers
            </h3>
            <p className="text-xs text-slate-500">
              Verified customer feedback from productivity enthusiasts and household planners.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {TESTIMONIALS_DATA.map((t) => (
              <div key={t.name} className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-0.5 text-amber-400 mb-2">
                    {[...Array(t.rating)].map((_, idx) => (
                      <Star key={idx} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed italic">
                    "{t.quote}"
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-100">
                  <div className="text-xs font-bold text-slate-900">— {t.name}</div>
                  <div className="text-[10px] text-slate-500">{t.role}</div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Guaranteed Value Badges */}
      <div className="bg-[#1E40AF] text-white py-4 px-6">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-around gap-4 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-200" />
            <span>100% FREE · All Features Unlocked</span>
          </div>
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-blue-200" />
            <span>LOCAL MOBILE HOSTING · Works Offline</span>
          </div>
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-blue-200" />
            <span>RE-USE EVERY YEAR · Unlimited Entries</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-blue-200" />
            <span>BUILT FOR RESULTS · Stay Mindful</span>
          </div>
        </div>
      </div>

      {/* Trust Bar Bottom */}
      <div className="bg-slate-950 text-white py-3 px-6 text-center text-xs tracking-wider uppercase font-extrabold flex items-center justify-center gap-2">
        <div className="flex text-amber-400">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
          ))}
        </div>
        <span>TRUSTED BY 160,000+ HAPPY USERS</span>
      </div>

    </section>
  );
};
