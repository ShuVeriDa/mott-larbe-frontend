import type { CSSProperties } from "react";

const TextLine = ({
	width,
	height = 14,
	delay = 0,
	style,
}: {
	width: string;
	height?: number;
	delay?: number;
	style?: CSSProperties;
}) => (
	<span
		aria-hidden="true"
		className="block overflow-hidden rounded-[2px]"
		style={{ width, height, ...style }}
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
			<TextLine key={i} width={w} delay={baseDelay + i * 40} />
		))}
	</div>
);

const PARAGRAPHS: string[][] = [
	["96%", "100%", "88%", "100%", "72%"],
	["100%", "93%", "100%", "61%"],
	["84%", "100%", "97%", "100%", "55%"],
	["100%", "91%", "78%"],
];

const ReaderPageLoading = () => (
	<>
		<style>{`@keyframes shimmer{0%{transform:translateX(-50%)}100%{transform:translateX(0%)}}`}</style>

		{/* Topbar */}
		<header
			className="flex h-[46px] shrink-0 items-center gap-2 border-b-[0.5px] border-bd-1 bg-surf px-4"
			aria-hidden="true"
		>
			<TextLine width="72px" height={10} delay={0} />
			<span className="h-4 w-px shrink-0 bg-bd-2 max-md:hidden" />
			<div className="min-w-0 flex-1 space-y-[6px]">
				<TextLine width="140px" height={10} delay={60} />
				<TextLine width="200px" height={8} delay={80} style={{ opacity: 0.6 }} />
			</div>
			<div className="flex shrink-0 items-center gap-1">
				<TextLine width="28px" height={28} delay={0} style={{ borderRadius: 6 }} />
				<TextLine width="40px" height={8} delay={40} />
				<TextLine width="28px" height={28} delay={0} style={{ borderRadius: 6 }} />
			</div>
			<span className="h-4 w-px shrink-0 bg-bd-2" />
			<div className="flex shrink-0 items-center gap-1">
				{Array.from({ length: 8 }).map((_, i) => (
					<TextLine key={i} width="30px" height={30} delay={i * 55} style={{ borderRadius: 6 }} />
				))}
			</div>
		</header>

		{/* Article */}
		<article
			className="flex-1 overflow-y-auto px-6 pt-8 pb-15 max-md:pt-4"
			aria-hidden="true"
			aria-busy="true"
		>
			<div className="mx-auto max-w-[680px]">
				{/* Editorial header */}
				<div className="mb-8">
					<div className="mb-3 flex items-center gap-2">
						<TextLine width="24px" height={8} delay={0} />
						<TextLine width="28px" height={8} delay={30} />
						<TextLine width="40px" height={8} delay={60} />
					</div>
					<div className="mb-4 h-px w-full bg-bd-2" />
					<TextLine width="78%" height={28} delay={80} style={{ marginBottom: 6 }} />
					<TextLine width="52%" height={16} delay={120} style={{ marginBottom: 12, opacity: 0.7 }} />
					<div className="flex items-center gap-3">
						<TextLine width="80px" height={10} delay={140} />
						<span className="h-3 w-px bg-bd-2" />
						<TextLine width="120px" height={10} delay={160} />
					</div>
				</div>

				{/* Paragraphs */}
				<div className="space-y-7">
					{PARAGRAPHS.map((lines, pi) => (
						<GhostParagraph key={pi} lines={lines} baseDelay={pi * 100} />
					))}
				</div>
			</div>
		</article>
	</>
);

export default ReaderPageLoading;
