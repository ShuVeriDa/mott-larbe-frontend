// Read-only skeleton — matches reader layout dimensions to prevent CLS
export const MyTextReaderSkeleton = () => (
  <div className="mx-auto max-w-2xl px-6 py-8">
    <div className="mb-6 h-7 w-2/3 animate-pulse rounded bg-surf-3" />
    <div className="mb-4 h-4 w-1/3 animate-pulse rounded bg-surf-3" />
    <div className="space-y-3">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className={`h-4 animate-pulse rounded bg-surf-3 ${i % 3 === 2 ? "w-1/2" : "w-full"}`}
        />
      ))}
    </div>
  </div>
);
