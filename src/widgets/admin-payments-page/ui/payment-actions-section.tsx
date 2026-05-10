"use client";

import { Button } from "@/shared/ui/button";
import { ComponentProps } from 'react';
import type { AdminPaymentDetail } from "@/entities/admin-payment";
import Link from "next/link";
import { FileText, Mail, User, RotateCcw } from "lucide-react";

interface Props {
	payment: AdminPaymentDetail;
	lang: string;
	onReceipt: (id: string) => void;
	onSendReceipt: (id: string) => void;
	onRefund: (id: string) => void;
	t: (key: string) => string;
}

export const PaymentActionsSection = ({
	payment,
	lang,
	onReceipt,
	onSendReceipt,
	onRefund,
	t,
}: Props) => {
	const handleReceiptClick: NonNullable<ComponentProps<"button">["onClick"]> = () => onReceipt(payment.id);
	const handleSendReceiptClick: NonNullable<ComponentProps<"button">["onClick"]> = () => onSendReceipt(payment.id);
	const handleRefundClick: NonNullable<ComponentProps<"button">["onClick"]> = () => onRefund(payment.id);

	return (
		<div className="flex flex-col gap-1.5 px-[15px] py-2.5">
			<div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.6px] text-t-3">
				{t("admin.payments.detail.actions")}
			</div>
			<Button
				onClick={handleReceiptClick}
				className="flex h-[30px] w-full items-center gap-1.5 rounded-base border border-bd-2 bg-transparent px-2.5 text-[12px] text-t-2 transition-colors hover:bg-surf-2 hover:text-t-1"
			>
				<FileText className="size-3 shrink-0 text-t-3" />
				{t("admin.payments.detail.viewReceipt")}
			</Button>
			<Button
				onClick={handleSendReceiptClick}
				className="flex h-[30px] w-full items-center gap-1.5 rounded-base border border-bd-2 bg-transparent px-2.5 text-[12px] text-t-2 transition-colors hover:bg-surf-2 hover:text-t-1"
			>
				<Mail className="size-3 shrink-0 text-t-3" />
				{t("admin.payments.detail.sendReceipt")}
			</Button>
			<Link
				href={`/${lang}/admin/users/${payment.user.id}`}
				className="flex h-[30px] w-full items-center gap-1.5 rounded-base border border-bd-2 bg-transparent px-2.5 text-[12px] text-t-2 transition-colors hover:bg-surf-2 hover:text-t-1"
			>
				<User className="size-3 shrink-0 text-t-3" />
				{t("admin.payments.detail.userProfile")}
			</Link>
			{payment.status === "SUCCEEDED" && (
				<Button
					onClick={handleRefundClick}
					className="flex h-[30px] w-full items-center gap-1.5 rounded-base border border-[rgba(220,38,38,0.2)] bg-transparent px-2.5 text-[12px] text-red-t transition-colors hover:border-transparent hover:bg-red-bg"
				>
					<RotateCcw className="size-3 shrink-0 text-red-t" />
					{t("admin.payments.detail.issueRefund")}
				</Button>
			)}
		</div>
	);
};
