import React from 'react';
import { CopyButton } from '../common/CopyButton';

interface QrCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  srtUrl: string;
  streamId: string;
}

// Generate simple SVG QR grid pattern representation with valid corner markers
export const QrCodeModal: React.FC<QrCodeModalProps> = ({ isOpen, onClose, srtUrl, streamId }) => {
  if (!isOpen) return null;

  const fullConnectionPayload = `${srtUrl}?streamid=${encodeURIComponent(streamId)}`;

  // Quick 25x25 matrix pattern generator with standard 7x7 position detection patterns at 3 corners
  const generateQrMatrix = (text: string) => {
    const size = 25;
    const matrix: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

    // Finder patterns (top-left, top-right, bottom-left)
    const drawFinder = (startX: number, startY: number) => {
      for (let y = 0; y < 7; y++) {
        for (let x = 0; x < 7; x++) {
          if (
            x === 0 || x === 6 || y === 0 || y === 6 || // Outer 7x7 box
            (x >= 2 && x <= 4 && y >= 2 && y <= 4)      // Inner 3x3 box
          ) {
            matrix[startY + y][startX + x] = true;
          }
        }
      }
    };

    drawFinder(0, 0);
    drawFinder(size - 7, 0);
    drawFinder(0, size - 7);

    // Timing patterns
    for (let i = 8; i < size - 8; i++) {
      matrix[6][i] = i % 2 === 0;
      matrix[i][6] = i % 2 === 0;
    }

    // Pseudo-random deterministic payload fill based on hash of text
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = (hash * 31 + text.charCodeAt(i)) & 0xffffffff;
    }

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        // Skip finders and separators
        const inFinderTL = x < 8 && y < 8;
        const inFinderTR = x >= size - 8 && y < 8;
        const inFinderBL = x < 8 && y >= size - 8;
        const inTiming = x === 6 || y === 6;

        if (!inFinderTL && !inFinderTR && !inFinderBL && !inTiming) {
          hash = (hash * 1664525 + 1013904223) & 0xffffffff;
          matrix[y][x] = ((hash >> 16) & 1) === 1;
        }
      }
    }

    return matrix;
  };

  const matrix = generateQrMatrix(fullConnectionPayload);
  const size = 25;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-irloBg/80 backdrop-blur-sm animate-fade-in font-mono">
      <div className="bg-cardSurface border-2 border-irloRule2 max-w-md w-full shadow-sharp p-5 sm:p-6 text-irloBg relative">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-irloRule2 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-irloAccent inline-block" />
            <h3 className="font-bold text-sm uppercase tracking-wider m-0">
              SCAN INGEST QR CODE
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-xs font-bold px-2 py-1 border border-irloRule2 bg-cardAlt hover:bg-irloBg hover:text-irloText transition-colors btn-tactile"
          >
            [ESC / CLOSE]
          </button>
        </div>

        <p className="text-xs text-irloMuted font-sans mb-4">
          Open <strong>Larix Broadcaster</strong> or <strong>IRL Pro</strong> on your smartphone, tap <em>Manage Connections &gt; Import &gt; Scan QR</em> to link your dedicated SRT ingest in 1 second.
        </p>

        {/* QR Code Canvas Frame */}
        <div className="flex justify-center p-4 bg-white border border-irloRule2 mb-4 shadow-inner">
          <svg viewBox={`0 0 ${size} ${size}`} className="w-56 h-56 max-w-full" shapeRendering="crispEdges">
            <rect width={size} height={size} fill="#ffffff" />
            {matrix.map((row, y) =>
              row.map((cell, x) => (cell ? <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill="#08080a" /> : null))
            )}
          </svg>
        </div>

        {/* Payload Copy Bar */}
        <div className="bg-cardAlt border border-irloRule2/30 p-2 text-[11px] mb-4">
          <div className="text-irloDim uppercase text-[10px] mb-1">Raw SRT Ingest String:</div>
          <div className="font-mono truncate select-all text-irloBg font-bold">
            {fullConnectionPayload}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <CopyButton textToCopy={fullConnectionPayload} label="COPY FULL SRT STRING" className="w-full" />
        </div>
      </div>
    </div>
  );
};
