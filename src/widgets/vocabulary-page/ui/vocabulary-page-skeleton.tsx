export const VocabularyPageSkeleton = () => (
	<div className="flex min-h-0 flex-1 overflow-hidden">
		{/* Sidebar skeleton */}
		<div className="hidden w-[220px] shrink-0 flex-col gap-4 border-r border-bd-1 bg-surf p-4 md:flex">
			<div className="h-[120px] rounded-card bg-surf-2 animate-pulse" />
			<div className="h-[120px] rounded-card bg-surf-2 animate-pulse" />
			<div className="h-[80px] rounded-card bg-surf-2 animate-pulse" />
		</div>
		{/* Main area skeleton */}
		<div className="flex min-w-0 flex-1 flex-col">
			{/* Filter bar */}
			<div className="h-[44px] shrink-0 border-b border-bd-1 bg-surf animate-pulse" />
			{/* Word cards */}
			<div className="flex flex-1 flex-col gap-1.5 overflow-hidden px-[18px] pt-3.5">
				{Array.from({ length: 6 }).map((_, i) => (
					<div
						key={i}
						className="h-[54px] rounded-card bg-surf-2 animate-pulse"
						style={{ animationDelay: `${i * 60}ms` }}
					/>
				))}
			</div>
		</div>
	</div>
);
