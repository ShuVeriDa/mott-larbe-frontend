"use client";

import { Typography } from "@/shared/ui/typography";

import { Button } from "@/shared/ui/button";

import { useI18n } from "@/shared/lib/i18n";
import { ArrowRight, Trash2 } from "lucide-react";

interface UnknownWordsTopbarProps {
	onExport: () => void;
	onClearAll: () => void;
}

export const UnknownWordsTopbar = ({
	onExport,
	onClearAll,
}: UnknownWordsTopbarProps) => {
	const { t } = useI18n();

	return (
		<header className=" flex items-center gap-2.5 border-b border-bd-1 bg-surf px-[18px] py-3 transition-colors">
			<div>
				<div className="font-display text-[16px] text-t-1">
					{t("admin.unknownWords.title")}
				</div>
				<div className="mt-px text-[12px] text-t-3">
					{t("admin.unknownWords.subtitle")}
				</div>
			</div>
			<div className="ml-auto flex items-center gap-2">
				<Button
					onClick={onExport}
					className="flex h-[30px] cursor-pointer items-center gap-1.5 rounded-base border border-bd-2 bg-transparent px-2.5 text-[12px] font-medium text-t-2 transition-colors hover:border-bd-3 hover:text-t-1"
				>
					<ArrowRight className="size-3" />
					<Typography tag="span" className="max-sm:hidden">
						{t("admin.unknownWords.export")}
					</Typography>
				</Button>
				<Button
					onClick={onClearAll}
					className="flex h-[30px] cursor-pointer items-center gap-1.5 rounded-base border border-bd-2 bg-transparent px-2.5 text-[12px] font-medium text-red-t transition-colors hover:border-red/30 hover:bg-red-bg"
				>
					<Trash2 className="size-3" />
					<Typography tag="span" className="max-sm:hidden">
						{t("admin.unknownWords.clearAll")}
					</Typography>
				</Button>
			</div>
		</header>
	);
};
