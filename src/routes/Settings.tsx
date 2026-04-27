import PageHeader from '../components/PageHeader';

export default function Settings() {
  return (
    <div className="px-5 pt-8 md:px-12 md:pt-12">
      <PageHeader eyebrow="§ 05" title="Settings" subtitle="A short list, on purpose." />
      <p className="mt-8 text-sepia max-w-prose">
        PIN entry and sign-out land in Phase 03.
      </p>
    </div>
  );
}
