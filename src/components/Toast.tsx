import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode
} from 'react';

export type ToastTone = 'info' | 'success' | 'error';

interface Toast {
  id: number;
  message: string;
  tone: ToastTone;
}

interface Ctx {
  show: (message: string, tone?: ToastTone) => void;
}

const ToastContext = createContext<Ctx | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((cur) => cur.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(
    (message: string, tone: ToastTone = 'info') => {
      const id = ++idRef.current;
      setToasts((cur) => [...cur, { id, message, tone }]);
      setTimeout(() => dismiss(id), 2800);
    },
    [dismiss]
  );

  const value = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="
          pointer-events-none fixed z-[60] flex flex-col gap-2
          left-1/2 -translate-x-1/2
          bottom-[calc(80px+env(safe-area-inset-bottom))]
          md:bottom-6 md:right-6 md:left-auto md:translate-x-0 md:items-end
        "
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={[
              'pointer-events-auto rounded-full bg-ink text-paper-light px-4 py-2 text-sm shadow-lg animate-fade-in',
              t.tone === 'success' ? 'border-l-4 border-forest' : '',
              t.tone === 'error' ? 'border-l-4 border-burgundy' : ''
            ].join(' ')}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
