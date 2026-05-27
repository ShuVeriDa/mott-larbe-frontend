"use client";
import type { TopWordsData } from "@/entities/statistics";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import { useState } from "react";

interface TopWordsCardProps {
	data: TopWordsData;
}

type Tab = "hardest" | "mastered";

export const TopWordsCard = ({ data }: TopWordsCardProps) => {
	const { t } = useI18n();
	const [tab, setTab] = useState<Tab>("hardest");

	const handleTabHardest = () => setTab("hardest");
	const handleTabMastered = () => setTab("mastered");

	const isHardest = tab === "hardest";
	const isEmpty = isHardest
		? data.hardest.length === 0
		: data.recentlyMastered.length === 0;

	return (
		<section className="rounded-card border-[0.5px] border-bd-1 bg-surf p-4 transition-colors">
			<header className="mb-3 gap-1 flex items-center justify-between">
				<div className="flex items-center gap-0.5 rounded-base bg-surf-2 p-0.5">
					<button
						onClick={handleTabHardest}
						className={`rounded-[5px] px-2.5 py-1 text-[11px] font-medium transition-colors ${
							isHardest
								? "bg-surf text-t-1 shadow-sm"
								: "text-t-3 hover:text-t-2"
						}`}
					>
						{t("statistics.topWords.hardest")}
					</button>
					<button
						onClick={handleTabMastered}
						className={`rounded-[5px] px-2.5 py-1 text-[11px] font-medium transition-colors ${
							!isHardest
								? "bg-surf text-t-1 shadow-sm"
								: "text-t-3 hover:text-t-2"
						}`}
					>
						{t("statistics.topWords.mastered")}
					</button>
				</div>
			</header>

			{isEmpty ? (
				<div className="flex h-20 items-center justify-center text-[11px] text-t-3">
					{t("statistics.topWords.empty")}
				</div>
			) : isHardest ? (
				<div className="flex flex-col gap-1.5">
					{data.hardest.map((w, i) => (
						<div key={i} className="flex items-center gap-2">
							<Typography
								tag="span"
								className="w-4 shrink-0 text-[10px] text-t-3"
							>
								{i + 1}.
							</Typography>
							<div className="min-w-0 flex-1">
								<Typography
									tag="span"
									className="block truncate text-[12px] font-semibold text-t-1"
								>
									{w.word}
								</Typography>
								<Typography
									tag="span"
									className="block truncate text-[10.5px] text-t-3"
								>
									{w.translation}
								</Typography>
							</div>
							<div className="shrink-0 rounded-md bg-red/10 px-1.5 py-0.5">
								<Typography
									tag="span"
									className="text-[10px] font-semibold text-red"
								>
									{w.wrongCount}✗
								</Typography>
							</div>
						</div>
					))}
				</div>
			) : (
				<div className="flex flex-col gap-1.5">
					{data.recentlyMastered.map((w, i) => (
						<div key={i} className="flex items-center gap-2">
							<Typography
								tag="span"
								className="w-4 shrink-0 text-[10px] text-t-3"
							>
								{i + 1}.
							</Typography>
							<div className="min-w-0 flex-1">
								<Typography
									tag="span"
									className="block truncate text-[12px] font-semibold text-t-1"
								>
									{w.word}
								</Typography>
								<Typography
									tag="span"
									className="block truncate text-[10.5px] text-t-3"
								>
									{w.translation}
								</Typography>
							</div>
							<span className="shrink-0 text-[13px]" aria-hidden="true">
								✅
							</span>
						</div>
					))}
				</div>
			)}
		</section>
	);
};
