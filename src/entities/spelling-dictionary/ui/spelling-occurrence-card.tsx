"use client";

import { type ComponentProps, useState } from "react";
import Link from "next/link";
import { Checkbox } from "@/shared/ui/checkbox";
import { Button } from "@/shared/ui/button";
import { useI18n } from "@/shared/lib/i18n";
import type { SpellingOccurrence } from "../api/types";

interface SpellingOccurrenceCardProps {
	occurrence: SpellingOccurrence;
	lang: string;
	isSelected: boolean;
	canBulkFix: boolean;
	onToggleSelect: (tokenId: string) => void;
	onFixOne: (tokenId: string) => Promise<void>;
}

export const SpellingOccurrenceCard = ({
	occurrence,
	lang,
	isSelected,
	canBulkFix,
	onToggleSelect,
	onFixOne,
}: SpellingOccurrenceCardProps) => {
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

	const handleTextLinkClick: NonNullable<ComponentProps<"a">["onClick"]> = (e) =>
		e.stopPropagation();

	return (
		<div className="flex gap-2.5 border-b border-bd-1 px-3.5 py-3 last:border-b-0">
			<Checkbox
				checked={isSelected}
				onCheckedChange={handleToggle}
				disabled={!canBulkFix}
				aria-label={t("admin.spellingDictionaryDetail.selectRow")}
				className="mt-0.5 size-5 shrink-0"
			/>
			<div className="min-w-0 flex-1">
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
					{occurrence.textTitle} · {t("admin.spellingDictionaryDetail.page", { page: occurrence.pageNumber })}
				</Link>
				<div className="mt-2 flex items-center gap-1.5">
					{canBulkFix && (
						<Button
							variant="outline"
							onClick={handleFixClick}
							disabled={isFixingOne}
							className="h-8 px-3 text-[12px]"
						>
							{isFixingOne
								? t("admin.spellingDictionaryDetail.fixing")
								: t("admin.spellingDictionaryDetail.fixOne")}
						</Button>
					)}
					<Button variant="ghost" asChild className="h-8 px-3 text-[12px]">
						<Link href={`/${lang}/admin/texts/${occurrence.textId}/edit?tokenId=${occurrence.tokenId}`}>
							{t("admin.spellingDictionaryDetail.openInEditor")}
						</Link>
					</Button>
				</div>
			</div>
		</div>
	);
};
