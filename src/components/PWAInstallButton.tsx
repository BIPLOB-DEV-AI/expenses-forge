import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X, Wifi, Check, Copy, QrCode, Monitor } from 'lucide-react';
import QRCode from 'qrcode';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);
  const [showLocalHostModal, setShowLocalHostModal] = useState(false);
  
  // Local network IP state
  const [localIp, setLocalIp] = useState('192.168.1.');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [activeTab, setActiveTab] = useState<'current_url' | 'local_ip'>('current_url');

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
  const customLocalUrl = `http://${localIp.trim()}:3000`;
  const targetUrl = activeTab === 'current_url' ? currentOrigin : customLocalUrl;

  useEffect(() => {
    QRCode.toDataURL(targetUrl, {
      width: 200,
      margin: 2,
      color: {
        dark: '#0F172A',
        light: '#FFFFFF',
      },
    })
      .then(url => setQrCodeDataUrl(url))
      .catch(err => console.error(err));
  }, [targetUrl]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <>
      <div className="flex items-center gap-1.5">
        {/* If installable on Android / Chromium desktop */}
        {isInstallable && !isInstalled && (
          <button
            onClick={install}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-xs transition-colors whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install App</span>
          </button>
        )}

        {/* If on iOS Safari */}
        {isIOS && !isInstalled && (
          <button
            onClick={() => setShowGuide(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-xs transition-colors whitespace-nowrap"
          >
            <Smartphone className="w-3.5 h-3.5 text-blue-600" />
            <span>Install on iOS</span>
          </button>
        )}

        {/* Local mobile hosting & Scan with Phone button */}
        <button
          onClick={() => setShowLocalHostModal(true)}
          title="Open or Host on Mobile via Local Wi-Fi"
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
        >
          <QrCode className="w-3.5 h-3.5 text-blue-600" />
          <span className="hidden sm:inline">Mobile QR Connect</span>
        </button>
      </div>

      {/* iOS Safari Guide Modal */}
      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">Install on iPhone / iPad</h3>
              </div>
              <button onClick={() => setShowGuide(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex items-start gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold shrink-0 text-xs">
                  1
                </div>
                <div>
                  Tap the <strong className="text-slate-900">Share button</strong> (square with arrow icon) in the bottom toolbar of Safari.
                </div>
              </div>

              <div className="flex items-start gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold shrink-0 text-xs">
                  2
                </div>
                <div>
                  Scroll down the sheet and tap <strong className="text-slate-900">Add to Home Screen</strong>.
                </div>
              </div>

              <div className="flex items-start gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold shrink-0 text-xs">
                  3
                </div>
                <div>
                  Tap <strong className="text-slate-900">Add</strong> in the top-right. ExpenseForge now runs full screen like a native mobile app!
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowGuide(false)}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* Local Mobile Hosting & Interactive QR Modal */}
      {showLocalHostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Wifi className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">Scan & Open on Mobile</h3>
              </div>
              <button onClick={() => setShowLocalHostModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* URL Selector Tabs */}
            <div className="flex border border-slate-200 rounded-lg p-1 bg-slate-50 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('current_url')}
                className={`flex-1 py-1.5 font-semibold rounded-md transition-colors ${
                  activeTab === 'current_url' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Direct Cloud / App URL
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('local_ip')}
                className={`flex-1 py-1.5 font-semibold rounded-md transition-colors ${
                  activeTab === 'local_ip' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Local Network (0.0.0.0:3000)
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-5 p-2">
              {/* QR Code Container */}
              <div className="w-44 h-44 bg-white p-2 rounded-xl border border-slate-200 shadow-xs shrink-0 flex items-center justify-center">
                {qrCodeDataUrl ? (
                  <img src={qrCodeDataUrl} alt="Mobile QR Code" className="w-full h-full object-contain" />
                ) : (
                  <div className="text-slate-400 text-xs">Generating QR...</div>
                )}
              </div>

              {/* Instructions & Controls */}
              <div className="space-y-3 flex-1 text-xs text-slate-600">
                {activeTab === 'local_ip' ? (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Enter your computer's local Wi-Fi IP:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. 192.168.1.15"
                        value={localIp}
                        onChange={(e) => setLocalIp(e.target.value)}
                        className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg font-mono text-xs focus:ring-1 focus:ring-blue-600 focus:outline-none"
                      />
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">
                      Check your computer Wi-Fi settings or run <code className="bg-slate-100 px-1 rounded font-mono">ipconfig</code> / <code className="bg-slate-100 px-1 rounded font-mono">ifconfig</code>.
                    </p>
                  </div>
                ) : (
                  <p className="text-slate-600">
                    Scan with your mobile camera to launch ExpenseForge directly in your phone browser.
                  </p>
                )}

                {/* Target URL with Copy Button */}
                <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-mono text-[11px] text-slate-800 flex items-center justify-between gap-2">
                  <span className="truncate select-all text-blue-700">{targetUrl}</span>
                  <button
                    onClick={() => handleCopy(targetUrl)}
                    className="p-1 hover:text-blue-600 text-slate-500 shrink-0"
                    title="Copy URL"
                  >
                    {copiedUrl ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-[11px] text-emerald-800 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Configured with <strong>--host 0.0.0.0</strong> for seamless LAN access!</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t flex justify-end">
              <button
                onClick={() => setShowLocalHostModal(false)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
