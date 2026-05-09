"use client";

import { Button } from "@/shared/ui/button";
import { ComponentProps } from 'react';
import type { AdminPaymentDetail } from "@/entities/admin-payment";
import Link from "next/link";

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
				<svg
					className="size-3 shrink-0 text-t-3"
					viewBox="0 0 12 12"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.3"
				>
					<rect x="1.5" y="1.5" width="9" height="9" rx="1.5" />
					<path d="M4 5h4M4 7h2" strokeLinecap="round" />
				</svg>
				{t("admin.payments.detail.viewReceipt")}
			</Button>
			<Button
				onClick={handleSendReceiptClick}
				className="flex h-[30px] w-full items-center gap-1.5 rounded-base border border-bd-2 bg-transparent px-2.5 text-[12px] text-t-2 transition-colors hover:bg-surf-2 hover:text-t-1"
			>
				<svg
					className="size-3 shrink-0 text-t-3"
					viewBox="0 0 12 12"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.3"
				>
					<path d="M1 3l5 3.5L11 3M1.5 2.5h9a.5.5 0 01.5.5v6a.5.5 0 01-.5.5h-9a.5.5 0 01-.5-.5V3a.5.5 0 01.5-.5z" />
				</svg>
				{t("admin.payments.detail.sendReceipt")}
			</Button>
			<Link
				href={`/${lang}/admin/users/${payment.user.id}`}
				className="flex h-[30px] w-full items-center gap-1.5 rounded-base border border-bd-2 bg-transparent px-2.5 text-[12px] text-t-2 transition-colors hover:bg-surf-2 hover:text-t-1"
			>
				<svg
					className="size-3 shrink-0 text-t-3"
					viewBox="0 0 12 12"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.3"
				>
					<circle cx="6" cy="4" r="2" />
					<path
						d="M2 10c0-2.21 1.79-4 4-4s4 1.79 4 4"
						strokeLinecap="round"
					/>
				</svg>
				{t("admin.payments.detail.userProfile")}
			</Link>
			{payment.status === "SUCCEEDED" && (
				<Button
					onClick={handleRefundClick}
					className="flex h-[30px] w-full items-center gap-1.5 rounded-base border border-[rgba(220,38,38,0.2)] bg-transparent px-2.5 text-[12px] text-red-t transition-colors hover:border-transparent hover:bg-red-bg"
				>
					<svg
						className="size-3 shrink-0 text-red-t"
						viewBox="0 0 12 12"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.3"
					>
						<path
							d="M1.5 6.5H9a2 2 0 000-4H5.5M1.5 6.5l2-2M1.5 6.5l2 2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
					{t("admin.payments.detail.issueRefund")}
				</Button>
			)}
		</div>
	);
};
