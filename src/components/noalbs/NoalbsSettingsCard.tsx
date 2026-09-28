import React from 'react';
import { useStream } from '../../context/StreamContext';
import { InvertedCard } from '../common/InvertedCard';
import { SlidersIcon, ZapIcon } from '../common/Icons';

export const NoalbsSettingsCard: React.FC = () => {
  const { noalbs, updateNoalbs, telemetry, scenes } = useStream();

  return (
    <InvertedCard
      title="NOALBS Bitrate Recovery Settings"
      subtitle="Automated OBS scene switching to protect your broadcast when cellular signal fluctuates"
      badge={
        <span
          className={`font-mono text-[10px] font-bold px-1.5 py-0.5 uppercase tracking-wide border ${
            noalbs.autoSwitchEnabled
              ? 'bg-green-100 text-green-800 border-green-300'
              : 'bg-red-100 text-red-800 border-red-300'
          }`}
        >
          {noalbs.autoSwitchEnabled ? 'DAEMON ACTIVE' : 'MANUAL OVERRIDE'}
        </span>
      }
      headerAction={
        <button
          type="button"
          onClick={() => updateNoalbs({ autoSwitchEnabled: !noalbs.autoSwitchEnabled })}
          className={`px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider border transition-colors btn-tactile ${
            noalbs.autoSwitchEnabled
              ? 'bg-irloBg text-irloAccent border-irloBg hover:bg-red-700 hover:text-white hover:border-red-700'
              : 'bg-green-600 text-white border-green-700 hover:bg-green-700'
          }`}
        >
          {noalbs.autoSwitchEnabled ? 'DISABLE AUTO-SWITCH' : 'ENABLE AUTO-SWITCH'}
        </button>
      }
    >
      {/* Live Threshold Gauge */}
      <div className="mb-6 p-4 bg-irloBg text-irloText border border-irloRule2 font-mono">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-irloDim uppercase flex items-center gap-1.5 font-bold">
            <ZapIcon size={14} className="text-irloAccent" />
            LIVE SIGNAL GAUGE vs THRESHOLDS
          </span>
          <span className="text-irloAccent font-bold text-irloLive">
            CURRENT: {telemetry.bitrate} KBPS
          </span>
        </div>

        {/* Multi-tier gauge bar */}
        <div className="relative w-full h-4 bg-irloSurface border border-irloRule2 overflow-hidden mb-2">
          {/* Offline Zone (0 to offlineThreshold) */}
          <div
            className="absolute top-0 bottom-0 left-0 bg-red-900/70 border-r border-red-500"
            style={{ width: `${(noalbs.offlineThreshold / 6000) * 100}%` }}
          />
          {/* Low Bitrate Zone (offlineThreshold to lowThreshold) */}
          <div
            className="absolute top-0 bottom-0 bg-amber-900/60 border-r border-amber-500"
            style={{
              left: `${(noalbs.offlineThreshold / 6000) * 100}%`,
              width: `${((noalbs.lowBitrateThreshold - noalbs.offlineThreshold) / 6000) * 100}%`,
            }}
          />
          {/* Live Indicator Needle */}
          <div
            className="absolute top-0 bottom-0 w-1.5 bg-irloAccent shadow-cyan-glow transition-all duration-300"
            style={{
              left: `${Math.min(100, Math.max(0, (telemetry.bitrate / 6000) * 100))}%`,
            }}
          />
        </div>

        <div className="flex items-center justify-between text-[10px] text-irloDim">
          <span className="text-red-400">0 kbps (OFFLINE)</span>
          <span className="text-amber-400">CUTOFF: {noalbs.lowBitrateThreshold} kbps (BRB)</span>
          <span className="text-green-400">6,000 kbps (EXCELLENT)</span>
        </div>
      </div>

      {/* Sliders Configuration Grid */}
      <div className="space-y-5 font-mono text-xs">
        {/* Low Bitrate Threshold Slider */}
        <div className="border border-irloRule2/30 bg-cardAlt/40 p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="font-extrabold text-irloBg uppercase block text-sm">
                Low-Bitrate Cutoff Threshold
              </span>
              <span className="text-irloDim text-[11px] font-sans">
                Switches to BRB standby when cellular upload dips below this point.
              </span>
            </div>
            <div className="text-right">
              <span className="text-lg font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 border border-amber-200">
                {noalbs.lowBitrateThreshold} kbps
              </span>
            </div>
          </div>
          <input
            type="range"
            min={800}
            max={4000}
            step={100}
            value={noalbs.lowBitrateThreshold}
            onChange={(e) => updateNoalbs({ lowBitrateThreshold: Number(e.target.value) })}
            className="w-full accent-irloAccent h-2 bg-gray-200 rounded-none cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-irloDim mt-1">
            <span>800 kbps (Aggressive keep-alive)</span>
            <span>Default: 2000 kbps</span>
            <span>4000 kbps (Conservative high quality)</span>
          </div>
        </div>

        {/* Offline Threshold Slider */}
        <div className="border border-irloRule2/30 bg-cardAlt/40 p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="font-extrabold text-irloBg uppercase block text-sm">
                Stream Offline Cutoff Threshold
              </span>
              <span className="text-irloDim text-[11px] font-sans">
                Switches to Offline scene when upload completely flatlines.
              </span>
            </div>
            <div className="text-right">
              <span className="text-lg font-extrabold text-red-700 bg-red-50 px-2 py-0.5 border border-red-200">
                {noalbs.offlineThreshold} kbps
              </span>
            </div>
          </div>
          <input
            type="range"
            min={100}
            max={1200}
            step={50}
            value={noalbs.offlineThreshold}
            onChange={(e) => updateNoalbs({ offlineThreshold: Number(e.target.value) })}
            className="w-full accent-irloAccent h-2 bg-gray-200 rounded-none cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-irloDim mt-1">
            <span>100 kbps (Dead zone)</span>
            <span>Default: 500 kbps</span>
            <span>1200 kbps</span>
          </div>
        </div>

        {/* Recovery Delay / Hysteresis Slider */}
        <div className="border border-irloRule2/30 bg-cardAlt/40 p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="font-extrabold text-irloBg uppercase block text-sm">
                Recovery Delay (Hysteresis Buffer)
              </span>
              <span className="text-irloDim text-[11px] font-sans">
                Seconds of stable signal required before auto-switching back to Live (prevents rapid scene flashing).
              </span>
            </div>
            <div className="text-right">
              <span className="text-lg font-extrabold text-irloBg bg-white px-2 py-0.5 border border-irloRule2">
                {noalbs.recoveryDelaySeconds} seconds
              </span>
            </div>
          </div>
          <input
            type="range"
            min={1}
            max={12}
            step={1}
            value={noalbs.recoveryDelaySeconds}
            onChange={(e) => updateNoalbs({ recoveryDelaySeconds: Number(e.target.value) })}
            className="w-full accent-irloAccent h-2 bg-gray-200 rounded-none cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-irloDim mt-1">
            <span>1s (Instant return)</span>
            <span>Default: 4s</span>
            <span>12s (Stable metro/train recovery)</span>
          </div>
        </div>

        {/* Scene Mapping Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div>
            <label className="text-[10px] text-irloDim uppercase block font-bold mb-1">
              Normal Scene:
            </label>
            <select
              value={noalbs.normalScene}
              onChange={(e) => updateNoalbs({ normalScene: e.target.value })}
              className="w-full bg-white border border-irloRule2 px-2.5 py-1.5 font-bold text-xs text-irloBg"
            >
              {scenes.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] text-irloDim uppercase block font-bold mb-1">
              Low-Bitrate Scene:
            </label>
            <select
              value={noalbs.lowBitrateScene}
              onChange={(e) => updateNoalbs({ lowBitrateScene: e.target.value })}
              className="w-full bg-white border border-irloRule2 px-2.5 py-1.5 font-bold text-xs text-irloBg"
            >
              {scenes.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] text-irloDim uppercase block font-bold mb-1">
              Offline Scene:
            </label>
            <select
              value={noalbs.offlineScene}
              onChange={(e) => updateNoalbs({ offlineScene: e.target.value })}
              className="w-full bg-white border border-irloRule2 px-2.5 py-1.5 font-bold text-xs text-irloBg"
            >
              {scenes.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </InvertedCard>
  );
};
