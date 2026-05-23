import { CSSProperties } from "react";

const Bone = ({ className, style }: { className: string; style?: CSSProperties }) => (
	<div className={`animate-pulse rounded bg-surf-3 ${className}`} style={style} />
);

const ReaderPageLoading = () => (
	<>
		{/* Topbar */}
		<header className="flex h-[46px] shrink-0 items-center gap-2 border-b border-hairline border-bd-1 bg-surf px-4">
			{/* Back button */}
			<Bone className="h-6 w-20" />

			<span className="h-4 w-px shrink-0 bg-bd-2 max-md:hidden" />

			{/* Title block */}
			<div className="min-w-0 flex-1 space-y-1.5">
				<Bone className="h-3 w-40" />
				<Bone className="h-2.5 w-52 max-md:hidden" />
			</div>

			{/* Pager */}
			<div className="flex shrink-0 items-center gap-1">
				<Bone className="h-7 w-7" />
				<Bone className="h-3 w-10" />
				<Bone className="h-7 w-7" />
			</div>

			<span className="h-4 w-px shrink-0 bg-bd-2" />

			{/* Action icons */}
			<div className="flex shrink-0 items-center gap-1">
				{Array.from({ length: 8 }).map((_, i) => (
					<Bone key={i} className="h-[30px] w-[30px]" />
				))}
			</div>
		</header>

		{/* Body */}
		<article className="flex-1 overflow-y-auto px-6 pt-8 pb-15 max-md:pt-4">
			<div className="mx-auto max-w-[680px]">
				{/* Progress bar */}
				<div className="mb-7">
					<div className="mb-2 flex justify-between">
						<Bone className="h-2.5 w-20" />
						<Bone className="h-2.5 w-6" />
					</div>
					<Bone className="h-[3px] w-full rounded-full" />
				</div>

				{/* Article header */}
				<div className="mb-7 border-b border-hairline border-bd-1 pb-6">
					{/* Badges */}
					<div className="mb-3 flex flex-wrap gap-1.5">
						<Bone className="h-4 w-14" />
						<Bone className="h-4 w-10" />
						<Bone className="h-4 w-16" />
					</div>
					{/* H1 */}
					<Bone className="mb-2.5 h-8 w-3/4" />
					{/* Byline */}
					<div className="flex items-center gap-2">
						<Bone className="h-3 w-24" />
						<Bone className="h-3 w-32" />
					</div>
				</div>

				{/* Paragraphs */}
				<div className="space-y-6">
					{[
						[1, 0.9, 0.95, 0.7],
						[0.85, 1, 0.6],
						[0.95, 0.8, 1, 0.5],
						[1, 0.75, 0.9],
					].map((lines, pi) => (
						<div key={pi} className="space-y-2">
							{lines.map((w, li) => (
								<Bone
									key={li}
									className="h-4"
									style={{ width: `${w * 100}%` }}
								/>
							))}
						</div>
					))}
				</div>
			</div>
		</article>
	</>
);

export default ReaderPageLoading;
