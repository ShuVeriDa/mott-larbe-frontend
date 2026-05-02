"use client";

import { useI18n } from "@/shared/lib/i18n";

interface TextsBulkBarProps {
	selectedCount: number;
	onPublish: () => void;
	onTokenize: () => void;
	onDelete: () => void;
	isPending: boolean;
}

export const TextsBulkBar = ({
	selectedCount,
	onPublish,
	onTokenize,
	onDelete,
	isPending,
}: TextsBulkBarProps) => {
	const { t } = useI18n();

	if (selectedCount === 0) return null;

	return (
		<div className="flex flex-wrap items-center gap-2.5 border-b border-bd-1 bg-acc-bg px-3.5 py-2">
			<span className="shrink-0 text-[12.5px] font-medium text-acc-t">
				{t("admin.texts.bulk.selected", { count: selectedCount })}
			</span>
			<div className="ml-auto flex flex-wrap gap-1.5">
				<button
					type="button"
					onClick={onPublish}
					disabled={isPending}
					className="h-[26px] cursor-pointer rounded-md border border-acc/25 bg-transparent px-2.5 text-[11.5px] font-medium text-acc-t transition-colors hover:bg-acc/10 disabled:opacity-50"
				>
					{t("admin.texts.bulk.publish")}
				</button>
				<button
					type="button"
					onClick={onTokenize}
					disabled={isPending}
					className="h-[26px] cursor-pointer rounded-md border border-acc/25 bg-transparent px-2.5 text-[11.5px] font-medium text-acc-t transition-colors hover:bg-acc/10 disabled:opacity-50"
				>
					{t("admin.texts.bulk.tokenize")}
				</button>
				<button
					type="button"
					onClick={onDelete}
					disabled={isPending}
					className="h-[26px] cursor-pointer rounded-md border border-red/25 bg-transparent px-2.5 text-[11.5px] font-medium text-red-t transition-colors hover:bg-red/10 disabled:opacity-50"
				>
					{t("admin.texts.bulk.delete")}
				</button>
			</div>
		</div>
	);
};
