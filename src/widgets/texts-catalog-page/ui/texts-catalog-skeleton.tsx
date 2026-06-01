export const TextsCatalogSkeleton = () => (
	<div className="flex flex-1 flex-col overflow-hidden">
		<div className="h-[48px] shrink-0 animate-pulse border-b border-bd-1 bg-surf" />
		<div className="flex-1 px-5 pt-5 max-sm:px-3">
			<div className="grid grid-cols-[repeat(auto-fill,minmax(272px,1fr))] gap-3 max-sm:grid-cols-1">
				{Array.from({ length: 6 }).map((_, i) => (
					<div key={i} className="animate-pulse rounded-card border border-bd-1 bg-surf p-4">
						<div className="mb-3 flex gap-2">
							<div className="h-5 w-8 rounded bg-surf-3" />
							<div className="h-5 w-14 rounded bg-surf-3" />
						</div>
						<div className="mb-1.5 h-4 w-3/4 rounded bg-surf-3" />
						<div className="mb-3 h-3 w-1/2 rounded bg-surf-3" />
						<div className="h-7 w-20 rounded-base bg-surf-3" />
					</div>
				))}
			</div>
		</div>
	</div>
);
