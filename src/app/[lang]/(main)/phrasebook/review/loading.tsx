import { Skeleton } from "@/shared/ui/skeleton";

const ReviewLoading = () => (
	<>
		<header className="flex shrink-0 items-center gap-2.5 border-b-[0.5px] border-bd-1 bg-surf px-[22px] py-3">
			<Skeleton className="h-3.5 w-3.5 rounded" />
			<Skeleton className="h-3.5 w-28 rounded" />
		</header>

		<div className="flex flex-1 overflow-hidden">
			<div className="flex flex-1 flex-col items-center justify-center gap-5 overflow-y-auto bg-panel px-6 py-8">
				<div className="flex gap-2">
					<Skeleton className="h-[72px] w-[88px] rounded-card" />
					<Skeleton className="h-[72px] w-[88px] rounded-card" />
					<Skeleton className="h-[72px] w-[88px] rounded-card" />
				</div>
				<Skeleton className="h-7 w-48 rounded" />
				<Skeleton className="h-10 w-[340px] max-w-full rounded-base" />
				<Skeleton className="h-4 w-64 rounded" />
				<Skeleton className="h-10 w-36 rounded-base" />
			</div>
		</div>
	</>
);

export default ReviewLoading;
