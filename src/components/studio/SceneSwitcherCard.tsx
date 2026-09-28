import React, { useState } from 'react';
import { useStream } from '../../context/StreamContext';
import { InvertedCard } from '../common/InvertedCard';
import { CanvasPreview } from './CanvasPreview';
import { StatusLed } from '../common/StatusLed';
import { PlayIcon, SquareIcon, ShieldAlertIcon, TvIcon } from '../common/Icons';

export const SceneSwitcherCard: React.FC = () => {
  const {
    scenes,
    currentSceneId,
    switchScene,
    isLive,
    toggleStreamLive,
    isPanicActive,
    triggerPanic,
  } = useStream();

  const [confirmStop, setConfirmStop] = useState(false);

  const handleLiveToggle = () => {
    if (isLive) {
      if (!confirmStop) {
        setConfirmStop(true);
        setTimeout(() => setConfirmStop(false), 4000);
        return;
      }
      toggleStreamLive();
      setConfirmStop(false);
    } else {
      toggleStreamLive();
    }
  };

  return (
    <InvertedCard
      title="Studio & Scene Switcher"
      subtitle="Direct OBS WebSocket switcher for mobile field control"
      badge={
        <span className="bg-irloAccent text-irloBg font-mono text-[10px] font-bold px-1.5 py-0.5 uppercase tracking-wide">
          OBS WS :4455
        </span>
      }
      headerAction={
        <div className="flex items-center gap-2">
          {/* Stream Broadcast Start/Stop Button */}
          <button
            onClick={handleLiveToggle}
            type="button"
            className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider border transition-colors btn-tactile ${
              isLive
                ? confirmStop
                  ? 'bg-red-600 text-white border-red-700 animate-pulse'
                  : 'bg-cardAlt text-red-600 border-red-400 hover:bg-red-600 hover:text-white'
                : 'bg-green-600 text-white border-green-700 hover:bg-green-700'
            }`}
          >
            {isLive ? (
              <>
                <SquareIcon size={12} />
                <span>{confirmStop ? 'CONFIRM STOP?' : 'STOP STREAM'}</span>
              </>
            ) : (
              <>
                <PlayIcon size={12} />
                <span>START STREAM</span>
              </>
            )}
          </button>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Program Canvas Preview (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <CanvasPreview />
          <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-irloMuted">
            <span>SCENE ENGINE: NOALBS + OBS</span>
            <span className="text-irloAccent font-bold">1080p NVENC</span>
          </div>
        </div>

        {/* Right: Scene Trigger Cards (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div className="mb-2 flex items-center justify-between font-mono text-xs text-irloDim">
            <span className="uppercase font-bold text-irloBg">Select Active Studio Scene:</span>
            <span>HOTKEYS ENABLED</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {scenes.map((sc) => {
              const isActive = currentSceneId === sc.id && !isPanicActive;
              return (
                <button
                  key={sc.id}
                  onClick={() => switchScene(sc.id)}
                  type="button"
                  className={`text-left p-3 border transition-all btn-tactile flex flex-col justify-between relative ${
                    isActive
                      ? 'bg-irloBg text-irloText border-irloAccent shadow-sharp-cyan ring-1 ring-irloAccent'
                      : 'bg-cardAlt border-irloRule2 hover:border-irloAccent text-irloBg'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="font-mono text-xs font-extrabold uppercase tracking-wide">
                      {sc.label}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 border ${
                        isActive
                          ? 'border-irloAccent text-irloAccent bg-irloSurface'
                          : 'border-irloRule2/30 text-irloDim'
                      }`}
                    >
                      {sc.hotkey}
                    </span>
                  </div>

                  <p className={`text-[11px] font-sans m-0 leading-tight ${isActive ? 'text-irloMuted' : 'text-irloDim'}`}>
                    {sc.description}
                  </p>

                  <div className="mt-2 flex items-center gap-1.5">
                    <StatusLed
                      status={isActive ? 'live' : 'idle'}
                      label={isActive ? 'ON PROGRAM' : 'STANDBY'}
                      size="sm"
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Emergency Safety Cut Bar */}
          <div className="mt-4 pt-3 border-t border-irloRule2/20 flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs font-mono">
              <span className="text-irloDim block text-[10px] uppercase">Safety Override:</span>
              <span className="text-irloBg font-bold">1-Click Public Privacy Cut</span>
            </div>

            <button
              onClick={triggerPanic}
              type="button"
              className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-mono font-extrabold uppercase tracking-wider border transition-all btn-tactile shadow-sharp-sm ${
                isPanicActive
                  ? 'bg-red-600 text-white border-red-700 animate-pulse ring-2 ring-red-400'
                  : 'bg-irloBg text-red-400 border-red-700 hover:bg-red-600 hover:text-white'
              }`}
            >
              <ShieldAlertIcon size={16} />
              <span>{isPanicActive ? 'DISENGAGE PANIC MUTE' : 'TRIGGER PANIC MUTE'}</span>
            </button>
          </div>
        </div>
      </div>
    </InvertedCard>
  );
};
