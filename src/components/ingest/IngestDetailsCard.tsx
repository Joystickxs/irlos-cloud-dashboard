import React, { useState } from 'react';
import { useStream } from '../../context/StreamContext';
import { InvertedCard } from '../common/InvertedCard';
import { CopyButton } from '../common/CopyButton';
import { QrCodeModal } from './QrCodeModal';
import { QrCodeIcon, EyeIcon, EyeOffIcon, ChevronDownIcon, ChevronUpIcon } from '../common/Icons';

export const IngestDetailsCard: React.FC = () => {
  const { ingestConfig } = useStream();
  const [showKey, setShowKey] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [expandedGuide, setExpandedGuide] = useState<string | null>(null);

  const toggleGuide = (id: string) => {
    setExpandedGuide((prev) => (prev === id ? null : id));
  };

  const guides = [
    {
      id: 'larix',
      title: 'Larix Broadcaster (iOS & Android)',
      steps: [
        'Open Larix Broadcaster > tap Settings (Gear) > Connections > New Connection.',
        'Name: IRLOS Cloud Ingest.',
        'URL: Paste your dedicated SRT URL (srt://ingest.irlos.live:9000).',
        'Stream ID: Paste your dedicated Stream ID token from above.',
        'Latency: Set to 120ms (or 200ms in poor cell areas) and Mode to "Caller".',
      ],
    },
    {
      id: 'irlpro',
      title: 'IRL Pro (Android)',
      steps: [
        'Open IRL Pro > Settings > Stream Output.',
        'Select Protocol: SRT (Caller Mode).',
        'Server Host: ingest.irlos.live, Port: 9000.',
        'Stream ID: Paste your dedicated token.',
        'Enable Hardware H.264 / HEVC encoding and tap Save.',
      ],
    },
    {
      id: 'backpack',
      title: 'IRLOS Hardware Backpack (Orange Pi 5+)',
      steps: [
        'Power on the backpack battery and connect camera via HDMI.',
        'The bag automatically registers on cellular carrier modems (modem0).',
        'Your dedicated SRT token is pre-flashed in /etc/irlos/config.json.',
        'Press the physical STREAM button on the strap to start broadcasting instantly.',
      ],
    },
    {
      id: 'obs',
      title: 'OBS Studio (External PC / Encoder)',
      steps: [
        'Settings > Stream > Service: Custom...',
        'Server: srt://ingest.irlos.live:9000?streamid=YOUR_STREAM_ID',
        'Leave Stream Key empty (SRT passes authentication via Stream ID parameter).',
      ],
    },
  ];

  return (
    <>
      <InvertedCard
        title="Go Live Ingest Details"
        subtitle="Dedicated low-latency SRT (SLS) server parameters for your mobile encoders"
        badge={
          <span className="bg-irloAccent text-irloBg font-mono text-[10px] font-bold px-1.5 py-0.5 uppercase tracking-wide">
            PORT 9000 // SLS
          </span>
        }
        headerAction={
          <button
            onClick={() => setIsQrOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold font-mono uppercase bg-irloAccent text-irloBg border border-irloRule2 hover:bg-irloBg hover:text-irloAccent transition-colors btn-tactile shadow-sharp-sm"
          >
            <QrCodeIcon size={14} />
            <span>SCAN QR CODE</span>
          </button>
        }
      >
        {/* Connection Fields Grid */}
        <div className="space-y-3 font-mono">
          {/* SRT Server URL */}
          <div>
            <div className="flex items-center justify-between text-xs text-irloMuted mb-1 font-sans">
              <span className="font-mono text-[11px] text-irloDim uppercase font-bold">Dedicated SRT URL</span>
              <span className="text-[11px] text-irloAccent font-bold">Caller Mode</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={ingestConfig.srtUrl}
                className="w-full bg-cardAlt border border-irloRule2 px-3 py-2 text-xs font-bold text-irloBg select-all focus:outline-none"
              />
              <CopyButton textToCopy={ingestConfig.srtUrl} label="COPY" />
            </div>
          </div>

          {/* Stream ID / Key */}
          <div>
            <div className="flex items-center justify-between text-xs text-irloMuted mb-1 font-sans">
              <span className="font-mono text-[11px] text-irloDim uppercase font-bold">Stream ID / Token</span>
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="inline-flex items-center gap-1 text-[11px] text-irloMuted hover:text-irloBg uppercase font-mono"
              >
                {showKey ? <EyeOffIcon size={12} /> : <EyeIcon size={12} />}
                <span>{showKey ? 'HIDE' : 'REVEAL'}</span>
              </button>
            </div>
            <div className="flex items-center gap-2">
              <input
                type={showKey ? 'text' : 'password'}
                readOnly
                value={ingestConfig.streamId}
                className="w-full bg-cardAlt border border-irloRule2 px-3 py-2 text-xs font-bold text-irloBg select-all focus:outline-none"
              />
              <CopyButton textToCopy={ingestConfig.streamId} label="COPY" />
            </div>
          </div>

          {/* Sub-parameters banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
            <div className="border border-irloRule2/30 bg-cardAlt/50 p-2">
              <span className="text-[10px] text-irloDim block uppercase">Protocol</span>
              <span className="font-bold text-irloBg">SRT (SLS)</span>
            </div>
            <div className="border border-irloRule2/30 bg-cardAlt/50 p-2">
              <span className="text-[10px] text-irloDim block uppercase">Ingest Port</span>
              <span className="font-bold text-irloBg">{ingestConfig.srtPort}</span>
            </div>
            <div className="border border-irloRule2/30 bg-cardAlt/50 p-2">
              <span className="text-[10px] text-irloDim block uppercase">Target Latency</span>
              <span className="font-bold text-irloBg">{ingestConfig.latencyMs} ms</span>
            </div>
            <div className="border border-irloRule2/30 bg-cardAlt/50 p-2">
              <span className="text-[10px] text-irloDim block uppercase">Encryption</span>
              <span className="font-bold text-irloLive">AES-128</span>
            </div>
          </div>
        </div>

        {/* Quick Connection Accordions */}
        <div className="mt-5 border-t border-irloRule2/20 pt-4">
          <div className="text-xs font-bold uppercase tracking-wider text-irloBg font-mono mb-2 flex items-center justify-between">
            <span>Quick App Connection Guides:</span>
            <span className="text-[10px] text-irloMuted font-normal font-sans">Tap to expand instructions</span>
          </div>

          <div className="space-y-1.5 font-mono text-xs">
            {guides.map((g) => {
              const isOpen = expandedGuide === g.id;
              return (
                <div key={g.id} className="border border-irloRule2/30 bg-cardAlt/30 overflow-hidden">
                  <button
                    onClick={() => toggleGuide(g.id)}
                    className="w-full flex items-center justify-between px-3 py-2 text-left font-bold text-irloBg hover:bg-cardAlt transition-colors"
                  >
                    <span>&gt; {g.title}</span>
                    {isOpen ? <ChevronUpIcon size={14} /> : <ChevronDownIcon size={14} />}
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-3 pt-1 border-t border-irloRule2/20 bg-cardSurface font-sans text-xs text-irloBg/90 space-y-1.5">
                      <ol className="list-decimal pl-4 space-y-1">
                        {g.steps.map((st, idx) => (
                          <li key={idx} className="leading-relaxed">
                            {st}
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </InvertedCard>

      <QrCodeModal
        isOpen={isQrOpen}
        onClose={() => setIsQrOpen(false)}
        srtUrl={ingestConfig.srtUrl}
        streamId={ingestConfig.streamId}
      />
    </>
  );
};
