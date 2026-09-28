import React, { useState } from 'react';
import { CopyIcon, CheckIcon } from './Icons';

interface CopyButtonProps {
  textToCopy: string;
  label?: string;
  className?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({ textToCopy, label = 'COPY', className = '' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older contexts
      const textarea = document.createElement('textarea');
      textarea.value = textToCopy;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      type="button"
      className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider border border-irloRule2 bg-irloBg text-irloText hover:bg-irloAccent hover:text-irloBg hover:border-irloAccent transition-colors duration-100 btn-tactile ${className}`}
      title="Copy to clipboard"
    >
      {copied ? (
        <>
          <CheckIcon size={14} className="text-irloLive" />
          <span>COPIED</span>
        </>
      ) : (
        <>
          <CopyIcon size={14} />
          <span>{label}</span>
        </>
      )}
    </button>
  );
};
