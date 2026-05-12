import type { useI18n } from "@/shared/lib/i18n";
import { CreditCardIcon, LifeBuoyIcon } from "lucide-react";
import Link from "next/link";
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui";
import { itemCls } from "../lib/item-cls";

interface UserMenuSupportSectionProps {
	lang: string;
	t: ReturnType<typeof useI18n>["t"];
}

export const UserMenuSupportSection = ({
	lang,
	t,
}: UserMenuSupportSectionProps) => (
	<div className="border-t border-bd-1 py-1">
		<DropdownMenuPrimitive.Item asChild>
			<Link href={`/${lang}/feedback`} className={itemCls}>
				<LifeBuoyIcon
					className="size-[13px] shrink-0 text-t-3"
					strokeWidth={1.75}
				/>
				{t("nav.userMenu.support")}
			</Link>
		</DropdownMenuPrimitive.Item>
		<DropdownMenuPrimitive.Item asChild>
			<Link href={`/${lang}/subscription`} className={itemCls}>
				<CreditCardIcon
					className="size-[13px] shrink-0 text-t-3"
					strokeWidth={1.75}
				/>
				{t("nav.userMenu.subscription")}
			</Link>
		</DropdownMenuPrimitive.Item>
	</div>
);
