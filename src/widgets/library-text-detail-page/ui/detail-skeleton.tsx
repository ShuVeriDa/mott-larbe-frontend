export const DetailSkeleton = () => (
	<div className="flex flex-1 flex-col overflow-hidden">
		<div className="h-12 bg-panel border-b border-bd-1 shrink-0" />
		<div className="flex-1 overflow-y-auto px-8 pb-12 pt-7 max-sm:px-3.5 max-sm:pt-4 max-md:px-5">
			<div className="max-w-[860px] animate-pulse">
				<div className="flex gap-5 mb-6">
					<div className="w-[88px] h-[126px] rounded-card bg-surf-3 shrink-0" />
					<div className="flex-1 flex flex-col gap-3 pt-1">
						<div className="flex gap-1.5">
							<div className="h-5 w-8 rounded bg-surf-3" />
							<div className="h-5 w-16 rounded bg-surf-3" />
						</div>
						<div className="h-6 w-2/3 rounded bg-surf-3" />
						<div className="h-4 w-1/2 rounded bg-surf-3" />
						<div className="flex gap-2">
							<div className="h-9 w-28 rounded-base bg-surf-3" />
							<div className="h-9 w-20 rounded-base bg-surf-3" />
						</div>
					</div>
				</div>
				<div className="h-20 rounded-card bg-surf-3 mb-4" />
				<div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
					{Array.from({ length: 4 }).map((_, i) => (
						<div key={i} className="h-44 rounded-card bg-surf-3" />
					))}
				</div>
			</div>
		</div>
	</div>
);
