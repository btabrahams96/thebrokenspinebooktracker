export function GridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="aspect-[2/3] animate-pulse rounded-md bg-paper-deep" />
      ))}
    </div>
  );
}

export function LineSkeleton({ width = 'w-32' }: { width?: string }) {
  return <div className={`h-4 animate-pulse rounded bg-paper-deep ${width}`} />;
}
