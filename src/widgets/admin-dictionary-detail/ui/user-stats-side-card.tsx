"use client";

import { useI18n } from "@/shared/lib/i18n";
import type { AdminDictUserStats } from "@/entities/dictionary";

interface UserStatsSideCardProps {
	data: AdminDictUserStats | undefined;
	isLoading: boolean;
}

export const UserStatsSideCard = ({ data, isLoading }: UserStatsSideCardProps) => {
	const { t } = useI18n();

	const rows = data
		? [
				{ key: t("admin.dictionaryDetail.usersAdded"), value: `${data.totalAdded}`, highlight: true },
				{ key: `${t("admin.dictionaryDetail.statusNew")}`, value: `${data.countNew}`, className: "text-t-3" },
				{
					key: `${t("admin.dictionaryDetail.statusLearning")}`,
					value: `${data.countLearning}`,
					className: "text-amb-t font-medium",
				},
				{
					key: `${t("admin.dictionaryDetail.statusKnown")}`,
					value: `${data.countKnown}`,
					className: "text-grn-t font-medium",
				},
			]
		: [];

	return (
		<div className="overflow-hidden rounded-xl border border-bd-1 bg-surf transition-colors">
			<div className="border-b border-bd-1 px-4 py-3">
				<span className="text-[11.5px] font-semibold uppercase tracking-[0.5px] text-t-2">
					{t("admin.dictionaryDetail.userDictionaries")}
				</span>
			</div>

			{isLoading ? (
				<>
					{[0, 1, 2, 3].map((i) => (
						<div key={i} className="flex items-center justify-between border-b border-bd-1 px-4 py-2.5 last:border-b-0">
							<div className="h-3 w-24 animate-pulse rounded bg-surf-3" />
							<div className="h-3 w-10 animate-pulse rounded bg-surf-3" />
						</div>
					))}
				</>
			) : !data ? null : (
				<div>
					{rows.map((row) => (
						<div
							key={row.key}
							className="flex items-center justify-between border-b border-bd-1 px-4 py-2.5 text-[12.5px] last:border-b-0"
						>
							<span className="text-t-3">{row.key}</span>
							<span className={row.className ?? "font-medium text-t-1"}>{row.value}</span>
						</div>
					))}
				</div>
			)}
		</div>
	);
};
