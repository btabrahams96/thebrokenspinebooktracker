import PageHeader from '../components/PageHeader';

export default function Wishlist() {
  return (
    <div className="px-5 pt-8 md:px-12 md:pt-12">
      <PageHeader eyebrow="§ 02" title="Wishlist" subtitle="Things you want next." />
      <p className="mt-8 text-sepia max-w-prose">
        Empty for now. Add a title from the search screen.
      </p>
    </div>
  );
}
