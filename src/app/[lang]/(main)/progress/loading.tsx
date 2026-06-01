import { PageSkeleton } from "@/widgets/statistics-page";

export default function ProgressLoading() {
	return (
		<>
			<div className="flex shrink-0 items-center gap-3 border-b-[0.5px] border-bd-1 bg-surf px-[22px] py-3">
				<div className="h-4 w-28 animate-pulse rounded bg-surf-3" />
				<div className="ml-auto h-7 w-32 animate-pulse rounded bg-surf-3" />
			</div>
			<PageSkeleton />
		</>
	);
}
