import type { CSSProperties } from "react";

const ShimmerBlock = ({
	className,
	delay = 0,
}: {
	className: string;
	delay?: number;
}) => (
	<div
		aria-hidden="true"
		className={`overflow-hidden bg-surf-3 ${className}`}
		style={{ animationDelay: `${delay}ms` } as CSSProperties}
	>
		<div
			className="h-full w-[200%]"
			style={{
				background:
					"linear-gradient(90deg, var(--surf-3) 0%, var(--surf-4) 38%, var(--surf-3) 56%, var(--surf-3) 100%)",
				animation: `shimmer 1.8s ease-in-out ${delay}ms infinite`,
			}}
		/>
	</div>
);

export const DashboardSkeleton = () => (
	<div
		aria-busy="true"
		className="flex flex-col gap-3.5 overflow-y-auto px-[22px] pb-7 pt-4 max-md:px-4 max-sm:px-3.5 max-sm:pb-5 max-sm:pt-3.5"
	>
		{/* greeting */}
		<div className="flex items-start justify-between gap-4">
			<div className="flex flex-col gap-2">
				<ShimmerBlock className="h-7 w-56 rounded-md" delay={0} />
				<ShimmerBlock className="h-4 w-44 rounded-md" delay={60} />
			</div>
			<ShimmerBlock className="h-8 w-36 rounded-base" delay={120} />
		</div>

		{/* stats grid */}
		<div className="grid grid-cols-4 gap-2 max-md:grid-cols-2">
			{Array.from({ length: 4 }).map((_, i) => (
				<ShimmerBlock
					key={i}
					className="h-[96px] rounded-card"
					delay={i * 60}
				/>
			))}
		</div>

		{/* review banner */}
		<ShimmerBlock className="h-[84px] rounded-card" delay={120} />

		{/* continue reading */}
		<div className="flex flex-col gap-2.5">
			<ShimmerBlock className="h-4 w-32 rounded-md" delay={0} />
			<div className="grid grid-cols-3 gap-2 max-md:grid-cols-2">
				{Array.from({ length: 3 }).map((_, i) => (
					<ShimmerBlock
						key={i}
						className="h-[148px] rounded-card"
						delay={i * 60}
					/>
				))}
			</div>
		</div>

		{/* library */}
		<div className="flex flex-col gap-2.5">
			<ShimmerBlock className="h-4 w-28 rounded-md" delay={0} />
			<div className="grid grid-cols-3 gap-2 max-md:grid-cols-2 max-sm:grid-cols-1">
				{Array.from({ length: 6 }).map((_, i) => (
					<ShimmerBlock
						key={i}
						className="h-[178px] rounded-card"
						delay={i * 50}
					/>
				))}
			</div>
		</div>
	</div>
);
