"use client";

import type { AdminPaymentDetail } from "@/entities/admin-payment";
import { useI18n } from "@/shared/lib/i18n";
import { PaymentUserHeroSection } from "./payment-user-hero-section";
import { PaymentAccountSection } from "./payment-account-section";
import { PaymentRolesSection } from "./payment-roles-section";
import { PaymentTransactionSection } from "./payment-transaction-section";
import { PaymentActionsSection } from "./payment-actions-section";

// ── Main component ─────────────────────────────────────────────────────────────

interface Props {
	payment: AdminPaymentDetail;
	lang: string;
	isLoading?: boolean;
	onReceipt: (id: string) => void;
	onSendReceipt: (id: string) => void;
	onRefund: (id: string) => void;
}

export const PaymentDetailPanel = ({
	payment,
	lang,
	isLoading,
	onReceipt,
	onSendReceipt,
	onRefund,
}: Props) => {
	const { t } = useI18n();

	if (isLoading) {
		return (
			<div className="overflow-hidden rounded-card border border-bd-1 bg-surf">
				<div className="space-y-3 p-4">
					{Array.from({ length: 6 }).map((_, i) => (
						<div key={i} className="h-5 animate-pulse rounded bg-surf-3" />
					))}
				</div>
			</div>
		);
	}

	const otherPayments = (payment.user.payments ?? []).slice(0, 3);

	return (
		<div className="overflow-hidden rounded-card border border-bd-1 bg-surf">
			<PaymentUserHeroSection payment={payment} t={t} />
			<PaymentAccountSection payment={payment} t={t} />
			<PaymentRolesSection payment={payment} t={t} />
			<PaymentTransactionSection payment={payment} otherPayments={otherPayments} t={t} />
			<PaymentActionsSection
				payment={payment}
				lang={lang}
				onReceipt={onReceipt}
				onSendReceipt={onSendReceipt}
				onRefund={onRefund}
				t={t}
			/>
		</div>
	);
};
