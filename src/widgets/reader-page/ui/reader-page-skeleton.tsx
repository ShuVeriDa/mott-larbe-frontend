import type { CSSProperties } from "react";

const Bone = ({
	w,
	h = 12,
	delay = 0,
	rounded = 3,
	style,
	className,
}: {
	w: string | number;
	h?: number;
	delay?: number;
	rounded?: number;
	style?: CSSProperties;
	className?: string;
}) => (
	<span
		aria-hidden="true"
		className={`block overflow-hidden shrink-0 ${className ?? ""}`}
		style={{ width: w, height: h, borderRadius: rounded, ...style }}
	>
		<span
			className="block h-full w-[200%]"
			style={{
				background:
					"linear-gradient(90deg, var(--surf-3) 0%, var(--surf-4) 38%, var(--surf-3) 56%, var(--surf-3) 100%)",
				animation: `shimmer 1.8s ease-in-out ${delay}ms infinite`,
			}}
		/>
	</span>
);

const GhostParagraph = ({ lines, baseDelay = 0 }: { lines: string[]; baseDelay?: number }) => (
	<div className="space-y-[7px]">
		{lines.map((w, i) => (
			<Bone key={i} w={w} h={14} delay={baseDelay + i * 40} />
		))}
	</div>
);

const PARAGRAPHS: string[][] = [
	["96%", "100%", "88%", "100%", "72%"],
	["100%", "93%", "100%", "61%"],
	["84%", "100%", "97%", "100%", "55%"],
	["100%", "91%", "78%"],
	["92%", "100%", "85%", "100%", "67%"],
];

const TopbarSkeleton = () => (
	<header
		aria-hidden="true"
		className="flex h-[46px] shrink-0 items-center gap-2 border-b-[0.5px] border-bd-1 bg-surf px-4"
	>
		<div className="flex shrink-0 items-center gap-1.5">
			<Bone w={10} h={10} delay={0} />
			<Bone w={48} h={10} delay={20} className="max-md:hidden" />
		</div>

		<Bone w={1} h={16} delay={0} className="max-md:hidden" style={{ borderRadius: 0 }} />

		<div className="min-w-0 flex-1 space-y-[5px]">
			<Bone w="38%" h={11} delay={60} style={{ minWidth: 80, maxWidth: 220 }} />
			<Bone w="26%" h={8} delay={80} className="max-md:hidden" style={{ minWidth: 60, maxWidth: 160, opacity: 0.6 }} />
		</div>

		<div className="flex shrink-0 items-center gap-1">
			<Bone w={28} h={28} delay={0} rounded={6} />
			<Bone w={42} h={10} delay={30} />
			<Bone w={28} h={28} delay={0} rounded={6} />
		</div>

		<Bone w={1} h={16} delay={0} style={{ borderRadius: 0 }} />

		<div className="flex shrink-0 items-center gap-1">
			{Array.from({ length: 8 }).map((_, i) => (
				<Bone key={i} w={30} h={30} delay={i * 40} rounded={6} className="hidden md:block" />
			))}
			{Array.from({ length: 3 }).map((_, i) => (
				<Bone key={`m${i}`} w={30} h={30} delay={i * 40} rounded={6} className="md:hidden" />
			))}
		</div>
	</header>
);

const ArticleSkeleton = () => (
	<article
		aria-hidden="true"
		aria-busy="true"
		className="relative flex-1 overflow-y-auto px-6 pt-8 pb-15 max-md:px-4 max-md:pt-5"
	>
		<div
			className="absolute inset-x-0 top-0 h-[3px] overflow-hidden"
			style={{ borderRadius: 0 }}
		>
			<Bone w="100%" h={3} delay={0} rounded={0} />
		</div>

		<div className="mx-auto max-w-[680px]">
			<header className="mb-8">
				<div className="mb-3 flex flex-wrap items-center gap-x-2 gap-y-1">
					<Bone w={16} h={8} delay={0} />
					<Bone w={28} h={8} delay={30} />
					<Bone w={36} h={8} delay={60} />
					<Bone w={44} h={8} delay={90} />
				</div>

				<div className="mb-4 h-px w-full bg-bd-2" />

				<Bone w="72%" h={28} delay={100} style={{ marginBottom: 8, maxWidth: 480 }} />
				<Bone w="48%" h={18} delay={130} style={{ marginBottom: 16, maxWidth: 320, opacity: 0.7 }} />

				<div className="flex items-center gap-3">
					<Bone w={90} h={10} delay={150} />
					<Bone w={1} h={12} delay={0} rounded={0} />
					<Bone w={130} h={10} delay={170} />
				</div>
			</header>

			<div className="space-y-7">
				{PARAGRAPHS.map((lines, pi) => (
					<GhostParagraph key={pi} lines={lines} baseDelay={200 + pi * 80} />
				))}
			</div>
		</div>
	</article>
);

export const ReaderPageSkeleton = () => (
	<div className="flex h-full flex-col overflow-hidden">
		<TopbarSkeleton />
		<div className="grid min-h-0 flex-1 overflow-hidden bg-surf md:grid-cols-[1fr_0px]">
			<div className="flex min-h-0 min-w-0 flex-col overflow-hidden">
				<ArticleSkeleton />
			</div>
		</div>
	</div>
);
