import { useEffect, useState } from 'react';
import Page from '../components/Page';
import PageHeader from '../components/PageHeader';
import { useAuth } from '../hooks/useAuth';
import { api } from '../lib/api';
import { useToast } from '../components/Toast';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

const THEME_KEY = 'tbs-theme';
type Theme = 'auto' | 'light';

export default function Settings() {
  const { signOut } = useAuth();
  const toast = useToast();
  const [theme, setTheme] = useState<Theme>('light');
  const [exporting, setExporting] = useState(false);
  useDocumentTitle('The Broken Spine — Settings');

  useEffect(() => {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'auto' || saved === 'light') setTheme(saved);
  }, []);

  const setThemeAndPersist = (next: Theme) => {
    setTheme(next);
    localStorage.setItem(THEME_KEY, next);
  };

  const exportLibrary = async () => {
    setExporting(true);
    try {
      const r = await api.listItems({});
      const blob = new Blob([JSON.stringify(r.items, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `broken-spine-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.show(`Exported ${r.items.length} items`, 'success');
    } catch (e) {
      toast.show(e instanceof Error ? e.message : 'Export failed.', 'error');
    } finally {
      setExporting(false);
    }
  };

  return (
    <Page>
      <PageHeader eyebrow="§ 05" title="Settings" subtitle="A short list, on purpose." />

      <div className="mt-10 space-y-6 max-w-md">
        <Section title="Theme" hint="Auto follows your device. Dark mode lives in the future.">
          <div className="inline-flex rounded-md border border-line bg-paper-deep p-1">
            <ThemeButton active={theme === 'auto'} onClick={() => setThemeAndPersist('auto')}>
              Auto
            </ThemeButton>
            <ThemeButton active={theme === 'light'} onClick={() => setThemeAndPersist('light')}>
              Light
            </ThemeButton>
          </div>
        </Section>

        <Section title="Export library" hint="Download every item as JSON. A small backup.">
          <button
            onClick={() => void exportLibrary()}
            disabled={exporting}
            className="rounded-md bg-burgundy px-4 py-2 text-sm font-semibold text-paper-light disabled:opacity-60"
          >
            {exporting ? 'Exporting…' : 'Download JSON'}
          </button>
        </Section>

        <Section title="Sign out" hint="Forget the PIN cookie on this device.">
          <button
            onClick={() => void signOut()}
            className="rounded-md border border-line bg-paper-deep px-4 py-2 text-sm font-semibold text-ink"
          >
            Sign out
          </button>
        </Section>

        <Section title="About" hint="The Broken Spine Library — a personal PWA. v0.1.0.">
          <p className="text-xs italic text-sepia">
            Books, manga, comics. One library, no algorithm.
          </p>
        </Section>
      </div>
    </Page>
  );
}

function Section({
  title,
  hint,
  children
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-line bg-paper-light p-5">
      <h2 className="display text-lg text-ink">{title}</h2>
      {hint && <p className="mt-1 text-sm italic text-sepia">{hint}</p>}
      <div className="mt-3">{children}</div>
    </div>
  );
}

function ThemeButton({
  active,
  onClick,
  children
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-xs font-semibold rounded ${
        active ? 'bg-burgundy text-paper-light' : 'text-ink'
      }`}
    >
      {children}
    </button>
  );
}
