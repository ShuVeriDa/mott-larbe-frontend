"use client";

import { useI18n } from "@/shared/lib/i18n";
import type { AdminPaymentListItem } from "@/entities/admin-payment";
import { PaymentsTableSkeleton } from "./payments-table-skeleton";
import { PaymentsTableRow } from "./payments-table-row";

interface Props {
	items: AdminPaymentListItem[];
	selectedId: string | null;
	isLoading: boolean;
	onSelectRow: (id: string) => void;
	onReceipt: (id: string) => void;
	onRefund: (id: string) => void;
}

export const PaymentsTable = ({
	items,
	selectedId,
	isLoading,
	onSelectRow,
	onReceipt,
	onRefund,
}: Props) => {
	const { t } = useI18n();

	const headers = [
		t("admin.payments.table.transaction"),
		t("admin.payments.table.user"),
		t("admin.payments.table.plan"),
		t("admin.payments.table.provider"),
		t("admin.payments.table.date"),
		t("admin.payments.table.status"),
		t("admin.payments.table.amount"),
		"",
	];

	if (isLoading) {
		return <PaymentsTableSkeleton headers={headers} />;
	}

	return (
		<div className="overflow-x-auto [&::-webkit-scrollbar]:h-0">
			<table className="w-full border-collapse text-[12.5px]">
				<thead>
					<tr className="border-b border-bd-1">
						<th className="col-txid px-3 py-2.5 text-left text-[10.5px] font-semibold uppercase tracking-[0.3px] text-t-3 max-md:hidden">
							{t("admin.payments.table.transaction")}
						</th>
						<th className="px-3 py-2.5 text-left text-[10.5px] font-semibold uppercase tracking-[0.3px] text-t-3">
							{t("admin.payments.table.user")}
						</th>
						<th className="px-3 py-2.5 text-left text-[10.5px] font-semibold uppercase tracking-[0.3px] text-t-3">
							{t("admin.payments.table.plan")}
						</th>
						<th className="px-3 py-2.5 text-left text-[10.5px] font-semibold uppercase tracking-[0.3px] text-t-3 max-md:hidden">
							{t("admin.payments.table.provider")}
						</th>
						<th className="px-3 py-2.5 text-left text-[10.5px] font-semibold uppercase tracking-[0.3px] text-acc-t max-sm:hidden">
							{t("admin.payments.table.date")}
						</th>
						<th className="px-3 py-2.5 text-left text-[10.5px] font-semibold uppercase tracking-[0.3px] text-t-3">
							{t("admin.payments.table.status")}
						</th>
						<th className="px-3 py-2.5 text-right text-[10.5px] font-semibold uppercase tracking-[0.3px] text-t-3">
							{t("admin.payments.table.amount")}
						</th>
						<th className="w-[90px] px-3 py-2.5" />
					</tr>
				</thead>
				<tbody>
					{items.length === 0 ? (
						<tr>
							<td
								colSpan={8}
								className="px-3 py-7 text-center text-[12.5px] text-t-3"
							>
								{t("admin.payments.table.empty")}
							</td>
						</tr>
					) : (
						items.map((item) => (
							<PaymentsTableRow
								key={item.id}
								item={item}
								isSelected={item.id === selectedId}
								trialLabel={t("admin.payments.period.trial")}
								receiptLabel={t("admin.payments.table.receipt")}
								refundLabel={t("admin.payments.table.refund")}
								onSelect={onSelectRow}
								onReceipt={onReceipt}
								onRefund={onRefund}
								t={t}
							/>
						))
					)}
				</tbody>
			</table>
		</div>
	);
};
