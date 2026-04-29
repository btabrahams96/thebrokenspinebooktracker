import Page from '../components/Page';
import PageHeader from '../components/PageHeader';
import { useAuth } from '../hooks/useAuth';

export default function Settings() {
  const { signOut } = useAuth();

  return (
    <Page>
      <PageHeader eyebrow="§ 05" title="Settings" subtitle="A short list, on purpose." />

      <div className="mt-10 space-y-6 max-w-md">
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
