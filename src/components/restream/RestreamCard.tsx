import React, { useState } from 'react';
import { useStream } from '../../context/StreamContext';
import { InvertedCard } from '../common/InvertedCard';
import { EyeIcon, EyeOffIcon, GlobeIcon, CheckIcon } from '../common/Icons';

export const RestreamCard: React.FC = () => {
  const { restreamDestinations, toggleRestream, updateRestreamKey } = useStream();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempKey, setTempKey] = useState('');
  const [showKeys, setShowKeys] = useState<{ [key: string]: boolean }>({});

  const toggleShowKey = (id: string) => {
    setShowKeys((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleStartEdit = (id: string, currentKey: string) => {
    setEditingId(id);
    setTempKey(currentKey);
  };

  const handleSaveEdit = (id: string) => {
    updateRestreamKey(id, tempKey);
    setEditingId(null);
  };

  return (
    <InvertedCard
      title="Restream Destinations"
      subtitle="Direct cloud broadcast targets for Kick, Twitch, YouTube, and Custom RTMP"
      badge={
        <span className="bg-irloAccent text-irloBg font-mono text-[10px] font-bold px-1.5 py-0.5 uppercase tracking-wide">
          NVENC RTMP RELAY
        </span>
      }
    >
      <div className="space-y-3 font-mono">
        {restreamDestinations.map((dest) => {
          const isEditing = editingId === dest.id;
          const isRevealed = !!showKeys[dest.id];

          return (
            <div
              key={dest.id}
              className={`border p-3 sm:p-4 transition-all ${
                dest.enabled
                  ? 'border-irloRule2 bg-cardAlt/40 shadow-sm'
                  : 'border-irloRule2/30 bg-cardSurface opacity-85'
              }`}
            >
              {/* Destination Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <GlobeIcon size={16} className={dest.enabled ? 'text-irloAccent' : 'text-irloDim'} />
                  <span className="font-extrabold text-sm uppercase text-irloBg">
                    {dest.name}
                  </span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 font-bold uppercase border ${
                      dest.enabled
                        ? 'bg-green-100 text-green-800 border-green-300'
                        : 'bg-gray-100 text-gray-500 border-gray-300'
                    }`}
                  >
                    {dest.enabled ? 'LIVE RELAY ON' : 'DISABLED'}
                  </span>
                </div>

                {/* Enable/Disable Toggle */}
                <button
                  type="button"
                  onClick={() => toggleRestream(dest.id)}
                  className={`px-3 py-1 text-xs font-bold uppercase tracking-wider border transition-colors btn-tactile ${
                    dest.enabled
                      ? 'bg-irloBg text-irloAccent border-irloBg hover:bg-red-700 hover:text-white hover:border-red-700'
                      : 'bg-cardSurface text-irloBg border-irloRule2 hover:bg-irloBg hover:text-irloText'
                  }`}
                >
                  {dest.enabled ? 'DISABLE' : 'ACTIVATE'}
                </button>
              </div>

              {/* RTMP Server URL */}
              <div className="text-xs mb-2">
                <span className="text-[10px] text-irloDim uppercase block mb-0.5">RTMP Ingest Target:</span>
                <div className="text-xs text-irloBg font-bold bg-cardSurface border border-irloRule2/40 px-2.5 py-1 select-all truncate">
                  {dest.rtmpUrl}
                </div>
              </div>

              {/* Stream Key Field */}
              <div className="text-xs">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[10px] text-irloDim uppercase block">Stream Key:</span>
                  <div className="flex items-center gap-2 text-[11px]">
                    <button
                      type="button"
                      onClick={() => toggleShowKey(dest.id)}
                      className="text-irloMuted hover:text-irloBg uppercase flex items-center gap-1 font-mono"
                    >
                      {isRevealed ? <EyeOffIcon size={12} /> : <EyeIcon size={12} />}
                      <span>{isRevealed ? 'HIDE' : 'REVEAL'}</span>
                    </button>
                  </div>
                </div>

                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={tempKey}
                      onChange={(e) => setTempKey(e.target.value)}
                      placeholder="Paste new stream key..."
                      className="w-full bg-white border-2 border-irloAccent px-2.5 py-1 text-xs font-bold text-irloBg focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleSaveEdit(dest.id)}
                      className="px-3 py-1 bg-green-600 text-white font-bold text-xs uppercase border border-green-700 hover:bg-green-700 flex items-center gap-1 btn-tactile"
                    >
                      <CheckIcon size={12} />
                      <span>SAVE</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="px-2 py-1 bg-cardAlt text-irloBg font-bold text-xs uppercase border border-irloRule2 hover:bg-cardSurface"
                    >
                      CANCEL
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-cardSurface border border-irloRule2/40 px-2.5 py-1 text-xs text-irloBg truncate">
                      {dest.streamKey ? (
                        isRevealed ? (
                          dest.streamKey
                        ) : (
                          '••••••••••••••••••••••••••••••'
                        )
                      ) : (
                        <span className="text-irloDim italic">No key configured</span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleStartEdit(dest.id, dest.streamKey)}
                      className="px-2.5 py-1 text-xs font-bold uppercase border border-irloRule2 bg-cardAlt hover:bg-irloBg hover:text-irloText transition-colors btn-tactile whitespace-nowrap"
                    >
                      EDIT KEY
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 p-3 bg-cardAlt/50 border border-irloRule2/30 text-xs text-irloMuted font-sans">
        <span className="font-mono font-bold text-irloBg uppercase text-[11px] block mb-1">
          🔐 Security Note:
        </span>
        All platform stream keys are written directly to <code className="font-mono text-irloBg bg-white px-1 py-0.5 border border-irloRule2/30">/etc/irlos/config.json</code> on your cloud VM. Stream keys are never rendered in the IrlosStudio OBS canvas to eliminate accidental on-screen leaks.
      </div>
    </InvertedCard>
  );
};
