"use client";

import { Typography } from "@/shared/ui/typography";

import { Button } from "@/shared/ui/button";

import { useI18n } from "@/shared/lib/i18n";
import { Download, Plus } from "lucide-react";

interface Props {
	onAdd: () => void;
	onImport: () => void;
}

export const MorphologyTopbar = ({ onAdd, onImport }: Props) => {
	const { t } = useI18n();

	return (
		<header className=" flex items-center gap-3 border-b border-bd-1 bg-surf px-5 py-3.5 transition-colors">
			<div>
				<Typography tag="h1" className="font-display text-[16px] text-t-1">
					{t("admin.morphology.title")}
				</Typography>
				<Typography tag="p" className="mt-0.5 text-[12px] text-t-3">
					{t("admin.morphology.subtitle")}
				</Typography>
			</div>

			<div className="ml-auto flex items-center gap-2">
				<Button
					onClick={onImport}
					className="flex h-[30px] items-center gap-1.5 rounded-base border border-bd-2 bg-transparent px-3 text-[12px] text-t-2 transition-colors hover:border-bd-3 hover:bg-surf-2 hover:text-t-1"
				>
					<Download className="size-[13px] shrink-0" />
					<Typography tag="span" className="max-sm:hidden">{t("admin.morphology.import")}</Typography>
				</Button>

				<Button
					onClick={onAdd}
					className="flex h-[30px] items-center gap-1.5 rounded-base bg-acc px-3 text-[12px] font-semibold text-white transition-opacity hover:opacity-90"
				>
					<Plus className="size-3" />
					{t("admin.morphology.add")}
				</Button>
			</div>
		</header>
	);
};
