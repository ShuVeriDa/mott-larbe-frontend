import type { AdminUserDetail } from "@/entities/admin-user";
import { useI18n } from "@/shared/lib/i18n";
import { ReactNode } from "react";

import { SectionLabel } from "@/shared/ui/section-label";
import { Typography } from "@/shared/ui/typography";
interface UserInfoSectionProps {
	user: AdminUserDetail;
}

const InfoRow = ({ label, value }: { label: string; value: ReactNode }) => (
	<div className="flex items-baseline justify-between gap-2">
		<Typography tag="span" className="text-[12px] text-t-3 shrink-0">
			{label}
		</Typography>
		<Typography
			tag="span"
			className="text-right text-[12.5px] font-medium text-t-1"
		>
			{value}
		</Typography>
	</div>
);

export const UserInfoSection = ({ user }: UserInfoSectionProps) => {
	const { t } = useI18n();

	const signupDate = new Date(user.signupAt).toLocaleDateString("ru-RU", {
		day: "numeric",
		month: "short",
		year: "numeric",
	});

	const lastActive = user.lastActiveAt
		? new Date(user.lastActiveAt).toLocaleString("ru-RU", {
				day: "numeric",
				month: "short",
				hour: "2-digit",
				minute: "2-digit",
			})
		: "—";

	return (
		<div className="space-y-1.5 border-b border-bd-1 px-4 py-3">
			<SectionLabel>
				{t("admin.userDetail.account")}
			</SectionLabel>
			<InfoRow
				label={t("admin.userDetail.id")}
				value={
					<Typography tag="span" className="font-mono text-[9px] text-t-3">
						{user.id}
					</Typography>
				}
			/>
			<InfoRow
				label={t("admin.userDetail.username")}
				value={user.username || "—"}
			/>
			<InfoRow
				label={t("admin.userDetail.phone")}
				value={
					<Typography
						tag="span"
						className={user.phone ? "text-t-1" : "text-t-3 font-normal"}
					>
						{user.phone ?? "—"}
					</Typography>
				}
			/>
			<InfoRow label={t("admin.userDetail.registered")} value={signupDate} />
			<InfoRow label={t("admin.userDetail.lastActive")} value={lastActive} />
			<InfoRow
				label={t("admin.userDetail.authMethod.password")}
				value={
					user.hasPassword
						? t("admin.userDetail.authMethod.passwordSet")
						: t("admin.userDetail.authMethod.passwordNotSet")
				}
			/>
			{user.linkedProviders.length > 0 ? (
				<InfoRow
					label={t("admin.userDetail.authMethod.providers")}
					value={user.linkedProviders.join(", ")}
				/>
			) : null}
		</div>
	);
};
