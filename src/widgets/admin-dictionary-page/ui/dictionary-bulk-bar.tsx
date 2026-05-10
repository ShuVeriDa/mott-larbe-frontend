import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { Download, Trash2, X } from "lucide-react";
interface DictionaryBulkBarProps {
	count: number;
	isDeleting: boolean;
	onDelete: () => void;
	onExport: () => void;
	onClear: () => void;
	t: (key: string, vars?: Record<string, string | number>) => string;
}

export const DictionaryBulkBar = ({
	count,
	isDeleting,
	onDelete,
	onExport,
	onClear,
	t,
}: DictionaryBulkBarProps) => (
	<div className="mb-3.5 flex items-center gap-2 rounded-[9px] border border-acc/30 bg-acc-bg px-3.5 py-2.5">
		<Typography tag="span" className="text-[12.5px] font-medium text-acc-t">
			{t("admin.dictionary.bulk.selected", { count })}
		</Typography>
		<div className="ml-auto flex items-center gap-1.5">
			<Button
				onClick={onExport}
				className="flex h-[26px] cursor-pointer items-center gap-1 rounded-[6px] border border-bd-2 bg-surf px-2.5 text-[12px] text-t-2 transition-colors hover:border-bd-3 hover:text-t-1"
			>
				<Download className="size-[11px]" />
				{t("admin.dictionary.bulk.export")}
			</Button>
			<Button
				onClick={onDelete}
				disabled={isDeleting}
				className="flex h-[26px] cursor-pointer items-center gap-1 rounded-[6px] bg-red-500 px-2.5 text-[12px] font-medium text-white transition-opacity hover:opacity-[.88] disabled:opacity-50"
			>
				<Trash2 className="size-[11px]" />
				{t("admin.dictionary.bulk.delete")}
			</Button>
			<Button
				onClick={onClear}
				className="flex size-[26px] cursor-pointer items-center justify-center rounded-[6px] border border-bd-2 bg-surf text-t-3 transition-colors hover:border-bd-3 hover:text-t-1"
			>
				<X className="size-3" />
			</Button>
		</div>
	</div>
);
