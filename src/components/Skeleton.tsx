export function GridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 lg:gap-5 xl:grid-cols-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="aspect-[2/3] rounded-md bg-paper-deep animate-shimmer" />
      ))}
    </div>
  );
}

export function LineSkeleton({ width = 'w-32' }: { width?: string }) {
  return <div className={`h-4 rounded bg-paper-deep animate-shimmer ${width}`} />;
}
