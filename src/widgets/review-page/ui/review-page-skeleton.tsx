const Bone = ({ className }: { className: string }) => (
	<div className={`animate-pulse rounded bg-surf-3 ${className}`} />
);

export const ReviewPageSkeleton = () => (
	<div className="flex flex-1 flex-col overflow-hidden">
		{/* Topbar */}
		<div className="flex shrink-0 items-center gap-2.5 border-b border-[0.5px] border-bd-1 bg-surf px-[22px] py-3 max-md:px-3.5 max-md:py-2.5">
			<Bone className="h-3.5 w-3.5 max-md:hidden" />
			<Bone className="h-4 w-28 max-md:hidden" />
			<div className="flex gap-0.5 rounded-base border-[0.5px] border-bd-2 bg-surf-2 p-0.5 max-md:flex-1">
				<Bone className="h-[26px] w-20 rounded-[6px] max-md:flex-1" />
				<Bone className="h-[26px] w-16 rounded-[6px] max-md:flex-1" />
			</div>
			<Bone className="ml-auto h-3.5 w-44 max-lg:hidden" />
		</div>

		{/* SM-2 intro content */}
		<div className="flex flex-1 flex-col items-center justify-center px-6 py-8 max-md:justify-start max-md:px-5 max-md:pt-7">
			{/* Stat boxes */}
			<div className="mb-5 flex gap-2.5 max-md:w-full max-md:gap-2">
				{[80, 80, 80].map((w, i) => (
					<div
						key={i}
						className="min-w-[80px] animate-pulse rounded-card border-[0.5px] border-bd-2 bg-surf-2 px-4 py-3 text-center shadow-sm max-md:flex-1 max-md:min-w-0"
						style={{ width: w }}
					>
						<div className="mx-auto h-7 w-8 rounded bg-surf-3" />
						<div className="mx-auto mt-2 h-2.5 w-10 rounded bg-surf-3" />
					</div>
				))}
			</div>

			{/* Title */}
			<Bone className="mb-1.5 h-6 w-48" />
			{/* Subtitle */}
			<Bone className="mb-5 h-4 w-64" />

			{/* Start button */}
			<Bone className="h-11 w-36 rounded-xl" />

			{/* Queue */}
			<div className="mt-5 w-full max-w-[420px] border-t border-bd-1 pt-4">
				<Bone className="mb-2 h-3 w-14" />
				<div className="flex flex-col gap-1">
					{Array.from({ length: 4 }).map((_, i) => (
						<div
							key={i}
							className="flex items-center gap-2.5 rounded-base border-[0.5px] border-bd-1 bg-surf px-3 py-2"
						>
							<div className="size-1.5 animate-pulse rounded-full bg-surf-3" />
							<Bone className="h-4 flex-1" />
							<Bone className="h-3.5 w-20" />
						</div>
					))}
				</div>
			</div>
		</div>
	</div>
);
