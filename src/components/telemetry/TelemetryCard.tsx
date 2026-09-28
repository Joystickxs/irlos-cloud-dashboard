import React from 'react';
import { useStream } from '../../context/StreamContext';
import { InvertedCard } from '../common/InvertedCard';
import { StatusLed } from '../common/StatusLed';
import { SparklineChart } from './SparklineChart';

export const TelemetryCard: React.FC = () => {
  const { telemetry, isLive, isPanicActive, noalbs, restreamDestinations } = useStream();

  const formatUptime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const activeDestinations = restreamDestinations.filter((d) => d.enabled);

  let bitrateColor = 'text-irloBg';
  if (telemetry.bitrate >= 4000) {
    bitrateColor = 'text-green-700';
  } else if (telemetry.bitrate >= noalbs.lowBitrateThreshold) {
    bitrateColor = 'text-amber-700';
  } else {
    bitrateColor = 'text-red-700';
  }

  return (
    <InvertedCard
      title="Live Telemetry & Ingest Health"
      subtitle="Real-time uplink monitoring from mobile bag / phone encoder to cloud SLS ingest"
      badge={
        <StatusLed
          status={isPanicActive ? 'danger' : isLive ? 'live' : 'idle'}
          label={isPanicActive ? 'PANIC MUTE' : isLive ? 'HEALTHY' : 'OFFLINE'}
        />
      }
    >
      {/* 4 Primary Metric Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4 font-mono">
        {/* Bitrate */}
        <div className="bg-cardAlt border border-irloRule2 p-3 flex flex-col justify-between shadow-inner">
          <span className="text-[10px] text-irloDim uppercase tracking-wider block font-bold">
            INPUT BITRATE
          </span>
          <div className="my-1 flex items-baseline gap-1.5">
            <span className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${bitrateColor}`}>
              {telemetry.bitrate.toLocaleString()}
            </span>
            <span className="text-xs text-irloDim font-bold">kbps</span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-irloMuted">
            <span>TARGET: {telemetry.targetBitrate}</span>
            <span className="text-green-700 font-bold">1080p60</span>
          </div>
        </div>

        {/* Round Trip Time (RTT) */}
        <div className="bg-cardAlt border border-irloRule2 p-3 flex flex-col justify-between shadow-inner">
          <span className="text-[10px] text-irloDim uppercase tracking-wider block font-bold">
            SRT RTT (LATENCY)
          </span>
          <div className="my-1 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-irloBg">
              {telemetry.rtt}
            </span>
            <span className="text-xs text-irloDim font-bold">ms</span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-irloMuted">
            <span>JITTER: ±4ms</span>
            <span className="text-green-700 font-bold">OPTIMAL</span>
          </div>
        </div>

        {/* Dropped Frames */}
        <div className="bg-cardAlt border border-irloRule2 p-3 flex flex-col justify-between shadow-inner">
          <span className="text-[10px] text-irloDim uppercase tracking-wider block font-bold">
            DROPPED FRAMES
          </span>
          <div className="my-1 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-irloBg">
              {telemetry.droppedFrames}
            </span>
            <span className="text-xs text-irloDim font-bold">({telemetry.droppedPercent}%)</span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-irloMuted">
            <span>NVENC LOSS: 0</span>
            <span className="text-green-700 font-bold">STABLE</span>
          </div>
        </div>

        {/* Stream Uptime */}
        <div className="bg-cardAlt border border-irloRule2 p-3 flex flex-col justify-between shadow-inner">
          <span className="text-[10px] text-irloDim uppercase tracking-wider block font-bold">
            STREAM UPTIME
          </span>
          <div className="my-1 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-irloBg">
              {formatUptime(telemetry.uptimeSeconds)}
            </span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-irloMuted">
            <span>SESSION: #8849</span>
            <span className="text-irloAccent font-bold">RECORDING OFF</span>
          </div>
        </div>
      </div>

      {/* 60-Second Realtime Rolling Sparkline Graph */}
      <div className="mb-4">
        <SparklineChart data={telemetry.history} lowThreshold={noalbs.lowBitrateThreshold} />
      </div>

      {/* Ingest Uplink vs Egress Split Diagnostics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 font-mono text-xs">
        {/* Ingest Uplink Card */}
        <div className="border border-irloRule2/30 bg-cardAlt/40 p-3">
          <div className="flex items-center justify-between border-b border-irloRule2/20 pb-2 mb-2 font-bold">
            <span className="text-irloBg uppercase flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-irloLive" />
              INGEST UPLINK (MOBILE PHONE / BAG)
            </span>
            <span className="text-[11px] text-green-700">SRT SLS :9000</span>
          </div>
          <div className="space-y-1 text-[11px] text-irloMuted">
            <div className="flex justify-between">
              <span>Carrier Modem Link:</span>
              <span className="text-irloBg font-bold">modem0 (T-Mobile LTE)</span>
            </div>
            <div className="flex justify-between">
              <span>Packet Loss:</span>
              <span className="text-green-700 font-bold">0.01% (Recovered via SRT)</span>
            </div>
            <div className="flex justify-between">
              <span>Uplink Bandwidth Headroom:</span>
              <span className="text-irloBg font-bold">22.4 Mbit/s available</span>
            </div>
          </div>
        </div>

        {/* Egress Broadcast Card */}
        <div className="border border-irloRule2/30 bg-cardAlt/40 p-3">
          <div className="flex items-center justify-between border-b border-irloRule2/20 pb-2 mb-2 font-bold">
            <span className="text-irloBg uppercase flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-irloAccent" />
              EGRESS BROADCAST (CLOUD OBS -&gt; PLATFORMS)
            </span>
            <span className="text-[11px] text-irloAccent">RTMP OUT</span>
          </div>
          <div className="space-y-1 text-[11px] text-irloMuted">
            <div className="flex justify-between">
              <span>Hardware Encoder:</span>
              <span className="text-irloBg font-bold">NVIDIA NVENC (GTX 1650)</span>
            </div>
            <div className="flex justify-between">
              <span>GPU Encoder Load:</span>
              <span className="text-irloBg font-bold">{telemetry.nvencLoadPercent}% (60.0 FPS)</span>
            </div>
            <div className="flex justify-between items-baseline gap-2">
              <span className="whitespace-nowrap">Active Restream Targets:</span>
              <div className="text-right">
                {activeDestinations.length > 0 ? (
                  <div className="flex flex-wrap justify-end gap-1 font-bold">
                    {activeDestinations.map((d) => (
                      <span
                        key={d.id}
                        className="text-green-700 bg-green-50 border border-green-200 px-1.5 py-0.5 text-[10px] uppercase font-mono tracking-tight"
                      >
                        {d.id === 'custom' ? 'TikTok / Custom' : d.name.split('.')[0]} (Live)
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-red-700 font-bold">None (Relay Idle)</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </InvertedCard>
  );
};
