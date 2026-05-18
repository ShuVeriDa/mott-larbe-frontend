"use client";

import { useI18n } from "@/shared/lib/i18n";
import type { AdminPaymentListItem } from "@/entities/admin-payment";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/shared/ui/table";
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
			<Table className="border-collapse text-[12.5px]" aria-label={t("admin.payments.table.transaction")}>
				<TableHeader>
					<TableRow className="border-b border-bd-1">
						<TableHead className="col-txid px-3 py-2.5 text-[10.5px] font-semibold uppercase tracking-[0.3px] text-t-3 max-md:hidden">
							{t("admin.payments.table.transaction")}
						</TableHead>
						<TableHead className="px-3 py-2.5 text-[10.5px] font-semibold uppercase tracking-[0.3px] text-t-3">
							{t("admin.payments.table.user")}
						</TableHead>
						<TableHead className="px-3 py-2.5 text-[10.5px] font-semibold uppercase tracking-[0.3px] text-t-3">
							{t("admin.payments.table.plan")}
						</TableHead>
						<TableHead className="px-3 py-2.5 text-[10.5px] font-semibold uppercase tracking-[0.3px] text-t-3 max-md:hidden">
							{t("admin.payments.table.provider")}
						</TableHead>
						<TableHead className="px-3 py-2.5 text-[10.5px] font-semibold uppercase tracking-[0.3px] text-acc-t max-sm:hidden">
							{t("admin.payments.table.date")}
						</TableHead>
						<TableHead className="px-3 py-2.5 text-[10.5px] font-semibold uppercase tracking-[0.3px] text-t-3">
							{t("admin.payments.table.status")}
						</TableHead>
						<TableHead className="px-3 py-2.5 text-right text-[10.5px] font-semibold uppercase tracking-[0.3px] text-t-3">
							{t("admin.payments.table.amount")}
						</TableHead>
						<TableHead className="w-[90px] px-3 py-2.5" />
					</TableRow>
				</TableHeader>
				<TableBody>
					{items.length === 0 ? (
						<TableRow>
							<TableCell
								colSpan={8}
								className="px-3 py-7 text-center text-[12.5px] text-t-3"
							>
								{t("admin.payments.table.empty")}
							</TableCell>
						</TableRow>
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
				</TableBody>
			</Table>
		</div>
	);
};
