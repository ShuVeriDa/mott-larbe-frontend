export const ProfilePageSkeleton = () => (
	<div className="flex flex-col gap-3.5 px-[22px] pt-[18px] pb-10 max-md:px-3.5 max-md:pt-3.5">
		<div className="h-[82px] rounded-[12px] bg-surf-2 animate-pulse" />
		<div className="h-[38px] w-64 rounded-[9px] bg-surf-2 animate-pulse" />
		<div className="h-[220px] rounded-card bg-surf-2 animate-pulse" />
		<div className="h-[160px] rounded-card bg-surf-2 animate-pulse" />
	</div>
);
