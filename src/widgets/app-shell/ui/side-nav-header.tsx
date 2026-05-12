"use client";

import { BrandMark } from "@/shared/ui/brand-mark";
import { Typography } from "@/shared/ui/typography";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import Link from "next/link";

interface SideNavHeaderProps {
	isCompactMode: boolean;
}

export const SideNavHeader = ({ isCompactMode }: SideNavHeaderProps) => {
	const { t, lang } = useI18n();

	return (
		<div
			className={cn(
				"flex items-center border-b border-bd-1 py-4 transition-[padding] duration-200 min-[900px]:px-3.5",
				isCompactMode
					? "max-[899px]:justify-center max-[899px]:px-2"
					: "max-[899px]:px-2.5",
			)}
		>
			<Link
				href={`/${lang}/dashboard`}
				className={cn(
					"flex min-w-0 items-center gap-2.5 rounded-sm outline-offset-2 focus-visible:outline-2 focus-visible:outline-acc",
					isCompactMode && "max-[899px]:justify-center max-[899px]:gap-0",
				)}
			>
				<BrandMark width="30" height="36" className="shrink-0" />
				<div
					className={cn(
						"flex min-w-0 flex-col transition-[width,opacity] duration-200",
						isCompactMode &&
							"max-[899px]:w-0 max-[899px]:overflow-hidden max-[899px]:opacity-0",
					)}
				>
					<Typography
						tag="span"
						className="font-display text-sm font-medium tracking-[-0.1px] text-t-1"
					>
						{t("auth.brand.name")}
					</Typography>
					<Typography
						tag="span"
						className="text-[9px] uppercase tracking-[1px] text-t-3 opacity-70"
					>
						{t("auth.brand.tagline")}
					</Typography>
				</div>
			</Link>
		</div>
	);
};
