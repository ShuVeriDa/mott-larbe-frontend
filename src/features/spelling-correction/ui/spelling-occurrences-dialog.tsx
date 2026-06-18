"use client";

import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/shared/ui/dialog";
import { useI18n } from "@/shared/lib/i18n";
import type { SpellingOccurrencesDialogState } from "../model/types";
import { SpellingOccurrenceItem } from "./spelling-occurrence-item";
import { parseCorrectForm } from "@/entities/spelling-dictionary";

interface SpellingOccurrencesDialogProps {
	dialog: SpellingOccurrencesDialogState;
	deselected: Set<number>;
	selectedCount: number;
	allChecked: boolean;
	someChecked: boolean;
	onToggle: (index: number) => void;
	onToggleAll: () => void;
	onApply: () => void;
	onClose: () => void;
}

export const SpellingOccurrencesDialog = ({
	dialog,
	deselected,
	selectedCount,
	allChecked,
	someChecked,
	onToggle,
	onToggleAll,
	onApply,
	onClose,
}: SpellingOccurrencesDialogProps) => {
	const { t } = useI18n();

	const handleOpenChange = (open: boolean) => {
		if (!open) onClose();
	};

	return (
		<Dialog open={dialog.isOpen} onOpenChange={handleOpenChange}>
			<DialogContent aria-describedby={undefined} className="max-w-lg gap-0 p-0">
				<DialogHeader className="px-5 pt-5 pb-4">
					<DialogTitle>{t("admin.spellingDictionary.occurrences.title")}</DialogTitle>
				</DialogHeader>

				{/* word pair header */}
				<div className="flex items-center gap-2 border-t border-bd-1 px-5 py-3">
					<span className="rounded-[5px] bg-rose-100 px-2 py-0.5 font-mono text-[12px] text-rose-700 line-through select-none">
						{dialog.wrongForm}
					</span>
					<span className="text-sm text-t-4">→</span>
					<span className="rounded-[5px] bg-green-100 px-2 py-0.5 font-mono text-[12px] font-medium text-green-700 select-none">
						{parseCorrectForm(dialog.correctForm).map((node, i) =>
							node.superscript ? <sup key={i}>{node.text}</sup> : <span key={i}>{node.text}</span>
						)}
					</span>
				</div>

				{/* occurrences list */}
				<div className="border-t border-bd-1">
					<div className="flex items-center justify-between px-4 py-2">
						<Typography tag="span" className="text-[11.5px] font-medium text-t-2">
							{dialog.occurrences.length === 0
								? t("admin.spellingDictionary.occurrences.noOccurrences")
								: t("admin.spellingDictionary.occurrences.count", { count: dialog.occurrences.length })}
						</Typography>
						{dialog.occurrences.length > 1 && (
							<Button
								size="bare"
								onClick={onToggleAll}
								className="text-[11px] text-acc hover:underline"
							>
								{allChecked || someChecked
									? t("admin.spellingDictionary.occurrences.deselectAll")
									: t("admin.spellingDictionary.occurrences.selectAll")}
							</Button>
						)}
					</div>

					{dialog.occurrences.length === 0 ? (
						<div className="px-5 pb-4 text-[12px] text-t-3">
							{t("admin.spellingDictionary.occurrences.notFound")}
						</div>
					) : (
						<div className="max-h-[260px] overflow-y-auto pb-1">
							{dialog.occurrences.map(occ => (
								<SpellingOccurrenceItem
									key={occ.index}
									occurrence={occ}
									checked={!deselected.has(occ.index)}
									onToggle={onToggle}
								/>
							))}
						</div>
					)}
				</div>

				{/* footer */}
				<div className="flex gap-2 border-t border-bd-1 px-5 py-4">
					<Button
						size="bare"
						onClick={onClose}
						className="flex h-[34px] flex-1 items-center justify-center rounded-base border border-bd-2 bg-surf-2 text-[13px] font-medium text-t-1 transition-colors hover:border-bd-3 hover:bg-surf-3"
					>
						{t("admin.spellingDictionary.occurrences.cancel")}
					</Button>
					<Button
						size="bare"
						disabled={selectedCount === 0}
						onClick={onApply}
						className="flex h-[34px] flex-1 items-center justify-center rounded-base bg-acc text-[13px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
					>
						{selectedCount > 0
							? t("admin.spellingDictionary.occurrences.applyCount", { count: selectedCount })
							: t("admin.spellingDictionary.occurrences.apply")}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};
