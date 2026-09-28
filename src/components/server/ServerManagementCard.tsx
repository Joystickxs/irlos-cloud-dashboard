import React, { useState } from 'react';
import { useStream } from '../../context/StreamContext';
import { InvertedCard } from '../common/InvertedCard';
import { StatusLed } from '../common/StatusLed';
import { NovncModal } from './NovncModal';
import { ServerIcon, RotateCwIcon, ExternalLinkIcon, CpuIcon, TvIcon } from '../common/Icons';

export const ServerManagementCard: React.FC = () => {
  const { serverInfo, restartStreamStack, showToast } = useStream();
  const [isRestarting, setIsRestarting] = useState(false);
  const [isVncOpen, setIsVncOpen] = useState(false);
  const [confirmReboot, setConfirmReboot] = useState(false);

  const handleRestartStack = async () => {
    setIsRestarting(true);
    await restartStreamStack();
    setIsRestarting(false);
  };

  const handleVmReboot = () => {
    if (!confirmReboot) {
      setConfirmReboot(true);
      setTimeout(() => setConfirmReboot(false), 4000);
      return;
    }
    showToast('Executing sudo reboot on cloud instance...');
    setConfirmReboot(false);
  };

  return (
    <>
      <InvertedCard
        title="Subscription & Server Management"
        subtitle="Dedicated cloud infrastructure health, streamctl recovery, and Stripe billing"
        badge={
          <StatusLed
            status={serverInfo.state === 'ACTIVE' ? 'live' : 'warning'}
            label={serverInfo.state}
          />
        }
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 font-mono">
          {/* Left: Server Infrastructure Specs (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Instance Banner */}
            <div className="bg-cardAlt border border-irloRule2 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-irloRule2/20 pb-3 mb-3">
                <div>
                  <span className="text-[10px] text-irloDim uppercase block">CLOUD INSTANCE ID</span>
                  <span className="text-base font-extrabold text-irloBg">{serverInfo.id}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-irloDim uppercase block">REGION</span>
                  <span className="text-xs font-bold text-irloBg">{serverInfo.region}</span>
                </div>
              </div>

              {/* Hardware Spec Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="bg-cardSurface border border-irloRule2/30 p-2">
                  <span className="text-[10px] text-irloDim uppercase block">Hardware GPU</span>
                  <span className="font-bold text-irloBg">{serverInfo.gpu}</span>
                </div>
                <div className="bg-cardSurface border border-irloRule2/30 p-2">
                  <span className="text-[10px] text-irloDim uppercase block">Driver</span>
                  <span className="font-bold text-irloBg">{serverInfo.driver}</span>
                </div>
                <div className="bg-cardSurface border border-irloRule2/30 p-2">
                  <span className="text-[10px] text-irloDim uppercase block">Uptime</span>
                  <span className="font-bold text-green-700">{serverInfo.uptimeStr}</span>
                </div>
                <div className="bg-cardSurface border border-irloRule2/30 p-2">
                  <span className="text-[10px] text-irloDim uppercase block">Host IP</span>
                  <span className="font-bold text-irloBg select-all">{serverInfo.ip}</span>
                </div>
                <div className="bg-cardSurface border border-irloRule2/30 p-2">
                  <span className="text-[10px] text-irloDim uppercase block">Display Layer</span>
                  <span className="font-bold text-irloBg">HDMI Dummy Plug (4K)</span>
                </div>
                <div className="bg-cardSurface border border-irloRule2/30 p-2">
                  <span className="text-[10px] text-irloDim uppercase block">OS Release</span>
                  <span className="font-bold text-irloBg">IRLOS 1.0 (GPL-3.0)</span>
                </div>
              </div>
            </div>

            {/* Quick Server Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleRestartStack}
                disabled={isRestarting}
                className="inline-flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase border border-irloRule2 bg-irloBg text-irloAccent hover:bg-cardSurface hover:text-irloBg transition-colors btn-tactile disabled:opacity-50"
              >
                <RotateCwIcon size={14} className={isRestarting ? 'animate-spin' : ''} />
                <span>{isRestarting ? 'RESTARTING STACK...' : 'RESTART STREAM STACK'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsVncOpen(true)}
                className="inline-flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase border border-irloRule2 bg-cardAlt hover:bg-cardSurface text-irloBg transition-colors btn-tactile"
              >
                <TvIcon size={14} />
                <span>LAUNCH BROWSER STUDIO (VNC)</span>
              </button>

              <button
                type="button"
                onClick={handleVmReboot}
                className={`inline-flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase border transition-colors btn-tactile ${
                  confirmReboot
                    ? 'bg-red-600 text-white border-red-700 animate-pulse'
                    : 'border-red-300 text-red-700 hover:bg-red-600 hover:text-white'
                }`}
              >
                <span>{confirmReboot ? 'CONFIRM SYSTEM REBOOT?' : 'REBOOT VM'}</span>
              </button>
            </div>
          </div>

          {/* Right: Subscription & Stripe Billing Portal (5 cols) */}
          <div className="lg:col-span-5 bg-cardAlt border border-irloRule2 p-4 flex flex-col justify-between">
            <div>
              <div className="border-b border-irloRule2/20 pb-2 mb-3 flex items-center justify-between">
                <span className="font-extrabold text-xs uppercase text-irloBg">
                  SUBSCRIPTION DETAILS
                </span>
                <span className="bg-green-100 text-green-800 border border-green-300 text-[10px] font-bold px-1.5 py-0.5">
                  ACTIVE RECURRING
                </span>
              </div>

              <div className="space-y-2 text-xs mb-4">
                <div className="flex justify-between">
                  <span className="text-irloDim">Package:</span>
                  <span className="font-bold text-irloBg">{serverInfo.planName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-irloDim">Monthly Rate:</span>
                  <span className="font-bold text-irloBg">{serverInfo.planPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-irloDim">Billing Cycle:</span>
                  <span className="text-irloBg">Auto-renews monthly</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-irloDim">SLS Ingest Port:</span>
                  <span className="font-bold text-irloAccent">Port 9000 (Dedicated)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-irloDim">Support Tier:</span>
                  <span className="text-irloBg font-bold">Standard Cloud Support</span>
                </div>
              </div>
            </div>

            {/* Direct Stripe Customer Portal Link */}
            <div className="pt-3 border-t border-irloRule2/20">
              <a
                href="https://billing.stripe.com/p/login/test_portal"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-irloBg text-irloAccent border border-irloRule2 font-bold text-xs uppercase tracking-wider hover:bg-cardSurface hover:text-irloBg transition-colors btn-tactile shadow-sharp-sm"
              >
                <span>OPEN STRIPE CUSTOMER PORTAL</span>
                <ExternalLinkIcon size={14} />
              </a>
              <span className="block text-[10px] text-irloDim font-sans text-center mt-2">
                Download VAT invoices, update card details, or cancel subscription with 1 click.
              </span>
            </div>
          </div>
        </div>
      </InvertedCard>

      <NovncModal
        isOpen={isVncOpen}
        onClose={() => setIsVncOpen(false)}
        hostname={serverInfo.hostname}
      />
    </>
  );
};
