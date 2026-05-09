import { useI18n } from "@/shared/lib/i18n";
import type { TextStatus } from "@/entities/admin-text";

import { Typography } from "@/shared/ui/typography";
export const TextStatusBadge = ({ status }: { status: TextStatus }) => {
	const { t } = useI18n();

	if (status === "published") {
		return (
			<Typography tag="span" className="inline-flex items-center gap-1 rounded-[5px] bg-grn-bg px-[7px] py-[2px] text-[10.5px] font-semibold text-grn-t">
				<Typography tag="span" className="size-[5px] rounded-full bg-current opacity-70" />
				{t("admin.texts.status.published")}
			</Typography>
		);
	}

	if (status === "archived") {
		return (
			<Typography tag="span" className="inline-flex items-center rounded-[5px] bg-amb-bg px-[7px] py-[2px] text-[10.5px] font-semibold text-amb-t">
				{t("admin.texts.status.archived")}
			</Typography>
		);
	}

	return (
		<Typography tag="span" className="inline-flex items-center rounded-[5px] bg-surf-3 px-[7px] py-[2px] text-[10.5px] font-semibold text-t-2">
			{t("admin.texts.status.draft")}
		</Typography>
	);
};
