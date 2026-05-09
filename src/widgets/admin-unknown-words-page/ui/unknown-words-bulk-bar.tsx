"use client";

import { Typography } from "@/shared/ui/typography";

import { Button } from "@/shared/ui/button";

import { useI18n } from "@/shared/lib/i18n";

interface UnknownWordsBulkBarProps {
	selectedCount: number;
	onAddToDictionary: () => void;
	onDelete: () => void;
	isPending: boolean;
}

export const UnknownWordsBulkBar = ({
	selectedCount,
	onAddToDictionary,
	onDelete,
	isPending,
}: UnknownWordsBulkBarProps) => {
	const { t } = useI18n();

	if (selectedCount === 0) return null;

	return (
		<div className="flex flex-wrap items-center gap-2.5 border-b border-bd-1 bg-acc-bg px-3.5 py-2">
			<Typography tag="span" className="shrink-0 text-[12.5px] font-medium text-acc-t">
				{t("admin.unknownWords.bulk.selected", { count: selectedCount })}
			</Typography>
			<div className="ml-auto flex flex-wrap gap-1.5">
				<Button
					onClick={onAddToDictionary}
					disabled={isPending}
					className="h-[26px] cursor-pointer rounded-md border border-acc/25 bg-transparent px-2.5 text-[11.5px] font-medium text-acc-t transition-colors hover:bg-acc/10 disabled:opacity-50"
				>
					{t("admin.unknownWords.bulk.addToDictionary")}
				</Button>
				<Button
					onClick={onDelete}
					disabled={isPending}
					className="h-[26px] cursor-pointer rounded-md border border-red/25 bg-transparent px-2.5 text-[11.5px] font-medium text-red-t transition-colors hover:bg-red/10 disabled:opacity-50"
				>
					{t("admin.unknownWords.bulk.delete")}
				</Button>
			</div>
		</div>
	);
};
