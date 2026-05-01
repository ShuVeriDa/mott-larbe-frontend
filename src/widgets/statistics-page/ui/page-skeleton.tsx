import { Skeleton } from "@/shared/ui/skeleton";

export const PageSkeleton = () => (
	<div className="flex flex-col gap-3.5 px-5 pb-7 pt-4 max-md:px-4 max-md:pb-6 max-md:pt-3.5">
		<div className="grid grid-cols-4 gap-2 max-md:grid-cols-2">
			{Array.from({ length: 4 }).map((_, i) => (
				<Skeleton key={i} className="h-[110px] w-full rounded-card" />
			))}
		</div>
		<Skeleton className="h-[180px] w-full rounded-card" />
		<div className="grid grid-cols-2 gap-2 max-md:grid-cols-1">
			<Skeleton className="h-[180px] w-full rounded-card" />
			<Skeleton className="h-[180px] w-full rounded-card" />
		</div>
		<Skeleton className="h-[280px] w-full rounded-card" />
		<div className="grid grid-cols-2 gap-2 max-md:grid-cols-1">
			<Skeleton className="h-[200px] w-full rounded-card" />
			<Skeleton className="h-[200px] w-full rounded-card" />
		</div>
	</div>
);
