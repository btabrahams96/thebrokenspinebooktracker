import PageHeader from '../components/PageHeader';

export default function Add() {
  return (
    <div className="px-5 pt-8 md:px-12 md:pt-12">
      <PageHeader eyebrow="§ 03" title="Add" subtitle="Aim at the barcode, or search." />
      <div className="mt-10 rounded-2xl border border-line bg-paper-light p-8 max-w-md">
        <p className="text-sepia">
          The scanner lands here in Phase 02.
        </p>
      </div>
    </div>
  );
}
