import React from 'react';
import { useStream } from '../../context/StreamContext';
import { RadioIcon } from '../common/Icons';

export const CanvasPreview: React.FC = () => {
  const { currentSceneId, isLive, telemetry, isPanicActive } = useStream();

  return (
    <div className="relative aspect-video w-full bg-irloBg border border-irloRule2 overflow-hidden flex flex-col justify-between p-3 select-none">
      {/* Scanline overlay effect from irlos.live */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'repeating-linear-gradient(to bottom, transparent 0, transparent 2px, rgba(0, 212, 255, 0.15) 3px)',
        }}
      />

      {/* Top Overlay HUD */}
      <div className="relative z-10 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2 bg-irloBg/90 px-2.5 py-1 border border-irloRule">
          <span className={`w-2 h-2 rounded-full ${isPanicActive ? 'bg-red-500' : isLive ? 'bg-irloLive animate-ping' : 'bg-irloDim'}`} />
          <span className="font-extrabold uppercase text-irloText text-[11px]">
            {isPanicActive ? 'PANIC PRIVACY CUT' : isLive ? 'PROGRAM OUTPUT' : 'STANDBY'}
          </span>
        </div>
        <div className="bg-irloBg/90 px-2 py-1 border border-irloRule text-irloAccent text-[11px] font-bold">
          {telemetry.resolution} • {telemetry.bitrate} kbps
        </div>
      </div>

      {/* Center Scene Mock Artwork */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center my-auto">
        {isPanicActive ? (
          <div className="bg-red-950/80 border-2 border-red-500 p-4 max-w-xs text-red-200">
            <span className="font-extrabold text-sm block mb-1 text-red-400">EMERGENCY PRIVACY MODE</span>
            <span className="text-[11px] font-sans block">Camera feed unrouted • Microphone muted</span>
          </div>
        ) : currentSceneId === 'scene-live' ? (
          <div className="flex flex-col items-center text-irloText">
            <RadioIcon size={36} className="text-irloAccent mb-2 animate-pulse" />
            <span className="text-base font-extrabold tracking-wide uppercase">CAMERA FEED ACTIVE</span>
            <span className="text-xs text-irloMuted font-sans">Belabox / SRT Ingest passing to NVENC</span>
          </div>
        ) : currentSceneId === 'scene-brb' ? (
          <div className="border border-amber-500/50 bg-amber-950/40 p-4 text-amber-300">
            <span className="text-lg font-extrabold uppercase block mb-1">BRB / SIGNAL RECONNECTING</span>
            <span className="text-xs font-sans text-amber-200/80 block">Automatic NOALBS standby card active</span>
          </div>
        ) : currentSceneId === 'scene-map' ? (
          <div className="border border-irloAccent/50 bg-irloSurface p-4 text-irloText">
            <span className="text-base font-extrabold uppercase text-irloAccent block mb-1">LIVE GPS ROUTE OVERLAY</span>
            <span className="text-xs font-sans text-irloMuted block">Traccar / Map geotracker on program canvas</span>
          </div>
        ) : (
          <div className="border border-irloRule bg-irloSurface p-4 text-irloMuted">
            <span className="text-base font-extrabold uppercase block mb-1 text-irloText">STREAM OFFLINE</span>
            <span className="text-xs font-sans block">Cloud OBS idle • Waiting on STREAM command</span>
          </div>
        )}
      </div>

      {/* Bottom HUD Bar */}
      <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-irloMuted bg-irloBg/90 px-2 py-1 border border-irloRule">
        <span>FPS: {isLive ? '60.0' : '0.0'}</span>
        <span className="text-irloAccent font-bold">1 FPS WEB PREVIEW (LOW BANDWIDTH)</span>
        <span>SLS RTT: {telemetry.rtt}ms</span>
      </div>
    </div>
  );
};
