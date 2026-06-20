"use client";

import type { ChangeEvent } from "react";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import type { Nation } from "@/entities/heritage";
import type { NationMode } from "../model/types";

interface NationSelectorProps {
	nations: Nation[];
	nakhchiyNation: Nation | undefined;
	otherNations: Nation[];
	nationMode: NationMode;
	otherNationId: string | null;
	onNationSelect: (slug: string | null) => void;
	onOtherNationSelect: (id: string | null) => void;
	lang: string;
}

interface NationCardProps {
	label: string;
	description?: string;
	isSelected: boolean;
	onClick: () => void;
}

const NationCard = ({ label, description, isSelected, onClick }: NationCardProps) => (
	<button
		type="button"
		onClick={onClick}
		className={cn(
			"relative flex flex-col gap-1 w-full rounded-[10px] border px-4 py-3 text-left",
			"transition-all duration-150 ease-out",
			"hover:border-acc/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acc/40",
			"min-h-[44px]",
			isSelected
				? "border-acc bg-acc/5 text-acc"
				: "border-bd-2 bg-surf-2 text-t-1",
		)}
		aria-pressed={isSelected}
	>
		<span className="text-[13px] font-semibold leading-tight">{label}</span>
		{description && (
			<span className={cn("text-[11px] leading-tight", isSelected ? "text-acc/70" : "text-t-3")}>
				{description}
			</span>
		)}
		{isSelected && (
			<span className="absolute right-3 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-acc" aria-hidden="true" />
		)}
	</button>
);

export const NationSelector = ({
	nakhchiyNation,
	otherNations,
	nationMode,
	otherNationId,
	onNationSelect,
	onOtherNationSelect,
	lang,
}: NationSelectorProps) => {
	const { t } = useI18n();

	const getLocalizedName = (nation: Nation) =>
		(nation.name as Record<string, string>)[lang] ?? nation.name.ru;

	const handleNakhchiyClick = () => onNationSelect("nakhchiy");
	const handleOtherClick = () => onNationSelect("other");
	const handleOtherNationChange = (e: ChangeEvent<HTMLSelectElement>) =>
		onOtherNationSelect(e.currentTarget.value || null);

	return (
		<div className="flex flex-col gap-2">
			<div className="grid grid-cols-2 gap-2 max-sm:grid-cols-1">
				<NationCard
					label={t("heritage.nation_nakhchiy")}
					isSelected={nationMode === "nakhchiy"}
					onClick={handleNakhchiyClick}
				/>
				<NationCard
					label={t("heritage.nation_other")}
					isSelected={nationMode === "other"}
					onClick={handleOtherClick}
				/>
			</div>

			{nationMode === "other" && otherNations.length > 0 && (
				<select
					className={cn(
						"w-full h-[38px] rounded-[8px] border border-bd-2 bg-surf-2",
						"px-3 text-[13px] text-t-1 outline-none cursor-pointer",
						"transition-colors duration-150 focus:border-acc",
						"disabled:opacity-40 disabled:cursor-not-allowed",
					)}
					value={otherNationId ?? ""}
					onChange={handleOtherNationChange}
					aria-label={t("heritage.nation")}
				>
					<option value="">{t("heritage.nation_select_placeholder")}</option>
					{otherNations.map((nation) => (
						<option key={nation.id} value={nation.id}>
							{getLocalizedName(nation)}
						</option>
					))}
				</select>
			)}
		</div>
	);
};
