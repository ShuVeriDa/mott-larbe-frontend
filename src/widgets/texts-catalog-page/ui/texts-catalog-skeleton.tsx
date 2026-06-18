import { LibraryPreviewCardSkeleton } from "@/widgets/dashboard-page/ui/library-preview-card";

const TopbarSkeleton = () => (
	<div>
		<div className="flex shrink-0 items-center gap-2.5 border-b-[0.5px] border-bd-1 bg-white px-[22px] py-3 max-md:gap-2 max-md:px-[14px] max-md:py-2.5">
			<div className="h-4 w-28 animate-pulse rounded bg-surf-3" />
			<div className="hidden flex-1 sm:block" />
			<div className="hidden h-7 w-[180px] animate-pulse rounded bg-surf-3 sm:block" />
		</div>
		<div className="flex items-center gap-1 border-b border-bd-1 bg-white px-3 py-1.5 sm:hidden">
			<div className="h-[26px] flex-1 animate-pulse rounded bg-surf-3" />
			<div className="h-[26px] w-[60px] animate-pulse rounded bg-surf-3" />
		</div>
		<nav className="border-b border-bd-1 bg-white">
			<div className="flex items-center gap-1 overflow-x-hidden px-3 py-1.5">
				{Array.from({ length: 4 }).map((_, i) => (
					<div key={i} className="h-[26px] w-[60px] animate-pulse rounded bg-surf-3 sm:h-[22px]" />
				))}
			</div>
		</nav>
	</div>
);

export const TextsCatalogSkeleton = () => (
	<div className="flex flex-1 flex-col overflow-hidden">
		<TopbarSkeleton />
		<div className="flex-1 overflow-y-auto px-5 pt-5 max-sm:px-3">
			<div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-3 sm:grid-cols-[repeat(auto-fill,minmax(160px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] lg:grid-cols-[repeat(auto-fill,minmax(196px,1fr))] lg:gap-4">
				{Array.from({ length: 12 }).map((_, i) => (
					<LibraryPreviewCardSkeleton key={i} />
				))}
			</div>
		</div>
	</div>
);
