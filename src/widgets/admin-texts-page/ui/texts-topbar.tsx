"use client";

import { Typography } from "@/shared/ui/typography";
import { Button } from "@/shared/ui/button";
import { useI18n } from "@/shared/lib/i18n";
import { Download, Plus } from "lucide-react";
import Link from "next/link";

interface TextsTopbarProps {
	onImportClick: () => void;
}

export const TextsTopbar = ({ onImportClick }: TextsTopbarProps) => {
	const { t, lang } = useI18n();

	return (
		<header className=" flex items-center gap-3 border-b border-bd-1 bg-surf px-[22px] py-[14px] transition-colors max-sm:px-3.5 max-sm:py-[11px]">
			<div className="min-w-0">
				<Typography tag="h1" className="font-display text-[16px] text-t-1 max-sm:text-[15px]">
					{t("admin.texts.title")}
				</Typography>
				<Typography tag="p" className="mt-px text-[12px] text-t-3 max-sm:hidden">
					{t("admin.texts.subtitle")}
				</Typography>
			</div>

			<div className="ml-auto flex items-center gap-2">
				<Button
					onClick={onImportClick}
					className="flex h-[30px] cursor-pointer items-center gap-1.5 rounded-base border border-bd-2 bg-transparent px-[11px] text-[12px] text-t-2 transition-colors hover:border-bd-3 hover:bg-surf-2 hover:text-t-1 max-sm:px-2"
				>
					<Download className="size-[13px]" />
					<Typography tag="span" className="max-sm:hidden">
						{t("admin.texts.import.button")}
					</Typography>
				</Button>
				<Link
					href={`/${lang}/admin/texts/create`}
					className="flex h-[30px] items-center gap-1.5 rounded-base bg-acc px-3 text-[12px] font-semibold text-white transition-opacity hover:opacity-88 max-sm:px-2"
				>
					<Plus className="size-[13px]" />
					<Typography tag="span" className="max-sm:hidden">{t("admin.texts.create")}</Typography>
				</Link>
			</div>
		</header>
	);
};
