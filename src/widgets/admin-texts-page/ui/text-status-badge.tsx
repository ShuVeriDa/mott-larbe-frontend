import { useI18n } from "@/shared/lib/i18n";
import type { TextStatus } from "@/entities/admin-text";

export const TextStatusBadge = ({ status }: { status: TextStatus }) => {
	const { t } = useI18n();

	if (status === "published") {
		return (
			<span className="inline-flex items-center gap-1 rounded-[5px] bg-grn-bg px-[7px] py-[2px] text-[10.5px] font-semibold text-grn-t">
				<span className="size-[5px] rounded-full bg-current opacity-70" />
				{t("admin.texts.status.published")}
			</span>
		);
	}

	if (status === "archived") {
		return (
			<span className="inline-flex items-center rounded-[5px] bg-amb-bg px-[7px] py-[2px] text-[10.5px] font-semibold text-amb-t">
				{t("admin.texts.status.archived")}
			</span>
		);
	}

	return (
		<span className="inline-flex items-center rounded-[5px] bg-surf-3 px-[7px] py-[2px] text-[10.5px] font-semibold text-t-2">
			{t("admin.texts.status.draft")}
		</span>
	);
};
