export type StreamHealthState = 'OFFLINE' | 'IDLE' | 'LIVE' | 'DEGRADED' | 'PANIC';

export interface TelemetryPoint {
  time: string;
  bitrate: number;
  rtt: number;
}

export interface TelemetryData {
  health: StreamHealthState;
  bitrate: number; // kbps
  targetBitrate: number; // kbps
  rtt: number; // ms
  droppedFrames: number;
  droppedPercent: number;
  uptimeSeconds: number;
  fps: number;
  resolution: string;
  nvencLoadPercent: number;
  cpuPercent: number;
  history: TelemetryPoint[];
}

export interface IngestConfig {
  srtUrl: string;
  srtPort: number;
  streamId: string;
  passphrase: string;
  latencyMs: number;
}

export interface StudioScene {
  id: string;
  name: string;
  label: string;
  hotkey: string;
  description: string;
}

export interface RestreamDestination {
  id: 'kick' | 'twitch' | 'youtube' | 'custom';
  name: string;
  enabled: boolean;
  streamKey: string;
  rtmpUrl: string;
  status: 'online' | 'idle' | 'error';
}

export interface NoalbsSettings {
  autoSwitchEnabled: boolean;
  lowBitrateThreshold: number; // kbps
  offlineThreshold: number; // kbps
  recoveryDelaySeconds: number; // seconds
  normalScene: string;
  lowBitrateScene: string;
  offlineScene: string;
}

export interface ServerInstanceInfo {
  state: 'ACTIVE' | 'PROVISIONING' | 'REBOOTING' | 'OFFLINE';
  id: string;
  region: string;
  hostname: string;
  ip: string;
  gpu: string;
  driver: string;
  uptimeStr: string;
  planName: string;
  planPrice: string;
}

export interface ChatCommand {
  command: string;
  role: 'everyone' | 'moderator' | 'streamer';
  action: string;
}
