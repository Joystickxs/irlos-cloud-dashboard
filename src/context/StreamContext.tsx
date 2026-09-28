import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  StreamHealthState,
  TelemetryData,
  IngestConfig,
  StudioScene,
  RestreamDestination,
  NoalbsSettings,
  ServerInstanceInfo,
  ChatCommand,
} from '../types/dashboard';

interface StreamContextType {
  telemetry: TelemetryData;
  ingestConfig: IngestConfig;
  scenes: StudioScene[];
  currentSceneId: string;
  isLive: boolean;
  isPanicActive: boolean;
  restreamDestinations: RestreamDestination[];
  noalbs: NoalbsSettings;
  serverInfo: ServerInstanceInfo;
  chatCommands: ChatCommand[];
  audioState: {
    isPlaying: boolean;
    volume: number;
    isMuted: boolean;
  };
  notification: string | null;
  // Actions
  switchScene: (sceneId: string) => void;
  triggerPanic: () => void;
  toggleStreamLive: () => void;
  toggleRestream: (id: string) => void;
  updateRestreamKey: (id: string, key: string) => void;
  updateNoalbs: (settings: Partial<NoalbsSettings>) => void;
  toggleAudio: () => void;
  setAudioVolume: (vol: number) => void;
  restartStreamStack: () => Promise<void>;
  simulateBitrateDrop: () => void;
  showToast: (msg: string) => void;
}

const defaultIngestConfig: IngestConfig = {
  srtUrl: 'srt://ingest.irlos.live:9000',
  srtPort: 9000,
  streamId: '#!::r=live/sub_8849,m=publish,token=irl_live_9a2f7c001',
  passphrase: 'irlos_secure_k891',
  latencyMs: 120,
};

const defaultScenes: StudioScene[] = [
  {
    id: 'scene-live',
    name: 'Live (Cam)',
    label: 'LIVE CAM',
    hotkey: 'F1',
    description: 'Main camera feed & active microphone',
  },
  {
    id: 'scene-brb',
    name: 'BRB / Poor Signal',
    label: 'STANDBY / BRB',
    hotkey: 'F2',
    description: 'Low-bandwidth loop while reconnecting modems',
  },
  {
    id: 'scene-map',
    name: 'Map / GPS Overlay',
    label: 'GPS MAP',
    hotkey: 'F3',
    description: 'Fullscreen live tracker & city route overlay',
  },
  {
    id: 'scene-offline',
    name: 'Stream Offline',
    label: 'OFFLINE',
    hotkey: 'F4',
    description: 'Broadcast standby card with upcoming schedule',
  },
];

const defaultRestreams: RestreamDestination[] = [
  {
    id: 'kick',
    name: 'Kick.com',
    enabled: true,
    streamKey: 'sk_us_live_89f02b189a00cd419',
    rtmpUrl: 'rtmp://fa723fc1b212.global-contribute.live-video.net/app',
    status: 'online',
  },
  {
    id: 'twitch',
    name: 'Twitch',
    enabled: true,
    streamKey: 'live_891048201_Xk89q02LaM0912',
    rtmpUrl: 'rtmp://iad05.contribute.live-video.net/app',
    status: 'online',
  },
  {
    id: 'youtube',
    name: 'YouTube Live',
    enabled: false,
    streamKey: 'rtmp-yt-4891-9982-xla0',
    rtmpUrl: 'rtmp://a.rtmp.youtube.com/live2',
    status: 'idle',
  },
  {
    id: 'custom',
    name: 'Custom RTMP (TikTok/X)',
    enabled: false,
    streamKey: '',
    rtmpUrl: 'rtmp://custom.ingest.target.com/live',
    status: 'idle',
  },
];

const defaultNoalbs: NoalbsSettings = {
  autoSwitchEnabled: true,
  lowBitrateThreshold: 2000,
  offlineThreshold: 500,
  recoveryDelaySeconds: 4,
  normalScene: 'scene-live',
  lowBitrateScene: 'scene-brb',
  offlineScene: 'scene-offline',
};

const defaultServerInfo: ServerInstanceInfo = {
  state: 'ACTIVE',
  id: 'irlos-vm-iad2-984',
  region: 'US-East (Virginia)',
  hostname: 'stream-alpha.irlos.live',
  ip: '149.28.192.81',
  gpu: 'NVIDIA GTX 1650 (NVENC HW)',
  driver: 'NVIDIA 535.154.05',
  uptimeStr: '18d 14h 22m',
  planName: 'IRLOS Cloud Managed',
  planPrice: '$30.00 / month',
};

const defaultCommands: ChatCommand[] = [
  { command: '!brb', role: 'moderator', action: 'Switches scene to BRB / Poor Signal' },
  { command: '!live', role: 'moderator', action: 'Forces scene back to Live Cam' },
  { command: '!bitrate', role: 'everyone', action: 'Replies with current ingest kbps & dropped frames' },
  { command: '!fixaudio', role: 'moderator', action: 'Restarts PipeWire audio buffer on server' },
  { command: '!stats', role: 'everyone', action: 'Returns server uptime, GPU temperature & latency' },
];

const StreamContext = createContext<StreamContextType | undefined>(undefined);

export const StreamProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLive, setIsLive] = useState(true);
  const [isPanicActive, setIsPanicActive] = useState(false);
  const [currentSceneId, setCurrentSceneId] = useState('scene-live');
  const [ingestConfig] = useState<IngestConfig>(defaultIngestConfig);
  const [scenes] = useState<StudioScene[]>(defaultScenes);
  const [restreamDestinations, setRestreamDestinations] = useState<RestreamDestination[]>(defaultRestreams);
  const [noalbs, setNoalbs] = useState<NoalbsSettings>(defaultNoalbs);
  const [serverInfo, setServerInfo] = useState<ServerInstanceInfo>(defaultServerInfo);
  const [chatCommands] = useState<ChatCommand[]>(defaultCommands);
  const [notification, setNotification] = useState<string | null>(null);

  const [audioState, setAudioState] = useState({
    isPlaying: true,
    volume: 85,
    isMuted: false,
  });

  // Initial Telemetry history
  const [telemetry, setTelemetry] = useState<TelemetryData>(() => {
    const history = [];
    const now = Date.now();
    for (let i = 20; i >= 0; i--) {
      const t = new Date(now - i * 3000);
      const timeStr = t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      history.push({
        time: timeStr,
        bitrate: 5600 + Math.floor(Math.sin(i) * 350) + Math.floor(Math.random() * 150),
        rtt: 40 + Math.floor(Math.cos(i) * 5),
      });
    }
    return {
      health: 'LIVE',
      bitrate: 5820,
      targetBitrate: 6000,
      rtt: 41,
      droppedFrames: 14,
      droppedPercent: 0.02,
      uptimeSeconds: 7420,
      fps: 60,
      resolution: '1080p60',
      nvencLoadPercent: 24,
      cpuPercent: 18,
      history,
    };
  });

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((curr) => (curr === msg ? null : curr));
    }, 3200);
  };

  // Live Telemetry Simulation Loop
  useEffect(() => {
    if (!isLive) {
      setTelemetry((prev) => ({
        ...prev,
        health: 'OFFLINE',
        bitrate: 0,
        rtt: 0,
        fps: 0,
        nvencLoadPercent: 4,
      }));
      return;
    }

    const interval = setInterval(() => {
      setTelemetry((prev) => {
        // Natural jitter
        const jitter = (Math.random() - 0.5) * 220;
        let nextBitrate = Math.max(0, Math.min(6200, Math.round(prev.bitrate + jitter)));
        if (isPanicActive) {
          nextBitrate = 0;
        }

        const nextRtt = Math.max(25, Math.min(180, Math.round(41 + (Math.random() - 0.48) * 8)));
        const newDropped = prev.droppedFrames + (Math.random() > 0.88 ? 1 : 0);

        let health: StreamHealthState = 'LIVE';
        if (isPanicActive) {
          health = 'PANIC';
        } else if (nextBitrate === 0) {
          health = 'OFFLINE';
        } else if (nextBitrate < noalbs.lowBitrateThreshold) {
          health = 'DEGRADED';
        }

        const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const nextHistory = [...prev.history.slice(1), { time: nowStr, bitrate: nextBitrate, rtt: nextRtt }];
        const activeCount = restreamDestinations.filter((d) => d.enabled).length;

        return {
          ...prev,
          health,
          bitrate: nextBitrate,
          rtt: nextRtt,
          droppedFrames: newDropped,
          uptimeSeconds: prev.uptimeSeconds + 1,
          nvencLoadPercent: 16 + activeCount * 4,
          history: nextHistory,
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isLive, isPanicActive, noalbs.lowBitrateThreshold, restreamDestinations]);

  // NOALBS Automated Recovery Trigger Listener
  useEffect(() => {
    if (!noalbs.autoSwitchEnabled || !isLive || isPanicActive) return;

    if (telemetry.bitrate > 0 && telemetry.bitrate < noalbs.lowBitrateThreshold && currentSceneId === 'scene-live') {
      setCurrentSceneId(noalbs.lowBitrateScene);
      showToast(`[NOALBS] Bitrate dipped (${telemetry.bitrate} kbps) -> Auto-switched to BRB`);
    } else if (telemetry.bitrate >= noalbs.lowBitrateThreshold && currentSceneId === 'scene-brb') {
      // Simulate recovery delay
      const timer = setTimeout(() => {
        setCurrentSceneId('scene-live');
        showToast(`[NOALBS] Bitrate recovered (${telemetry.bitrate} kbps) -> Auto-switched back to Live`);
      }, noalbs.recoveryDelaySeconds * 1000);
      return () => clearTimeout(timer);
    }
  }, [telemetry.bitrate, noalbs, currentSceneId, isLive, isPanicActive]);

  const switchScene = (sceneId: string) => {
    if (isPanicActive) {
      setIsPanicActive(false);
      showToast('Panic mode disengaged.');
    }
    setCurrentSceneId(sceneId);
    const targetScene = scenes.find((s) => s.id === sceneId);
    showToast(`Studio Scene: ${targetScene?.name || sceneId}`);
  };

  const triggerPanic = () => {
    if (!isPanicActive) {
      setIsPanicActive(true);
      setCurrentSceneId('scene-offline');
      setAudioState((prev) => ({ ...prev, isMuted: true }));
      showToast('EMERGENCY PANIC ENGAGED: Audio muted, scene set to Offline.');
    } else {
      setIsPanicActive(false);
      setCurrentSceneId('scene-live');
      setAudioState((prev) => ({ ...prev, isMuted: false }));
      showToast('Emergency Panic Cleared: Live feed restored.');
    }
  };

  const toggleStreamLive = () => {
    if (isLive) {
      setIsLive(false);
      setCurrentSceneId('scene-offline');
      showToast('OBS Broadcast Stopped.');
    } else {
      setIsLive(true);
      setCurrentSceneId('scene-live');
      setIsPanicActive(false);
      showToast('OBS Broadcast Started -> Live on all active restreams.');
    }
  };

  const toggleRestream = (id: string) => {
    setRestreamDestinations((prev) =>
      prev.map((dest) => {
        if (dest.id === id) {
          const nextState = !dest.enabled;
          showToast(`${dest.name} restream ${nextState ? 'ENABLED' : 'PAUSED'}`);
          return {
            ...dest,
            enabled: nextState,
            status: nextState ? 'online' : 'idle',
          };
        }
        return dest;
      })
    );
  };

  const updateRestreamKey = (id: string, key: string) => {
    setRestreamDestinations((prev) =>
      prev.map((dest) => (dest.id === id ? { ...dest, streamKey: key } : dest))
    );
    showToast('Stream key updated in /etc/irlos/config.json');
  };

  const updateNoalbs = (settings: Partial<NoalbsSettings>) => {
    setNoalbs((prev) => ({ ...prev, ...settings }));
    showToast('NOALBS recovery thresholds updated.');
  };

  const toggleAudio = () => {
    setAudioState((prev) => {
      const nextMuted = !prev.isMuted;
      showToast(nextMuted ? 'Chat Reader Muted' : 'Chat Reader Unmuted');
      return { ...prev, isMuted: nextMuted };
    });
  };

  const setAudioVolume = (vol: number) => {
    setAudioState((prev) => ({ ...prev, volume: vol, isMuted: vol === 0 }));
  };

  const restartStreamStack = async () => {
    showToast('Executing systemctl restart irlos-session...');
    setServerInfo((prev) => ({ ...prev, state: 'REBOOTING' }));
    await new Promise((resolve) => setTimeout(resolve, 2200));
    setServerInfo((prev) => ({ ...prev, state: 'ACTIVE' }));
    showToast('IRLOS stream stack restarted successfully [OK]');
  };

  const simulateBitrateDrop = () => {
    setTelemetry((prev) => ({
      ...prev,
      bitrate: 1150,
      rtt: 120,
    }));
    showToast('Simulating poor cell reception (1150 kbps)...');
  };

  return (
    <StreamContext.Provider
      value={{
        telemetry,
        ingestConfig,
        scenes,
        currentSceneId,
        isLive,
        isPanicActive,
        restreamDestinations,
        noalbs,
        serverInfo,
        chatCommands,
        audioState,
        notification,
        switchScene,
        triggerPanic,
        toggleStreamLive,
        toggleRestream,
        updateRestreamKey,
        updateNoalbs,
        toggleAudio,
        setAudioVolume,
        restartStreamStack,
        simulateBitrateDrop,
        showToast,
      }}
    >
      {children}
    </StreamContext.Provider>
  );
};

export const useStream = () => {
  const context = useContext(StreamContext);
  if (!context) {
    throw new Error('useStream must be used within a StreamProvider');
  }
  return context;
};
