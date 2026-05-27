"use client";
import type { WeakSpotsData } from "@/entities/statistics";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import { useState } from "react";

interface WeakSpotsCardProps {
	data: WeakSpotsData;
	lang: string;
}

type Tab = "texts" | "words" | "accuracy";

export const WeakSpotsCard = ({ data, lang }: WeakSpotsCardProps) => {
	const { t } = useI18n();
	const [tab, setTab] = useState<Tab>("texts");

	const handleTabTexts = () => setTab("texts");
	const handleTabWords = () => setTab("words");
	const handleTabAccuracy = () => setTab("accuracy");

	const hasTexts = data.abandonedTexts.length > 0;
	const hasWords = data.strugglingWords.length > 0;
	const hasAccuracy = data.lowAccuracy.length > 0;
	const isEmpty =
		tab === "texts" ? !hasTexts : tab === "words" ? !hasWords : !hasAccuracy;

	const formatDate = (iso: string | null) => {
		if (!iso) return "";
		const d = new Date(iso);
		return `${d.getUTCDate()}.${String(d.getUTCMonth() + 1).padStart(2, "0")}.${d.getUTCFullYear()}`;
	};

	return (
		<section className="rounded-card border-[0.5px] border-bd-1 bg-surf p-4 transition-colors">
			<header className="mb-3 gap-1 flex items-center justify-between">
				<Typography tag="span" className="text-[12.5px] font-semibold text-t-1">
					{t("statistics.weakSpots.title")}
				</Typography>
			</header>

			{/* Tabs */}
			<div className="mb-3 flex items-center gap-0.5 rounded-base bg-surf-2 p-0.5 w-fit">
				{(["texts", "words", "accuracy"] as Tab[]).map(tabKey => (
					<button
						key={tabKey}
						onClick={
							tabKey === "texts"
								? handleTabTexts
								: tabKey === "words"
									? handleTabWords
									: handleTabAccuracy
						}
						className={cn(
							"rounded-[5px] px-2.5 py-1 text-[11px] font-medium transition-colors",
							tab === tabKey
								? "bg-surf text-t-1 shadow-sm"
								: "text-t-3 hover:text-t-2",
						)}
					>
						{t(
							`statistics.weakSpots.tab${tabKey.charAt(0).toUpperCase()}${tabKey.slice(1)}`,
						)}
					</button>
				))}
			</div>

			{isEmpty ? (
				<div className="flex h-20 items-center justify-center text-center text-[11px] text-grn">
					{t("statistics.weakSpots.allGood")}
				</div>
			) : tab === "texts" ? (
				<div className="flex flex-col gap-2">
					{data.abandonedTexts.map(text => (
						<a
							key={text.id}
							href={`/${lang}/texts/${text.id}`}
							className="flex items-center gap-2.5 rounded-lg border-[0.5px] border-bd-1 bg-surf-2 px-2.5 py-2 transition-colors hover:border-bd-2 hover:bg-surf-3"
						>
							<div className="min-w-0 flex-1">
								<Typography
									tag="p"
									className="truncate text-[11.5px] font-medium text-t-1"
								>
									{text.title}
								</Typography>
								<Typography tag="p" className="text-[10px] text-t-3">
									{text.level && <span className="mr-1.5">{text.level}</span>}
									{t("statistics.weakSpots.lastOpened")}{" "}
									{formatDate(text.lastOpened)}
								</Typography>
							</div>
							<div className="shrink-0 text-right">
								<Typography
									tag="p"
									className="text-[11px] font-semibold text-amb-t"
								>
									{text.progressPercent}%
								</Typography>
							</div>
						</a>
					))}
				</div>
			) : tab === "words" ? (
				<div className="flex flex-col gap-1.5">
					{data.strugglingWords.map((w, i) => (
						<div key={i} className="flex items-center gap-2">
							<div className="min-w-0 flex-1">
								<Typography
									tag="span"
									className="text-[12px] font-semibold text-t-1"
								>
									{w.word}
								</Typography>
								<Typography
									tag="span"
									className="ml-1.5 text-[10.5px] text-t-3"
								>
									{w.translation}
								</Typography>
							</div>
							<Typography tag="span" className="shrink-0 text-[10px] text-t-3">
								{t("statistics.weakSpots.notReviewed", {
									days: Math.floor(
										(Date.now() - new Date(w.updatedAt).getTime()) / 86400000,
									),
								})}
							</Typography>
						</div>
					))}
				</div>
			) : (
				<div className="flex flex-col gap-1.5">
					{data.lowAccuracy.map((w, i) => (
						<div key={i} className="flex items-center gap-2">
							<div className="min-w-0 flex-1">
								<Typography
									tag="span"
									className="text-[12px] font-semibold text-t-1"
								>
									{w.word}
								</Typography>
								<Typography
									tag="span"
									className="ml-1.5 text-[10.5px] text-t-3"
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
			)}
		</section>
	);
};
