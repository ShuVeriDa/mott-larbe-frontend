export const DashboardSkeleton = () => (
	<div className="flex flex-col gap-3.5 overflow-y-auto px-[22px] pb-7 pt-4 max-md:px-4 max-sm:px-3.5 max-sm:pb-5 max-sm:pt-3.5">
		{/* greeting */}
		<div className="flex items-start justify-between gap-4">
			<div className="flex flex-col gap-2">
				<div className="h-7 w-56 animate-pulse rounded-md bg-surf-3" />
				<div className="h-4 w-44 animate-pulse rounded-md bg-surf-3" />
			</div>
			<div className="h-8 w-36 animate-pulse rounded-base bg-surf-3" />
		</div>

		{/* stats grid */}
		<div className="grid grid-cols-4 gap-2 max-md:grid-cols-2">
			{Array.from({ length: 4 }).map((_, i) => (
				<div
					key={i}
					className="h-[96px] animate-pulse rounded-card bg-surf-2"
				/>
			))}
		</div>

		{/* review banner */}
		<div className="h-[84px] animate-pulse rounded-card bg-surf-2" />

		{/* continue reading */}
		<div className="flex flex-col gap-2.5">
			<div className="h-4 w-32 animate-pulse rounded-md bg-surf-3" />
			<div className="grid grid-cols-3 gap-2 max-md:grid-cols-2">
				{Array.from({ length: 3 }).map((_, i) => (
					<div key={i} className="h-[148px] animate-pulse rounded-card bg-surf-2" />
				))}
			</div>
		</div>

		{/* library */}
		<div className="flex flex-col gap-2.5">
			<div className="h-4 w-28 animate-pulse rounded-md bg-surf-3" />
			<div className="grid grid-cols-3 gap-2 max-md:grid-cols-2 max-sm:grid-cols-1">
				{Array.from({ length: 6 }).map((_, i) => (
					<div key={i} className="h-[178px] animate-pulse rounded-card bg-surf-2" />
				))}
			</div>
		</div>
	</div>
);
