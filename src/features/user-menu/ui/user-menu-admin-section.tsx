import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui";
import { LayoutDashboardIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/shared/lib/cn";
import type { useI18n } from "@/shared/lib/i18n";
import { itemCls } from "../lib/item-cls";

interface UserMenuAdminSectionProps {
	lang: string;
	t: ReturnType<typeof useI18n>["t"];
}

export const UserMenuAdminSection = ({ lang, t }: UserMenuAdminSectionProps) => (
	<div className="border-t border-bd-1 py-1">
		<DropdownMenuPrimitive.Item asChild>
			<Link href={`/${lang}/admin/dashboard`} className={cn(itemCls, "text-acc-t")}>
				<LayoutDashboardIcon className="size-[13px] shrink-0 text-acc" strokeWidth={1.75} />
				{t("nav.userMenu.adminPanel")}
			</Link>
		</DropdownMenuPrimitive.Item>
	</div>
);
