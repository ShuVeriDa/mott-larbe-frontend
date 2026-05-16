"use client";

import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import type { TokenOccurrence } from "../api/types";
import { TokenOccurrenceItem } from "./token-occurrence-item";

interface OccurrencesSectionProps {
	occurrences: TokenOccurrence[];
	isLoadingOccurrences: boolean;
	deselected: Set<string>;
	allChecked: boolean;
	someChecked: boolean;
	onToggleOccurrence: (tokenId: string) => void;
	onToggleAll: () => void;
}

export const OccurrencesSection = ({
	occurrences,
	isLoadingOccurrences,
	deselected,
	allChecked,
	someChecked,
	onToggleOccurrence,
	onToggleAll,
}: OccurrencesSectionProps) => {
	const { t } = useI18n();

	return (
		<div className="border-t border-hairline border-bd-1">
			<div className="flex items-center justify-between px-5 py-2">
				<span className="text-[11.5px] font-medium text-t-2">
					{isLoadingOccurrences
						? t("admin.texts.editPage.wordAnnotation.occurrencesLoading")
						: t("admin.texts.editPage.wordAnnotation.occurrences", {
								count: String(occurrences.length),
							})}
				</span>
				{occurrences.length > 1 && (
					<Button
						size="bare"
						onClick={onToggleAll}
						className="text-[11px] text-acc hover:underline"
					>
						{allChecked || someChecked
							? t("admin.texts.editPage.wordAnnotation.deselectAll")
							: t("admin.texts.editPage.wordAnnotation.selectAll")}
					</Button>
				)}
			</div>

			{isLoadingOccurrences ? (
				<div className="flex items-center justify-center py-4">
					<div className="size-4 animate-spin rounded-full border-2 border-surf-3 border-t-acc" />
				</div>
			) : occurrences.length === 0 ? (
				<div className="px-5 pb-3 text-[12px] text-t-3">
					{t("admin.texts.editPage.wordAnnotation.noOccurrences")}
				</div>
			) : (
				<div className="max-h-[180px] overflow-y-auto pb-1">
					{occurrences.map(occ => (
						<TokenOccurrenceItem
							key={occ.tokenId}
							occurrence={occ}
							checked={!deselected.has(occ.tokenId)}
							onToggle={onToggleOccurrence}
						/>
					))}
				</div>
			)}
		</div>
	);
};
