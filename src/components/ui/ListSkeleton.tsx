import { Skeleton } from "./States";

/** Placeholder shown while a filtered list streams in. */
export function ListSkeleton({ variant = "rows" }: { variant?: "rows" | "cards" }) {
  if (variant === "cards") {
    return (
      <div aria-busy="true" className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="border border-line">
            <Skeleton className="aspect-[3/2] w-full" />
            <div className="space-y-3 p-6">
              <Skeleton className="h-3 w-1/3" />
              <Skeleton className="h-5 w-5/6" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div aria-busy="true" className="mt-8 space-y-4">
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} className="flex gap-5 border border-line p-6">
          <Skeleton className="h-16 w-14 shrink-0" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-3 w-1/4" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
