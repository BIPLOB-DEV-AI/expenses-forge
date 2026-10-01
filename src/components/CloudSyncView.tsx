import React, { useState } from 'react';
import { 
  Cloud, RefreshCw, CheckCircle2, Smartphone, Laptop, 
  Tablet, Database, ShieldCheck, Wifi, History,
  HardDrive, Check
} from 'lucide-react';
import { UserSubscription, UserProfile } from '../types';

interface CloudSyncViewProps {
  subscription: UserSubscription;
  userProfile: UserProfile;
  onTriggerSync: () => void;
  onRestoreSnapshot: (snapshotName: string) => void;
}

export const CloudSyncView: React.FC<CloudSyncViewProps> = ({
  subscription,
  userProfile,
  onTriggerSync,
  onRestoreSnapshot,
}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState('Local storage & offline PWA cache active');
  const [restoredMsg, setRestoredMsg] = useState<string | null>(null);

  const handleSyncClick = () => {
    setIsSyncing(true);
    setSyncStatusMsg('Verifying local database and cached offline tables...');
    setTimeout(() => {
      setIsSyncing(false);
      onTriggerSync();
      setSyncStatusMsg('Database validated and synchronized with device storage.');
      setTimeout(() => {
        setSyncStatusMsg('Local storage & offline PWA cache active');
      }, 3000);
    }, 900);
  };

  const handleRestore = (name: string) => {
    onRestoreSnapshot(name);
    setRestoredMsg(`Successfully restored ledger from snapshot "${name}"`);
    setTimeout(() => setRestoredMsg(null), 3000);
  };

  const linkedDevices = [
    { name: 'This Device (Local Host Session)', type: 'current', icon: Laptop, location: 'Localhost / 0.0.0.0:3000', lastActive: 'Active Now' },
    { name: 'Mobile PWA Client (Wi-Fi / Hotspot)', type: 'mobile', icon: Smartphone, location: 'Local Network IP:3000', lastActive: 'Sync Ready' },
    { name: 'Tablet Standalone Client', type: 'tablet', icon: Tablet, location: 'Local Network IP:3000', lastActive: 'Sync Ready' },
  ];

  const backupSnapshots = [
    { id: 'snap_01', name: 'Automatic Local Snapshot', timestamp: 'Today, 09:30 AM', size: '42.8 KB', records: 14 },
    { id: 'snap_02', name: 'Post-Salary Monthly Budgeting', timestamp: 'Oct 01, 2026, 11:15 AM', size: '39.1 KB', records: 12 },
    { id: 'snap_03', name: 'Pre-Festival Groceries Update', timestamp: 'Sep 28, 2026, 06:40 PM', size: '34.6 KB', records: 10 },
    { id: 'snap_04', name: 'Quarterly Financial Health Audit', timestamp: 'Sep 15, 2026, 02:00 PM', size: '28.2 KB', records: 8 },
  ];

  return (
    <div className="space-y-6">

      {/* Local Hosting Banner */}
      <div className="p-6 rounded-2xl border text-slate-900 shadow-xs bg-gradient-to-r from-blue-50 via-indigo-50 to-emerald-50 border-blue-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-600 text-white">
              Local Mobile Hosting Enabled
            </span>
            <span className="text-xs text-slate-500">· 100% Free · Zero Server Dependency</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900">
            Local Mobile Hosting & Offline Storage
          </h2>
          <p className="text-xs text-slate-600 max-w-xl">
            ExpenseForge runs completely on your local network or mobile browser without requiring external paid servers or cloud locks.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
          <button
            onClick={handleSyncClick}
            disabled={isSyncing}
            className="w-full md:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-xs disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Validating...' : 'Sync Local Cache'}</span>
          </button>
        </div>
      </div>

      {restoredMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{restoredMsg}</span>
        </div>
      )}

      {/* Sync Status strip */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-medium text-slate-700">{syncStatusMsg}</span>
        </div>
        <div className="flex items-center gap-4 text-slate-500 font-mono text-[11px]">
          <span>Service Worker: PWA Active</span>
          <span>Bind: 0.0.0.0:3000</span>
        </div>
      </div>

      {/* Local Mobile Connection Instructions Box */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <Wifi className="w-5 h-5 text-blue-600" />
          <h3 className="text-base font-bold text-slate-900">
            How to Host & Access on Your Phone via Local Wi-Fi
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <div className="font-bold text-blue-700">Step 1: Same Network</div>
            <p className="text-slate-600 text-[11px]">
              Make sure your smartphone and hosting device are connected to the same Wi-Fi network or phone mobile hotspot.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <div className="font-bold text-blue-700">Step 2: Enter Local URL</div>
            <p className="text-slate-600 text-[11px]">
              Open Chrome or Safari on your phone and type <code className="bg-white px-1 border rounded font-mono text-blue-600">http://&lt;your-local-ip&gt;:3000</code>.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <div className="font-bold text-blue-700">Step 3: Install PWA</div>
            <p className="text-slate-600 text-[11px]">
              Tap "Install App" or "Add to Home Screen". The app will cache 100% of the code and work even when completely offline!
            </p>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Connected Devices & Versioned Snapshots */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Connected Local Devices */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-blue-600" />
              <h3 className="text-base font-bold text-slate-900">
                Local Mobile & Client Sessions
              </h3>
            </div>
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> All Synced
            </span>
          </div>

          <p className="text-xs text-slate-500">
            Records logged on your phone or desktop save locally into browser IndexedDB and storage.
          </p>

          <div className="space-y-3 pt-1">
            {linkedDevices.map((dev) => {
              const Icon = dev.icon;
              return (
                <div key={dev.name} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700">
                      <Icon className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-900">{dev.name}</div>
                      <div className="text-[11px] text-slate-500">{dev.location}</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-slate-600 font-medium">
                    {dev.lastActive}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Local Version Snapshots */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-indigo-600" />
              <h3 className="text-base font-bold text-slate-900">
                Database Snapshots
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-mono">
              4 Snapshots Saved
            </span>
          </div>

          <p className="text-xs text-slate-500">
            1-click recovery protects you against accidental edits or clearing browser cache.
          </p>

          <div className="space-y-2.5 pt-1">
            {backupSnapshots.map((snap) => (
              <div key={snap.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                <div>
                  <div className="text-xs font-semibold text-slate-900">{snap.name}</div>
                  <div className="text-[11px] text-slate-500 font-mono flex items-center gap-2 mt-0.5">
                    <span>{snap.timestamp}</span>
                    <span>·</span>
                    <span>{snap.records} items</span>
                    <span>·</span>
                    <span>{snap.size}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleRestore(snap.name)}
                  className="px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-1"
                >
                  <History className="w-3.5 h-3.5" />
                  Restore
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
