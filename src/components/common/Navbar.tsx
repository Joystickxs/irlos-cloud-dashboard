import React from 'react';
import { useStream } from '../../context/StreamContext';
import { StatusLed } from './StatusLed';
import { ExternalLinkIcon, ShieldAlertIcon, ZapIcon } from './Icons';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { isLive, telemetry, isPanicActive, triggerPanic, simulateBitrateDrop, serverInfo } = useStream();

  const tabs = [
    { id: 'overview', label: '01 / OVERVIEW' },
    { id: 'studio', label: '02 / STUDIO & SCENES' },
    { id: 'destinations', label: '03 / RESTREAM' },
    { id: 'noalbs', label: '04 / NOALBS RECOVERY' },
    { id: 'server', label: '05 / SERVER & BILLING' },
  ];

  return (
    <header className="border-b border-irloRule2 bg-cardSurface sticky top-0 z-30 shadow-sm">
      {/* Top Utility Ribbon */}
      <div className="border-b border-irloRule2/15 bg-irloBg text-irloText px-3 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
          {/* Brand Logo */}
          <div className="flex items-center gap-2">
            <span className="font-extrabold tracking-tighter text-sm uppercase text-irloText">
              irlos<span className="text-irloAccent">.cloud</span>
            </span>
            <span className="bg-irloAccent text-irloBg font-bold px-1.5 py-0.5 text-[10px] uppercase tracking-wider">
              SUBSCRIBER
            </span>
          </div>

          <div className="hidden md:flex items-center gap-2 text-irloMuted border-l border-irloRule2 pl-4">
            <span>INSTANCE:</span>
            <span className="text-irloText font-bold">{serverInfo.id}</span>
            <span className="text-irloDim">({serverInfo.region})</span>
          </div>
        </div>

        {/* Status Indicators & Live Actions */}
        <div className="flex items-center gap-3">
          {/* Ingest Status */}
          <div className="flex items-center gap-2 bg-irloSurface px-2.5 py-1 border border-irloRule">
            <StatusLed
              status={isPanicActive ? 'danger' : isLive ? 'live' : 'idle'}
              label={isPanicActive ? 'PANIC ACTIVE' : isLive ? 'INGEST LIVE' : 'OFFLINE'}
            />
            {isLive && !isPanicActive && (
              <span className="text-irloAccent font-bold hidden sm:inline">
                {telemetry.rtt}ms RTT
              </span>
            )}
          </div>

          {/* Quick Signal Drop Test Simulator */}
          <button
            onClick={simulateBitrateDrop}
            type="button"
            className="hidden lg:inline-flex items-center gap-1.5 px-2 py-1 text-[11px] font-bold uppercase border border-irloRule text-irloMuted hover:text-irloAccent hover:border-irloAccent transition-colors btn-tactile"
            title="Simulate sudden cellular signal drop to test NOALBS automatic scene switching"
          >
            <ZapIcon size={12} className="text-irloAccent" />
            <span>TEST CELL DROP</span>
          </button>

          {/* Emergency Panic Cut Button */}
          <button
            onClick={triggerPanic}
            type="button"
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider border transition-colors btn-tactile ${
              isPanicActive
                ? 'bg-red-600 text-white border-red-700 animate-pulse'
                : 'bg-irloBg text-red-400 border-red-800 hover:bg-red-600 hover:text-white'
            }`}
            title="Emergency privacy cut: immediately switch to offline & mute audio"
          >
            <ShieldAlertIcon size={13} />
            <span>{isPanicActive ? 'CLEAR PANIC' : 'PANIC MUTE'}</span>
          </button>

          {/* Stripe Billing Quick Link */}
          <a
            href="https://billing.stripe.com/p/login/test_portal"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] font-bold text-irloAccent hover:underline uppercase"
          >
            <span>STRIPE</span>
            <ExternalLinkIcon size={11} />
          </a>
        </div>
      </div>

      {/* Main Tab Navigation Bar */}
      <nav className="px-3 sm:px-6 flex items-center gap-1 overflow-x-auto no-scrollbar py-1.5 bg-cardSurface">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider whitespace-nowrap border transition-all btn-tactile ${
                isActive
                  ? 'bg-irloBg text-irloAccent border-irloBg shadow-sharp-sm'
                  : 'bg-cardSurface text-irloBg/80 border-transparent hover:border-irloRule2 hover:text-irloBg'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
};
