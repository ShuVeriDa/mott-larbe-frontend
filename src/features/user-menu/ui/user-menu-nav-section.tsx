import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui";
import { UserIcon, SettingsIcon } from "lucide-react";
import Link from "next/link";
import type { useI18n } from "@/shared/lib/i18n";
import { itemCls } from "../lib/item-cls";

interface UserMenuNavSectionProps {
	lang: string;
	t: ReturnType<typeof useI18n>["t"];
}

export const UserMenuNavSection = ({ lang, t }: UserMenuNavSectionProps) => (
	<div className="py-1">
		<DropdownMenuPrimitive.Item asChild>
			<Link href={`/${lang}/profile`} className={itemCls}>
				<UserIcon className="size-[13px] shrink-0 text-t-3" strokeWidth={1.75} />
				{t("nav.userMenu.profile")}
			</Link>
		</DropdownMenuPrimitive.Item>
		<DropdownMenuPrimitive.Item asChild>
			<Link href={`/${lang}/settings`} className={itemCls}>
				<SettingsIcon className="size-[13px] shrink-0 text-t-3" strokeWidth={1.75} />
				{t("nav.userMenu.settings")}
			</Link>
		</DropdownMenuPrimitive.Item>
	</div>
);
