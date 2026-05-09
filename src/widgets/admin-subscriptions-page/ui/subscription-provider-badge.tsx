import type { PaymentProvider } from "@/entities/admin-subscription";

import { Typography } from "@/shared/ui/typography";
interface Props {
	provider: PaymentProvider;
}

const COLORS: Record<PaymentProvider, string> = {
	STRIPE: "#635bff",
	PAYPAL: "#0070ba",
	PADDLE: "#07a3b1",
	LEMONSQUEEZY: "#f6b60d",
	MANUAL: "#a5a39a",
};

export const SubscriptionProviderBadge = ({ provider }: Props) => (
	<Typography tag="span" className="inline-flex items-center gap-1 rounded-[5px] border border-bd-2 bg-surf-2 px-1.5 py-[2px] text-[11px] font-medium text-t-2 whitespace-nowrap">
		<Typography tag="span"
			className="size-1.5 shrink-0 rounded-full"
			style={{ background: COLORS[provider] ?? "#a5a39a" }}
		/>
		{provider}
	</Typography>
);
