import React, { useState } from 'react';
import { StreamProvider, useStream } from './context/StreamContext';
import { Navbar } from './components/common/Navbar';
import { IngestDetailsCard } from './components/ingest/IngestDetailsCard';
import { TelemetryCard } from './components/telemetry/TelemetryCard';
import { SceneSwitcherCard } from './components/studio/SceneSwitcherCard';
import { RestreamCard } from './components/restream/RestreamCard';
import { NoalbsSettingsCard } from './components/noalbs/NoalbsSettingsCard';
import { ChatReaderCard } from './components/audio/ChatReaderCard';
import { ServerManagementCard } from './components/server/ServerManagementCard';

const DashboardContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { notification, isPanicActive } = useStream();

  return (
    <div className="min-h-screen bg-canvasBg tech-grid flex flex-col font-mono text-irloBg selection:bg-irloAccent selection:text-irloBg">
      {/* Toast Notification Banner */}
      {notification && (
        <div className="fixed bottom-4 right-4 z-50 bg-irloBg text-irloText border-2 border-irloAccent px-4 py-2.5 shadow-sharp text-xs font-mono flex items-center gap-2 animate-bounce">
          <span className="w-2 h-2 bg-irloAccent animate-ping" />
          <span>{notification}</span>
        </div>
      )}

      {/* Emergency Panic Cutout Banner */}
      {isPanicActive && (
        <div className="bg-red-600 text-white font-mono font-extrabold text-xs py-1.5 px-4 text-center tracking-widest uppercase border-b-2 border-red-800 animate-pulse">
          ⚠️ EMERGENCY PANIC MUTE ACTIVE: Camera feed dropped & audio muted. Tap "DISENGAGE PANIC MUTE" in header to restore.
        </div>
      )}

      {/* Top Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Dashboard Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 space-y-6">
        {/* Terminal Header Prompt Indicator */}
        <div className="text-xs text-irloDim flex items-center justify-between border-b border-irloRule2/20 pb-2">
          <div className="flex items-center gap-1.5">
            <span className="text-irloAccent font-bold">$</span>
            <span className="text-irloAccentDim">user@irlos-cloud:</span>
            <span className="text-irloBg font-bold">~ irlos telemetry --live --streamid=sub_8849</span>
          </div>
          <span className="text-[10px] hidden sm:inline uppercase">SYSTEMD: ACTIVE (RUNNING)</span>
        </div>

        {/* Tab 1: Overview (Everything needed for a fast mobile stream session) */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <TelemetryCard />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <IngestDetailsCard />
              <ChatReaderCard />
            </div>
            <SceneSwitcherCard />
          </div>
        )}

        {/* Tab 2: Studio & Scene Controls */}
        {activeTab === 'studio' && (
          <div className="space-y-6">
            <SceneSwitcherCard />
            <ChatReaderCard />
          </div>
        )}

        {/* Tab 3: Restream Destinations */}
        {activeTab === 'destinations' && (
          <div className="space-y-6">
            <RestreamCard />
            <TelemetryCard />
          </div>
        )}

        {/* Tab 4: NOALBS Bitrate Recovery */}
        {activeTab === 'noalbs' && (
          <div className="space-y-6">
            <NoalbsSettingsCard />
            <TelemetryCard />
          </div>
        )}

        {/* Tab 5: Server & Billing */}
        {activeTab === 'server' && (
          <div className="space-y-6">
            <ServerManagementCard />
            <IngestDetailsCard />
          </div>
        )}
      </main>

      {/* Footer from irlos.live lineage */}
      <footer className="border-t border-irloRule2 bg-cardSurface py-6 mt-12 text-xs font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-4 text-irloDim">
          <div>
            <span className="font-bold text-irloBg">IRLOS CLOUD // MANAGED STREAM SERVICE</span>
            <span className="mx-2">•</span>
            <span>GPL-3.0 Full Source</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://irlos.live" target="_blank" rel="noopener noreferrer" className="hover:text-irloAccent transition-colors">
              irlos.live ↗
            </a>
            <a href="https://github.com/EthanManners/Irlos" target="_blank" rel="noopener noreferrer" className="hover:text-irloAccent transition-colors">
              GitHub ↗
            </a>
            <a href="https://billing.stripe.com/p/login/test_portal" target="_blank" rel="noopener noreferrer" className="hover:text-irloAccent transition-colors">
              Stripe Portal ↗
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <StreamProvider>
      <DashboardContent />
    </StreamProvider>
  );
};

export default App;
