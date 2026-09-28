import React from 'react';
import { TelemetryPoint } from '../../types/dashboard';

interface SparklineChartProps {
  data: TelemetryPoint[];
  lowThreshold: number;
}

export const SparklineChart: React.FC<SparklineChartProps> = ({ data, lowThreshold }) => {
  if (!data || data.length < 2) {
    return <div className="h-28 flex items-center justify-center text-xs text-irloDim font-mono">Telemetry awaiting stream...</div>;
  }

  const height = 110;
  const width = 500;
  const paddingY = 12;
  const maxBitrate = 7000;
  const minBitrate = 0;

  const points = data.map((pt, i) => {
    const x = (i / (data.length - 1)) * width;
    const clamped = Math.max(minBitrate, Math.min(maxBitrate, pt.bitrate));
    const y = height - paddingY - (clamped / maxBitrate) * (height - paddingY * 2);
    return `${x},${y}`;
  });

  const pathD = `M ${points.join(' L ')}`;
  const areaD = `${pathD} L ${width},${height} L 0,${height} Z`;

  // Calculate Y position for low bitrate threshold line
  const thresholdY = height - paddingY - (lowThreshold / maxBitrate) * (height - paddingY * 2);

  return (
    <div className="w-full relative overflow-hidden bg-irloBg border border-irloRule2 p-2">
      <div className="flex items-center justify-between text-[10px] font-mono text-irloMuted mb-1 px-1">
        <span>LIVE TELEMETRY (LAST 60 SECONDS)</span>
        <span className="text-irloAccent">MAX: 7,000 KBPS</span>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-24 overflow-visible" preserveAspectRatio="none">
        <defs>
          <linearGradient id="bitrateFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#00d4ff" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        <line x1="0" y1={height * 0.25} x2={width} y2={height * 0.25} stroke="#1e1e20" strokeWidth="1" strokeDasharray="3 3" />
        <line x1="0" y1={height * 0.5} x2={width} y2={height * 0.5} stroke="#1e1e20" strokeWidth="1" strokeDasharray="3 3" />
        <line x1="0" y1={height * 0.75} x2={width} y2={height * 0.75} stroke="#1e1e20" strokeWidth="1" strokeDasharray="3 3" />

        {/* NOALBS Low Bitrate Threshold line */}
        <line
          x1="0"
          y1={thresholdY}
          x2={width}
          y2={thresholdY}
          stroke="#f59e0b"
          strokeWidth="1.5"
          strokeDasharray="4 2"
        />

        {/* Fill Area */}
        <path d={areaD} fill="url(#bitrateFill)" />

        {/* Trend Line */}
        <path d={pathD} fill="none" stroke="#00d4ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

        {/* Current Endpoint Pulse Dot */}
        {points.length > 0 && (
          <circle
            cx={points[points.length - 1].split(',')[0]}
            cy={points[points.length - 1].split(',')[1]}
            r="4"
            fill="#4ade80"
            stroke="#08080a"
            strokeWidth="1.5"
          />
        )}
      </svg>

      <div className="flex items-center justify-between text-[10px] font-mono text-irloDim mt-1 px-1">
        <span>-60s</span>
        <span className="text-amber-500 font-bold">--- NOALBS CUTOFF ({lowThreshold} kbps)</span>
        <span>NOW</span>
      </div>
    </div>
  );
};
