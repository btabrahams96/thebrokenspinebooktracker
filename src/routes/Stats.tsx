import PageHeader from '../components/PageHeader';

export default function Stats() {
  return (
    <div className="px-5 pt-8 md:px-12 md:pt-12">
      <PageHeader eyebrow="§ 04" title="Stats" subtitle="A quiet count of what you've read." />
      <p className="mt-8 text-sepia max-w-prose">
        Numbers arrive in Phase 04.
      </p>
    </div>
  );
}
