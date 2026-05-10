"use client";

import { Typography } from "@/shared/ui/typography";
import { Button } from "@/shared/ui/button";
import { useI18n } from "@/shared/lib/i18n";
import { Download } from "lucide-react";

interface AdminUsersTopbarProps {
	onExport: () => void;
}

export const AdminUsersTopbar = ({ onExport }: AdminUsersTopbarProps) => {
	const { t } = useI18n();

	return (
		<header className=" flex items-center gap-2.5 border-b border-bd-1 bg-surf px-[18px] py-3 transition-colors">
			<div>
				<div className="font-display text-[16px] text-t-1">
					{t("admin.users.title")}
				</div>
				<div className="mt-px text-[12px] text-t-3">
					{t("admin.users.subtitle")}
				</div>
			</div>
			<div className="ml-auto">
				<Button
					onClick={onExport}
					className="flex h-[30px] cursor-pointer items-center gap-1.5 rounded-base border border-bd-2 bg-transparent px-2.5 text-[12px] font-medium text-t-2 transition-colors hover:border-bd-3 hover:text-t-1"
				>
					<Download className="size-[13px]" />
					<Typography tag="span" className="max-sm:hidden">{t("admin.users.export")}</Typography>
				</Button>
			</div>
		</header>
	);
};
