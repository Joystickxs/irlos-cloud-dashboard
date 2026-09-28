import React from 'react';
import { ExternalLinkIcon, TvIcon } from '../common/Icons';

interface NovncModalProps {
  isOpen: boolean;
  onClose: () => void;
  hostname: string;
}

export const NovncModal: React.FC<NovncModalProps> = ({ isOpen, onClose, hostname }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-irloBg/80 backdrop-blur-sm animate-fade-in font-mono">
      <div className="bg-cardSurface border-2 border-irloRule2 max-w-2xl w-full shadow-sharp p-5 sm:p-6 text-irloBg relative">
        <div className="flex items-center justify-between border-b border-irloRule2 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <TvIcon size={18} className="text-irloAccent" />
            <h3 className="font-bold text-sm uppercase tracking-wider m-0">
              IRLOS STUDIO // BROWSER VNC ACCESS
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-xs font-bold px-2 py-1 border border-irloRule2 bg-cardAlt hover:bg-irloBg hover:text-irloText transition-colors btn-tactile"
          >
            [CLOSE]
          </button>
        </div>

        <p className="text-xs text-irloMuted font-sans mb-4">
          Visual browser access to your stripped-down IrlosStudio instance. Use this when you want to arrange browser overlay URLs (StreamElements / Botrix / TipeeeStream) or resize audio meters.
        </p>

        {/* Security Alert from README */}
        <div className="bg-cardAlt border border-irloRule2 p-3 text-xs mb-4">
          <span className="font-bold uppercase text-[11px] text-irloBg block mb-1">
            🔒 Backend Stream Key Isolation:
          </span>
          <p className="text-[11px] text-irloDim font-sans m-0">
            Stream keys are stored securely in <code className="bg-white px-1">/etc/irlos/config.json</code> and stripped from the IrlosStudio GUI. Anyone viewing this session cannot extract your platform credentials.
          </p>
        </div>

        {/* Web VNC Connection Frame Simulation */}
        <div className="border border-irloRule2 bg-irloBg p-6 text-center text-irloText mb-4">
          <div className="w-12 h-12 border-2 border-irloAccent border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <span className="text-xs font-bold uppercase tracking-wider block text-irloAccent mb-1">
            INITIALIZING SECURE WEBSOCKET TUNNEL
          </span>
          <span className="text-[11px] text-irloMuted font-mono block">
            wss://{hostname}:6080/vnc.html?autoconnect=true
          </span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <a
            href={`https://${hostname}:6080/vnc.html`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-irloAccent text-irloBg font-bold text-xs uppercase border border-irloRule2 hover:bg-irloBg hover:text-irloAccent transition-colors btn-tactile"
          >
            <span>OPEN STUDIO IN FULLSCREEN TAB</span>
            <ExternalLinkIcon size={14} />
          </a>
        </div>
      </div>
    </div>
  );
};
