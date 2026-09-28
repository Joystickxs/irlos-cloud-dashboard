import React, { useState } from 'react';
import { useStream } from '../../context/StreamContext';
import { InvertedCard } from '../common/InvertedCard';
import { Volume2Icon, VolumeXIcon, PlayIcon, SquareIcon, CopyIcon, TerminalIcon } from '../common/Icons';

export const ChatReaderCard: React.FC = () => {
  const { audioState, toggleAudio, setAudioVolume, chatCommands, showToast } = useStream();
  const [isPlaying, setIsPlaying] = useState(true);

  const handleCopyCmd = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    showToast(`Copied ${cmd} to clipboard`);
  };

  return (
    <InvertedCard
      title="Integrated Chat Reader & Audio Stream"
      subtitle="In-dashboard audio pipeline streaming your Kick TTS chat reader directly to your earbud"
      badge={
        <span className="bg-irloAccent text-irloBg font-mono text-[10px] font-bold px-1.5 py-0.5 uppercase tracking-wide">
          PIPEWIRE LOW LATENCY
        </span>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 font-mono">
        {/* Left: Audio Player Module (6 cols) */}
        <div className="lg:col-span-6 bg-cardAlt border border-irloRule2 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs mb-3 border-b border-irloRule2/20 pb-2">
              <span className="font-extrabold uppercase text-irloBg flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${audioState.isMuted ? 'bg-irloDim' : 'bg-irloLive animate-pulse'}`} />
                KICK CHAT TTS FEED
              </span>
              <span className="text-[11px] text-green-700 font-bold">160ms BUFFER</span>
            </div>

            {/* Audio VU Spectrum bars simulation */}
            <div className="h-10 bg-irloBg border border-irloRule p-2 flex items-end justify-between gap-1 mb-4">
              {[40, 65, 80, 50, 90, 75, 45, 60, 85, 30, 70, 95, 60, 40, 80, 55].map((h, i) => (
                <div
                  key={i}
                  className={`w-full transition-all duration-200 ${
                    audioState.isMuted || !isPlaying
                      ? 'h-1 bg-irloDim/40'
                      : 'bg-irloAccent shadow-cyan-glow-sm'
                  }`}
                  style={{
                    height: audioState.isMuted || !isPlaying ? '3px' : `${Math.max(10, (h * audioState.volume) / 100)}%`,
                  }}
                />
              ))}
            </div>

            {/* Controls Bar */}
            <div className="flex items-center justify-between gap-3 mb-4">
              {/* Play/Stop Button */}
              <button
                type="button"
                onClick={() => {
                  setIsPlaying(!isPlaying);
                  showToast(isPlaying ? 'Audio Stream Paused' : 'Audio Stream Connected');
                }}
                className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider border flex items-center gap-1.5 btn-tactile ${
                  isPlaying
                    ? 'bg-irloBg text-irloAccent border-irloBg hover:bg-cardSurface hover:text-irloBg'
                    : 'bg-green-600 text-white border-green-700'
                }`}
              >
                {isPlaying ? <SquareIcon size={12} /> : <PlayIcon size={12} />}
                <span>{isPlaying ? 'PAUSE STREAM' : 'RESUME STREAM'}</span>
              </button>

              {/* Mute Button */}
              <button
                type="button"
                onClick={toggleAudio}
                className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider border border-irloRule2 bg-cardSurface text-irloBg hover:bg-cardAlt flex items-center gap-1.5 btn-tactile"
              >
                {audioState.isMuted ? <VolumeXIcon size={14} className="text-red-600" /> : <Volume2Icon size={14} />}
                <span>{audioState.isMuted ? 'UNMUTE' : 'MUTE'}</span>
              </button>
            </div>

            {/* Volume Slider */}
            <div>
              <div className="flex items-center justify-between text-xs text-irloDim mb-1">
                <span className="uppercase text-[10px]">Earbud Output Volume:</span>
                <span className="font-bold text-irloBg">{audioState.isMuted ? 'MUTED' : `${audioState.volume}%`}</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={audioState.isMuted ? 0 : audioState.volume}
                onChange={(e) => setAudioVolume(Number(e.target.value))}
                className="w-full accent-irloAccent h-2 bg-gray-200 cursor-pointer"
              />
            </div>
          </div>

          <div className="mt-4 pt-2 border-t border-irloRule2/20 text-[11px] text-irloMuted font-sans">
            Connect Bluetooth earbuds to this phone. Audio plays continuously even if your screen locks in background.
          </div>
        </div>

        {/* Right: Moderator Commands & Cheatsheet (6 cols) */}
        <div className="lg:col-span-6 border border-irloRule2 bg-cardSurface p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-irloRule2/20 pb-2 mb-3">
              <span className="font-extrabold uppercase text-xs text-irloBg flex items-center gap-1.5">
                <TerminalIcon size={14} className="text-irloAccent" />
                CHAT COMMANDS & MOD CONTROLS
              </span>
              <span className="text-[10px] text-irloDim font-bold">KICK / TWITCH</span>
            </div>

            <div className="space-y-2">
              {chatCommands.map((cmd) => (
                <div
                  key={cmd.command}
                  className="flex items-center justify-between p-2 border border-irloRule2/30 bg-cardAlt/50 text-xs hover:border-irloAccent transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-irloAccent bg-irloBg px-1.5 py-0.5">
                      {cmd.command}
                    </span>
                    <span className="text-irloMuted font-sans text-[11px]">{cmd.action}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[9px] uppercase px-1 py-0.5 border border-irloRule2/30 text-irloDim">
                      {cmd.role}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyCmd(cmd.command)}
                      className="p-1 hover:text-irloAccent text-irloDim"
                      title="Copy command"
                    >
                      <CopyIcon size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 p-2 bg-cardAlt border border-irloRule2/30 text-[11px] text-irloMuted font-sans">
            Streamers and assigned channel moderators can type these commands in Kick chat to trigger scene changes hands-free.
          </div>
        </div>
      </div>
    </InvertedCard>
  );
};
