"use client";

import { Typography } from "@/shared/ui/typography";
import type { TextPageResponse } from "@/entities/text";
import { useI18n } from "@/shared/lib/i18n";
import { duration, ease } from "@/shared/lib/animation";
import { motion } from "framer-motion";

export interface ArticleProgressBarProps {
	progress: number;
}

export const ArticleProgressBar = ({ progress }: ArticleProgressBarProps) => {
	const value = Math.max(0, Math.min(100, Math.round(progress)));
	return (
		<div
			role="progressbar"
			aria-valuenow={value}
			aria-valuemin={0}
			aria-valuemax={100}
			className="mb-3 h-[3px] w-full overflow-hidden rounded-full bg-bd-1"
		>
			<div
				className="h-full rounded-full bg-acc/50 transition-[width] duration-500 ease-out motion-reduce:transition-none"
				style={{ width: `${value}%` }}
			/>
		</div>
	);
};

export interface ArticleHeaderProps {
	data: TextPageResponse;
	currentPage: number;
	showProgress?: boolean;
}

const headerVariants = {
	hidden: {},
	visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
} as const;

const itemVariants = {
	hidden: { opacity: 0, y: 8 },
	visible: { opacity: 1, y: 0, transition: { duration: duration.slow, ease: ease.enter } },
} as const;

export const ArticleHeader = ({ data, currentPage, showProgress = false }: ArticleHeaderProps) => {
	const { t } = useI18n();

	const level = data.level ?? null;
	const lang = t(`shared.lang.${data.language}`);
	const tagNames = data.tags?.map(tag => tag.name) ?? [];

	// Editorial meta line: LEVEL · LANG · #tag · #tag
	const metaTokens = [
		level,
		lang,
		...tagNames.map(n => `#${n}`),
	].filter(Boolean);

	return (
		<motion.header
			className="mb-8"
			dir="ltr"
			variants={headerVariants}
			initial="hidden"
			animate="visible"
		>
			{showProgress && <ArticleProgressBar progress={data.progress} />}

			{/* Meta line — editorial caption style */}
			{metaTokens.length > 0 && (
				<motion.div
					variants={itemVariants}
					className="mb-3 flex flex-wrap items-center gap-x-2 gap-y-1"
				>
					{metaTokens.map((token, i) => (
						<span key={i} className="flex items-center gap-x-2">
							<Typography
								tag="span"
								className="font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-t-3"
							>
								{token}
							</Typography>
							{i < metaTokens.length - 1 && (
								<span className="text-[10px] text-t-4" aria-hidden="true">·</span>
							)}
						</span>
					))}
				</motion.div>
			)}

			{/* Rule above title */}
			<motion.div variants={itemVariants} className="mb-4 h-px w-full bg-bd-2" />

			{/* Book title */}
			<motion.div variants={itemVariants}>
				<Typography
					tag="h1"
					className="mb-1 font-display text-[clamp(1.5rem,3vw,2rem)] font-medium leading-[1.25] tracking-[-0.3px] text-t-1"
				>
					{data.title}
				</Typography>
			</motion.div>

			{/* Chapter / page title — italic */}
			<motion.div variants={itemVariants}>
				{data.page.title ? (
					<Typography
						tag="h2"
						className="mb-3 font-display text-[clamp(0.95rem,2vw,1.15rem)] font-normal italic leading-snug text-t-2"
					>
						{data.page.title}
					</Typography>
				) : (
					<div className="mb-3" />
				)}
			</motion.div>

			{/* Byline — author · wordcount · page */}
			<motion.div
				variants={itemVariants}
				className="flex flex-wrap items-center gap-x-3 gap-y-0.5"
			>
				{data.author && (
					<Typography tag="span" className="text-[12px] text-t-2">
						{data.author}
					</Typography>
				)}
				{data.author && (
					<span className="h-3 w-px bg-bd-2" aria-hidden="true" />
				)}
				<Typography tag="span" className="text-[12px] tabular-nums text-t-3">
					{t("reader.body.byline", {
						count: data.wordCount,
						current: currentPage,
						total: data.totalPages,
					})}
				</Typography>
			</motion.div>
		</motion.header>
	);
};
