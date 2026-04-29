import { useState, type ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function PinGate({ children }: { children: ReactNode }) {
  const { state, signIn } = useAuth();
  const [pin, setPin] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (state === 'unknown') {
    return (
      <div className="min-h-screen grid place-items-center text-sepia">
        <p className="italic">Opening the door…</p>
      </div>
    );
  }

  if (state === 'in') return <>{children}</>;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await signIn(pin);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Try again.');
      setPin('');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center px-6">
      <form onSubmit={submit} className="w-full max-w-sm text-center">
        <div className="display text-5xl text-burgundy">The Broken<span className="text-forest">.</span>Spine</div>
        <p className="mt-3 text-sepia italic">A library of one. Enter your PIN.</p>
        <input
          autoFocus
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={6}
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
          className="mt-8 w-full rounded-md border border-line bg-paper-light px-4 py-3 text-center font-mono text-2xl tracking-[0.4em] text-ink outline-none focus:border-burgundy"
          aria-label="PIN"
        />
        {error && <p className="mt-3 text-sm text-burgundy">{error}</p>}
        <button
          type="submit"
          disabled={busy || pin.length < 4}
          className="mt-6 w-full rounded-md bg-burgundy px-4 py-3 text-sm font-semibold text-paper-light disabled:opacity-50"
        >
          {busy ? 'Checking…' : 'Open'}
        </button>
      </form>
    </div>
  );
}
