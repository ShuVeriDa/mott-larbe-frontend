export const FeedbackListSkeleton = () => (
	<>
		{Array.from({ length: 5 }).map((_, i) => (
			<div key={i} className="flex flex-col gap-1 border-b border-bd-1 px-3 py-2.5">
				<div className="flex items-center gap-2">
					<div className="h-[18px] w-12 animate-pulse rounded-[5px] bg-surf-3" />
					<div className="h-3 flex-1 animate-pulse rounded bg-surf-3" />
					<div className="h-[18px] w-14 animate-pulse rounded-[5px] bg-surf-3" />
				</div>
				<div className="flex items-stretch gap-2.5">
					<div className="size-9 animate-pulse self-center rounded-full bg-surf-3" />
					<div className="flex flex-1 flex-col gap-1.5">
						<div className="flex items-center justify-between gap-2">
							<div className="h-3 w-28 animate-pulse rounded bg-surf-3" />
							<div className="h-2.5 w-8 animate-pulse rounded bg-surf-3" />
						</div>
						<div className="h-2.5 w-3/4 animate-pulse rounded bg-surf-3" />
					</div>
				</div>
			</div>
		))}
	</>
);
