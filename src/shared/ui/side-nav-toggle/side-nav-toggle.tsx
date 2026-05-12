"use client";

import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button/button";
import { Typography } from "@/shared/ui/typography";
import { PanelLeft, PanelLeftClose } from "lucide-react";
import type { ComponentProps } from "react";

interface SideNavToggleProps {
	isExpandedOnSmall: boolean;
	onToggle: NonNullable<ComponentProps<"button">["onClick"]>;
}

export const SideNavToggle = ({
	isExpandedOnSmall,
	onToggle,
}: SideNavToggleProps) => {
	const { t } = useI18n();

	return (
		<div className="hidden border-t border-bd-1 p-2 max-[899px]:block">
			<Button
				onClick={onToggle}
				variant="ghost"
				size="bare"
				className={cn(
					"flex h-8 items-center gap-2 rounded-[8px] border border-bd-2 bg-surf text-t-2 transition-colors hover:border-bd-3 hover:bg-surf-2 hover:text-t-1",
					isExpandedOnSmall
						? "w-full justify-center"
						: "mx-auto w-8 justify-center",
				)}
				aria-label={isExpandedOnSmall ? "Collapse menu" : "Expand menu"}
			>
				<div className="w-3.5 h-3.5 flex justify-between items-center">
					{isExpandedOnSmall ? (
						<PanelLeftClose className="size-[14px]" />
					) : (
						<PanelLeft className="size-[14px]" />
					)}
				</div>
				{isExpandedOnSmall && (
					<Typography tag="span" className="text-[12px]">
						{t("nav.collapse")}
					</Typography>
				)}
			</Button>
		</div>
	);
};
