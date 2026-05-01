"use client";

import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { SectionCard } from "../section-card";

export interface ManageCardProps {
	onCancel: () => void;
}

export const ManageCard = ({ onCancel }: ManageCardProps) => {
	const { t } = useI18n();
	return (
		<SectionCard title={t("subscription.manage.title")}>
			<div className="flex items-center justify-between gap-3 px-4 py-3 max-md:flex-col max-md:items-start max-md:px-3">
				<div className="min-w-0 flex-1">
					<Typography
						tag="span"
						className="mb-0.5 block text-[12.5px] font-medium text-t-1"
					>
						{t("subscription.manage.cancelTitle")}
					</Typography>
					<Typography
						tag="span"
						className="block text-[11px] leading-[1.4] text-t-3"
					>
						{t("subscription.manage.cancelDesc")}
					</Typography>
				</div>
				<Button
					variant="danger"
					onClick={onCancel}
					className="h-[30px] px-3.5 text-[12px] font-semibold whitespace-nowrap max-md:w-full"
				>
					{t("subscription.manage.cancelAction")}
				</Button>
			</div>
		</SectionCard>
	);
};
