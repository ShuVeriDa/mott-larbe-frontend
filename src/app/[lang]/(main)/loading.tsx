const Bone = ({ className }: { className: string }) => (
	<div className={`animate-pulse rounded bg-surf-3 ${className}`} />
);

const MainPageLoading = () => (
	<div className="flex flex-1 flex-col overflow-hidden">
		{/* Topbar skeleton */}
		<div className="flex h-[46px] shrink-0 items-center gap-3 border-b-[0.5px] border-bd-1 bg-surf px-4">
			<Bone className="h-5 w-32" />
			<div className="flex-1" />
			<Bone className="h-7 w-24" />
		</div>

		{/* Content skeleton */}
		<div className="flex flex-1 flex-col gap-4 overflow-hidden p-6">
			<div className="flex gap-3">
				<Bone className="h-8 w-28" />
				<Bone className="h-8 w-20" />
				<Bone className="h-8 w-24" />
			</div>
			<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
				{Array.from({ length: 6 }).map((_, i) => (
					<Bone key={i} className="h-36 w-full rounded-lg" />
				))}
			</div>
		</div>
	</div>
);

export default MainPageLoading;
