import React from 'react';

interface StatusLedProps {
  status: 'live' | 'warning' | 'danger' | 'idle';
  label?: string;
  size?: 'sm' | 'md';
}

export const StatusLed: React.FC<StatusLedProps> = ({ status, label, size = 'md' }) => {
  let ledClass = 'led'; // default green pulse
  let textColor = 'text-irloBg';

  if (status === 'warning') {
    ledClass = 'led-warning';
    textColor = 'text-amber-700';
  } else if (status === 'danger') {
    ledClass = 'led-danger';
    textColor = 'text-red-700';
  } else if (status === 'idle') {
    ledClass = 'w-2 h-2 rounded-full bg-irloMuted inline-block';
    textColor = 'text-irloMuted';
  }

  return (
    <span className="inline-flex items-center gap-2">
      <span className={ledClass} aria-hidden="true" />
      {label && <span className={`text-xs uppercase tracking-wider font-bold ${textColor}`}>{label}</span>}
    </span>
  );
};
