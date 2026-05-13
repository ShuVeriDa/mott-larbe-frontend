import { cn } from "@/shared/lib/cn";
import type { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { LogOutIcon } from "lucide-react";
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui";
import { itemCls } from "../lib/item-cls";

interface UserMenuLogoutSectionProps {
	t: ReturnType<typeof useI18n>["t"];
	isPending: boolean;
	onLogout: () => void;
}

export const UserMenuLogoutSection = ({
	t,
	isPending,
	onLogout,
}: UserMenuLogoutSectionProps) => (
	<div className="border-t border-bd-1 py-1">
		<DropdownMenuPrimitive.Item asChild>
			<Button
				disabled={isPending}
				onClick={onLogout}
				className={cn(
					itemCls,
					"justify-start hover:bg-danger/8 focus-visible:bg-danger/8 disabled:opacity-50",
				)}
			>
				<LogOutIcon className="size-[13px] shrink-0" strokeWidth={1.75} />
				{t("nav.userMenu.logout")}
			</Button>
		</DropdownMenuPrimitive.Item>
	</div>
);
