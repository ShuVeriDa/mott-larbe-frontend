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

const RowSkeleton = ({ delay = 0 }: { delay?: number }) => (
	<div className="flex flex-col gap-2.5">
		<ShimmerBlock className="h-4 w-36 rounded-md" delay={delay} />
		<div className="flex gap-2.5 overflow-hidden">
			{Array.from({ length: 5 }).map((_, i) => (
				<ShimmerBlock
					key={i}
					className="h-[230px] w-[160px] shrink-0 rounded-card"
					delay={delay + i * 40}
				/>
			))}
		</div>
	</div>
);

export const DashboardSkeleton = () => (
	<div
		aria-busy="true"
		className="flex flex-col gap-5 overflow-y-auto px-[22px] pb-8 pt-4 max-md:px-4 max-sm:gap-4 max-sm:px-3.5 max-sm:pt-3.5"
	>
		{/* Greeting */}
		<div className="flex items-start justify-between gap-4">
			<div className="flex flex-col gap-2">
				<ShimmerBlock className="h-7 w-52 rounded-md" delay={0} />
				<ShimmerBlock className="h-4 w-40 rounded-md" delay={60} />
			</div>
			<ShimmerBlock className="h-8 w-32 rounded-base" delay={120} />
		</div>

		{/* Stats grid */}
		<div className="grid grid-cols-4 gap-2 max-md:grid-cols-2">
			{Array.from({ length: 4 }).map((_, i) => (
				<ShimmerBlock key={i} className="h-[92px] rounded-card" delay={i * 50} />
			))}
		</div>

		{/* Review banner */}
		<ShimmerBlock className="h-[82px] rounded-card" delay={100} />

		{/* Streak calendar */}
		<ShimmerBlock className="h-[120px] rounded-card" delay={120} />

		{/* Continue reading */}
		<div className="flex flex-col gap-2.5">
			<ShimmerBlock className="h-4 w-32 rounded-md" delay={0} />
			<div className="grid grid-cols-3 gap-2 max-md:grid-cols-2">
				{Array.from({ length: 3 }).map((_, i) => (
					<ShimmerBlock key={i} className="h-[136px] rounded-card" delay={i * 50} />
				))}
			</div>
		</div>

		{/* Text rows */}
		<RowSkeleton delay={0} />
		<RowSkeleton delay={80} />

		{/* Tags */}
		<div className="flex flex-col gap-2.5">
			<ShimmerBlock className="h-4 w-24 rounded-md" delay={0} />
			<div className="flex gap-2.5 overflow-hidden">
				{Array.from({ length: 8 }).map((_, i) => (
					<ShimmerBlock
						key={i}
						className="h-[88px] w-[80px] shrink-0 rounded-card"
						delay={i * 30}
					/>
				))}
			</div>
		</div>
	</div>
);
