import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { BarcodeFormat, DecodeHintType } from '@zxing/library';

type Props = {
  onDetected: (isbn: string) => void;
  paused?: boolean;
};

export default function Scanner({ onDetected, paused }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<{ stop: () => void } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [starting, setStarting] = useState(true);

  useEffect(() => {
    if (paused) return;
    let cancelled = false;

    const hints = new Map();
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.EAN_13, BarcodeFormat.EAN_8]);
    const reader = new BrowserMultiFormatReader(hints);

    (async () => {
      try {
        const devices = await BrowserMultiFormatReader.listVideoInputDevices();
        const back =
          devices.find((d) => /back|rear|environment/i.test(d.label)) ?? devices[devices.length - 1];
        if (!videoRef.current) return;
        const controls = await reader.decodeFromVideoDevice(
          back?.deviceId,
          videoRef.current,
          (result) => {
            if (cancelled) return;
            if (result) onDetected(result.getText());
          }
        );
        controlsRef.current = controls;
        setStarting(false);
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Camera unavailable.';
        setError(msg);
        setStarting(false);
      }
    })();

    return () => {
      cancelled = true;
      controlsRef.current?.stop();
      controlsRef.current = null;
    };
  }, [onDetected, paused]);

  return (
    <div className="relative w-full max-w-md aspect-[3/4] md:aspect-[4/3] overflow-hidden rounded-2xl bg-ink">
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        playsInline
        muted
      />

      {/* Corner brackets */}
      <div className="pointer-events-none absolute inset-[15%_12%]">
        <Corner pos="top-0 left-0" sides="border-t-2 border-l-2" />
        <Corner pos="top-0 right-0" sides="border-t-2 border-r-2" />
        <Corner pos="bottom-0 left-0" sides="border-b-2 border-l-2" />
        <Corner pos="bottom-0 right-0" sides="border-b-2 border-r-2" />
        {!starting && !error && (
          <span className="absolute inset-0 grid place-items-center">
            <span className="h-1.5 w-1.5 rounded-full bg-burgundy-light animate-pulse-dot" />
          </span>
        )}
      </div>

      {(starting || error) && (
        <div className="absolute inset-0 grid place-items-center bg-ink/80 p-6 text-center">
          <p className="text-paper-light text-sm">
            {error ? `Camera unavailable: ${error}` : 'Starting camera…'}
          </p>
        </div>
      )}
      <p className="absolute bottom-3 left-0 right-0 text-center text-xs italic text-paper-light/80">
        Aim at the barcode
      </p>
    </div>
  );
}

function Corner({ pos, sides }: { pos: string; sides: string }) {
  return <div className={`absolute h-6 w-6 ${sides} border-burgundy-light rounded-sm ${pos}`} />;
}
