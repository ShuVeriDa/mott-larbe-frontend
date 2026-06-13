"use client";

import { useI18n } from "@/shared/lib/i18n";
import { cn } from "@/shared/lib/cn";
import type { TocItem } from "../lib/toc-config";

interface GuideTocProps {
	items: TocItem[];
	variant?: "pills" | "sidebar";
}

export const GuideToc = ({ items, variant = "pills" }: GuideTocProps) => {
	const { t } = useI18n();

	const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
		e.preventDefault();
		document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
		window.history.replaceState(null, "", `#${id}`);
	};

	if (variant === "sidebar") {
		return (
			<nav className="sticky top-6" aria-label={t("scriptGuide.tocContents")}>
				<p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-t-3">
					{t("scriptGuide.tocContents")}
				</p>
				<ul className="space-y-0.5">
					{items.map(item => {
						const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) =>
							handleAnchorClick(e, item.id);
						return (
							<li key={item.id}>
								<a
									href={`#${item.id}`}
									onClick={handleClick}
									className={cn(
										"block w-full rounded-base px-2.5 py-1.5 text-left text-sm text-t-3",
										"transition-colors duration-100 hover:bg-surf-2 hover:text-t-1",
									)}
								>
									{item.label}
								</a>
							</li>
						);
					})}
				</ul>
			</nav>
		);
	}

	return (
		<nav className="mb-6 flex flex-wrap gap-2" aria-label={t("scriptGuide.tocContents")}>
			{items.map(item => {
				const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) =>
					handleAnchorClick(e, item.id);
				return (
					<a
						key={item.id}
						href={`#${item.id}`}
						onClick={handleClick}
						className={cn(
							"rounded-full border border-bd-1 bg-surf-2 px-3 py-1 text-xs font-medium text-t-2",
							"transition-colors duration-100 hover:border-bd-2 hover:text-t-1",
						)}
					>
						{item.label}
					</a>
				);
			})}
		</nav>
	);
};
