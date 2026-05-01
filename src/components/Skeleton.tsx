export function GridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="tbs-card-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="aspect-[2/3] rounded-md bg-paper-deep animate-shimmer" />
      ))}
    </div>
  );
}

export function LineSkeleton({ width = 'w-32' }: { width?: string }) {
  return <div className={`h-4 rounded bg-paper-deep animate-shimmer ${width}`} />;
}
