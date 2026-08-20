import { Skeleton } from "@/components/ui/skeleton";

const UsersTableSkeleton = () => {
  return (
    <div className="rounded-md border">
      <div className="flex items-center gap-4 p-4 border-b">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-5 w-16" />
      </div>

      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-4 p-4 border-b last:border-b-0"
        >
          <Skeleton className="h-8 w-8 rounded-full" />

          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-40" />
          </div>

          <Skeleton className="h-5 w-16" />

          <Skeleton className="h-5 w-16" />

          <Skeleton className="h-8 w-8" />
        </div>
      ))}
    </div>
  );
};

export default UsersTableSkeleton;