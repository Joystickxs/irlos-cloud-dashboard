import React from 'react';

interface InvertedCardProps {
  title?: string;
  commandPrompt?: string;
  subtitle?: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  headerAction?: React.ReactNode;
}

export const InvertedCard: React.FC<InvertedCardProps> = ({
  title,
  commandPrompt,
  subtitle,
  badge,
  children,
  className = '',
  headerAction,
}) => {
  return (
    <div className={`bg-cardSurface border border-irloRule2 shadow-sharp-sm overflow-hidden ${className}`}>
      {/* Optional Terminal Prompt Bar */}
      {commandPrompt && (
        <div className="bg-irloSurface border-b border-irloRule px-3 py-1.5 flex items-center justify-between text-xs text-irloDim font-mono">
          <div className="flex items-center gap-1.5 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="text-irloAccent font-bold">$</span>
            <span className="text-irloText">{commandPrompt}</span>
          </div>
          {badge && <div>{badge}</div>}
        </div>
      )}

      {/* Main Header if title provided */}
      {title && !commandPrompt && (
        <div className="border-b border-irloRule2/20 bg-cardAlt/40 px-4 py-3 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold tracking-tight uppercase text-irloBg font-mono m-0">
                {title}
              </h2>
              {badge}
            </div>
            {subtitle && <p className="text-xs text-irloMuted font-sans mt-0.5 m-0">{subtitle}</p>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}

      {/* Card Content */}
      <div className="p-4 sm:p-5">
        {children}
      </div>
    </div>
  );
};
