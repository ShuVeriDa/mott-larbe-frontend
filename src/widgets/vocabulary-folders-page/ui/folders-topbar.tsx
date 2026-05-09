"use client";

import Link from "next/link";
import { ChevronLeft, Plus } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { useI18n } from "@/shared/lib/i18n";

export interface FoldersTopbarProps {
	onCreate: () => void;
	createDisabled?: boolean;
}

export const FoldersTopbar = ({ onCreate, createDisabled }: FoldersTopbarProps) => {
	const { t, lang } = useI18n();

	return (
		<header className="flex shrink-0 items-center gap-2.5 border-hairline border-b border-bd-1 bg-surf px-[22px] py-3 transition-colors duration-200 max-md:gap-2 max-md:px-[14px] max-md:py-2.5">
			<Link
				href={`/${lang}/vocabulary`}
				className="flex items-center gap-1 text-[12.5px] text-t-3 transition-colors hover:text-t-1"
			>
				<ChevronLeft className="size-3" strokeWidth={1.6} />
				<Typography tag="span">{t("vocabulary.foldersPage.breadcrumb.vocabulary")}</Typography>
			</Link>
			<Typography tag="span" aria-hidden className="text-[12px] text-t-4">
				·
			</Typography>
			<Typography
				tag="h1"
				className="text-[13px] font-semibold text-t-1 max-md:text-[14px]"
			>
				{t("vocabulary.foldersPage.breadcrumb.folders")}
			</Typography>

			<div className="ml-auto flex items-center gap-2">
				<Button
					variant="action"
					size="default"
					onClick={onCreate}
					disabled={createDisabled}
					className="shadow-[0_1px_4px_rgba(34,84,211,0.3)]"
				>
					<Plus className="size-[11px]" strokeWidth={2.4} />
					<Typography tag="span" className="max-md:hidden">
						{t("vocabulary.foldersPage.newFolder")}
					</Typography>
				</Button>
			</div>
		</header>
	);
};
