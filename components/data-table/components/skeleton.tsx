import { Skeleton } from "@/components/ui/skeleton";

interface DataTableSkeletonProps {
  showFilter?: boolean;
}

export function DataTableSkeleton({
  showFilter = false,
}: DataTableSkeletonProps) {
  return (
    <div className="mt-12">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-6 w-52" />
        <Skeleton className="h-4 w-72" />
      </div>

      {/* search + view bar */}
      <div className="flex items-center justify-between pt-6">
        {/* Search input and optional Filter button wrapped together */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-[150px] lg:w-[250px]" />
          {showFilter && <Skeleton className="h-8 w-24" />}
        </div>
        <Skeleton className="hidden h-8 w-20 lg:block" />
      </div>

      {/* header row */}
      <div className="pt-4">
        <Skeleton className="h-9 w-full" />
      </div>

      {/* data rows */}
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton rows, order never changes
          key={i}
          className="grid grid-cols-2 gap-4 border-b pt-2 lg:grid-cols-4"
        >
          {Array.from({ length: 4 }).map((_, j) => (
            <Skeleton
              // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton cols, order never changes
              key={j}
              className={`h-7 w-full ${j >= 2 ? "hidden lg:block" : ""}`}
            />
          ))}
        </div>
      ))}

      {/* footer */}
      <div className="flex flex-col-reverse items-center gap-4 pt-6 lg:flex-row lg:items-center lg:justify-between">
        {/* selected rows - bottom on mobile, left on desktop */}
        <Skeleton className="h-4 w-40" />
        {/* right - rows per page + pagination */}
        <div className="flex flex-col items-center gap-2 lg:flex-row lg:items-center lg:gap-12">
          <Skeleton className="h-8 w-64 md:w-48" />
          <Skeleton className="h-8 w-48 md:w-64" />
        </div>
      </div>
    </div>
  );
}
