export const CardSkeleton = () => (
	<div className="animate-pulse rounded-card border border-bd-1 bg-surf p-4">
		<div className="mb-3 flex gap-2">
			<div className="h-5 w-8 rounded bg-surf-3" />
			<div className="h-5 w-14 rounded bg-surf-3" />
		</div>
		<div className="mb-1.5 h-4 w-3/4 rounded bg-surf-3" />
		<div className="mb-3 h-3 w-1/2 rounded bg-surf-3" />
		<div className="h-7 w-20 rounded-base bg-surf-3" />
	</div>
);
