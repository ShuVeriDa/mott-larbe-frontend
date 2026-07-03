"use client";

import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
import { TableCell, TableRow } from "@/shared/ui/table";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/shared/ui/tooltip";
import Link from "next/link";
import { type ComponentProps, useState } from "react";
import type { SpellingOccurrence } from "../api/types";

interface SpellingOccurrenceItemProps {
	occurrence: SpellingOccurrence;
	lang: string;
	isSelected: boolean;
	canBulkFix: boolean;
	onToggleSelect: (tokenId: string) => void;
	onFixOne: (tokenId: string) => Promise<void>;
}

export const SpellingOccurrenceItem = ({
	occurrence,
	lang,
	isSelected,
	canBulkFix,
	onToggleSelect,
	onFixOne,
}: SpellingOccurrenceItemProps) => {
	const { t } = useI18n();
	const [isFixingOne, setIsFixingOne] = useState(false);

	const handleToggle = () => onToggleSelect(occurrence.tokenId);

	const handleFixClick = async () => {
		setIsFixingOne(true);
		try {
			await onFixOne(occurrence.tokenId);
		} finally {
			setIsFixingOne(false);
		}
	};

	const handleTextLinkClick: NonNullable<ComponentProps<"a">["onClick"]> = e =>
		e.stopPropagation();

	return (
		<TableRow className="border-b border-bd-1 transition-colors last:border-b-0 hover:bg-surf-2">
			<TableCell className="px-2.5 py-[10px] pl-3.5">
				<Checkbox
					checked={isSelected}
					onCheckedChange={handleToggle}
					disabled={!canBulkFix}
					aria-label={t("admin.spellingDictionaryDetail.selectRow")}
				/>
			</TableCell>
			<TableCell className="px-2.5 py-[10px]">
				<p className="text-[12.5px] leading-[1.55] text-t-2 [&_b]:font-semibold [&_b]:text-t-1">
					{occurrence.before}
					<b>{occurrence.match}</b>
					{occurrence.after}
				</p>
				<Link
					href={`/${lang}/texts/${occurrence.textId}`}
					onClick={handleTextLinkClick}
					className="mt-1 inline-block text-[11.5px] text-acc-t hover:underline"
				>
					{occurrence.textTitle} ·{" "}
					{t("admin.spellingDictionaryDetail.page", {
						page: occurrence.pageNumber,
					})}
				</Link>
			</TableCell>
			<TableCell className="px-2.5 py-[10px] pr-3.5">
				<div className="flex items-center justify-end gap-1.5">
					{canBulkFix && (
						<Button
							variant="outline"
							size="bare"
							onClick={handleFixClick}
							disabled={isFixingOne}
							className="h-7 px-2.5 text-[11.5px]"
						>
							{isFixingOne
								? t("admin.spellingDictionaryDetail.fixing")
								: t("admin.spellingDictionaryDetail.fixOne")}
						</Button>
					)}
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant="ghost"
									size="bare"
									asChild
									className="h-7 px-2.5 text-[11.5px]"
								>
									<Link
										href={`/${lang}/admin/texts/${occurrence.textId}/edit?tokenId=${occurrence.tokenId}`}
									>
										{t("admin.spellingDictionaryDetail.openInEditor")}
									</Link>
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								{t("admin.spellingDictionaryDetail.openInEditorTooltip")}
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>
			</TableCell>
		</TableRow>
	);
};
