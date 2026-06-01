import { Skeleton } from "@/shared/ui/skeleton";

export const PhraseCardSkeleton = () => (
	<div className="bg-surf border-[0.5px] border-bd-1 rounded-[10px] px-3.5 py-3 flex items-start gap-3">
		<Skeleton className="w-1.5 h-1.5 rounded-full mt-[5px] shrink-0" />
		<div className="flex-1 min-w-0 flex flex-col gap-1.5">
			<Skeleton className="h-4 w-2/3 rounded" />
			<Skeleton className="h-3 w-1/2 rounded" />
			<Skeleton className="h-3 w-3/4 rounded" />
		</div>
	</div>
);
