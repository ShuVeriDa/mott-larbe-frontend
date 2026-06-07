export const FeedbackChatSkeleton = () => (
	<div className="flex flex-1 flex-col">
		{/* Header skeleton */}
		<div className="flex shrink-0 items-center gap-2.5 border-b border-bd-1 bg-surf px-5 py-3">
			<div className="flex-1">
				<div className="mb-1.5 h-3 w-48 animate-pulse rounded-sm bg-surf-3" />
				<div className="h-2.5 w-24 animate-pulse rounded-sm bg-surf-3" />
			</div>
			<div className="h-2.5 w-16 animate-pulse rounded-sm bg-surf-3" />
		</div>

		{/* Messages skeleton */}
		<div className="flex flex-1 flex-col gap-4 px-5 py-[18px]">
			{[1, 2, 3].map((i) => (
				<div key={i} className="flex items-end gap-2">
					<div className="size-[26px] shrink-0 animate-pulse rounded-full bg-surf-3" />
					<div className="h-12 w-56 animate-pulse rounded-xl bg-surf-3" />
				</div>
			))}
			<div className="flex flex-row-reverse items-end gap-2">
				<div className="size-[26px] shrink-0 animate-pulse rounded-full bg-surf-3" />
				<div className="h-9 w-40 animate-pulse rounded-xl bg-surf-3" />
			</div>
		</div>
	</div>
);

export const FeedbackListSkeleton = () => (
	<div className="flex flex-col">
		{[1, 2, 3, 4, 5].map((i) => (
			<div key={i} className="flex flex-col gap-1.5 border-b border-bd-1 px-2 py-1.5">
				{/* Row 1: type badge | title + status badge */}
				<div className="flex items-center gap-2">
					<div className="h-[18px] w-12 animate-pulse rounded-[5px] bg-surf-3" />
					<div className="h-3 flex-1 animate-pulse rounded bg-surf-3" />
					<div className="h-[18px] w-14 animate-pulse rounded-[5px] bg-surf-3" />
				</div>
				{/* Rows 2–3: avatar + right side */}
				<div className="flex items-center gap-2">
					<div className="size-8 animate-pulse rounded-full bg-surf-3 shrink-0" />
					<div className="flex flex-1 flex-col gap-1">
						<div className="flex items-center justify-between gap-2">
							<div className="h-3 w-24 animate-pulse rounded bg-surf-3" />
							<div className="h-2.5 w-8 animate-pulse rounded bg-surf-3" />
						</div>
						<div className="h-2.5 w-3/4 animate-pulse rounded bg-surf-3" />
					</div>
				</div>
			</div>
		))}
	</div>
);
