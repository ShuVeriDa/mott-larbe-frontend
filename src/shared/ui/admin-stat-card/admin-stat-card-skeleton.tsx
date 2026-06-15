import { cn } from "@/shared/lib/cn";

interface AdminStatCardSkeletonProps {
	className?: string;
	hideSub?: boolean;
}

export const AdminStatCardSkeleton = ({
	className,
	hideSub,
}: AdminStatCardSkeletonProps) => (
	<div
		className={cn(
			"rounded-card border border-bd-1 bg-surf px-3.5 py-3",
			className,
		)}
	>
		<div className="mb-2 h-2.5 w-20 animate-pulse rounded bg-surf-3" />
		<div className="h-6 w-14 animate-pulse rounded bg-surf-3" />
		{!hideSub && (
			<div className="mt-1 h-2.5 w-16 animate-pulse rounded bg-surf-3" />
		)}
	</div>
);
