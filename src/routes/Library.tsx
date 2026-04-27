import PageHeader from '../components/PageHeader';

export default function Library() {
  return (
    <div className="px-5 pt-8 md:px-12 md:pt-12">
      <PageHeader eyebrow="§ 01" title="Library" subtitle="Everything you own." />
      <p className="mt-8 text-sepia max-w-prose">
        Nothing here yet. Scan something.
      </p>
    </div>
  );
}
