import { useI18n } from "@/shared/lib/i18n";
import type { UserEventsSummary } from "@/entities/admin-user";

import { Typography } from "@/shared/ui/typography";
interface UserEventsSummaryTabProps {
	summary: UserEventsSummary | undefined;
	isLoading: boolean;
}

export const UserEventsSummaryTab = ({
	summary,
	isLoading,
}: UserEventsSummaryTabProps) => {
	const { t } = useI18n();

	if (isLoading) {
		return (
			<div className="p-3.5 space-y-3">
				<div className="grid grid-cols-3 gap-2">
					{Array.from({ length: 3 }).map((_, i) => (
						<div key={i} className="h-14 animate-pulse rounded-[8px] bg-surf-3" />
					))}
				</div>
				<div className="space-y-2">
					{Array.from({ length: 5 }).map((_, i) => (
						<div key={i} className="h-4 w-full animate-pulse rounded bg-surf-3" />
					))}
				</div>
			</div>
		);
	}

	if (!summary) return null;

	const openText = summary.counts["OPEN_TEXT"] ?? 0;
	const addToDict = summary.counts["ADD_TO_DICTIONARY"] ?? 0;
	const failLookup = summary.counts["FAIL_LOOKUP"] ?? 0;
	const maxCount = summary.topFailLookups[0]?.count ?? 1;

	return (
		<div className="p-3.5 space-y-3">
			<div className="grid grid-cols-3 gap-2">
				<div className="rounded-[8px] bg-acc-bg p-2.5">
					<div className="mb-0.5 text-[10px] font-semibold text-acc-t">OPEN_TEXT</div>
					<div className="text-[20px] font-semibold leading-none text-t-1">
						{openText.toLocaleString()}
					</div>
				</div>
				<div className="rounded-[8px] bg-grn-bg p-2.5">
					<div className="mb-0.5 text-[10px] font-semibold text-grn-t">ADD_TO_DICT</div>
					<div className="text-[20px] font-semibold leading-none text-t-1">
						{addToDict.toLocaleString()}
					</div>
				</div>
				<div className="rounded-[8px] bg-red-bg p-2.5">
					<div className="mb-0.5 text-[10px] font-semibold text-red-t">FAIL_LOOKUP</div>
					<div className="text-[20px] font-semibold leading-none text-t-1">
						{failLookup.toLocaleString()}
					</div>
				</div>
			</div>

			{summary.topFailLookups.length > 0 && (
				<div className="overflow-hidden rounded-lg border border-bd-1">
					<div className="flex items-center justify-between border-b border-bd-1 px-3 py-2.5">
						<Typography tag="span" className="text-[11.5px] font-semibold text-t-1">
							{t("admin.userDetail.events.topUnknown")}
						</Typography>
						<Typography tag="span" className="text-[10.5px] text-t-3">topFailLookups</Typography>
					</div>
					<div>
						{summary.topFailLookups.map((item, i) => (
							<div
								key={item.normalized}
								className="flex items-center gap-2 border-b border-bd-1 px-3 py-1.5 text-[12.5px] last:border-b-0"
							>
								<Typography tag="span" className="w-4 shrink-0 text-right text-[11px] font-semibold text-t-3">
									{i + 1}
								</Typography>
								<Typography tag="span" className="flex-1 font-medium text-t-1" style={{ fontFamily: "'Playfair Display', serif" }}>
									{item.normalized}
								</Typography>
								<div className="w-14 shrink-0">
									<div className="h-1 rounded-full bg-surf-3">
										<div
											className="h-full rounded-full bg-red"
											style={{ width: `${(item.count / maxCount) * 100}%` }}
										/>
									</div>
								</div>
								<Typography tag="span" className="text-[11px] text-t-3">{item.count}×</Typography>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
};
