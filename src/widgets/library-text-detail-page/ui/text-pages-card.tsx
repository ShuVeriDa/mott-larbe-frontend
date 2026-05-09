import { cn } from "@/shared/lib/cn";
import type { LibraryTextPage } from "@/entities/library-text";

import { Typography } from "@/shared/ui/typography";
type Translator = (key: string, vars?: Record<string, string | number>) => string;

interface TextPagesCardProps {
	pages: LibraryTextPage[];
	currentPage: number;
	progressPercent: number;
	t: Translator;
}

export const TextPagesCard = ({
	pages,
	currentPage,
	progressPercent,
	t,
}: TextPagesCardProps) => {
	const donePages = currentPage > 0 ? currentPage - 1 : 0;

	return (
		<div className="bg-surf border border-bd-1 rounded-card px-[17px] py-[15px]">
			<Typography tag="p" className="text-[10px] font-semibold tracking-[0.1em] uppercase text-t-3 mb-3">
				{t("library.textDetail.pagesCard.label")}
			</Typography>
			<div className="flex flex-col gap-0.5 max-h-[190px] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden max-sm:max-h-[160px]">
				{pages.map((page) => {
					const isDone = page.pageNumber <= donePages;
					const isCur =
						page.pageNumber === currentPage && progressPercent > 0;
					const label =
						page.title ??
						t("library.textDetail.pagesCard.pageN", {
							n: page.pageNumber,
						});

					return (
						<div
							key={page.id}
							className="flex items-center gap-2 px-1.5 py-[5px] rounded-base hover:bg-surf-2 transition-colors cursor-default"
						>
							<Typography tag="span"
								className={cn(
									"text-[11px] font-semibold w-[18px] shrink-0 tabular-nums",
									isDone
										? "text-grn-t"
										: isCur
											? "text-acc-t"
											: "text-t-4",
								)}
							>
								{page.pageNumber}
							</Typography>
							<Typography tag="span"
								className={cn(
									"text-xs flex-1 truncate",
									isDone
										? "text-t-2"
										: isCur
											? "text-t-1"
											: "text-t-3",
								)}
							>
								{label}
							</Typography>
							{isDone && <CheckIcon />}
							{isCur && (
								<Typography tag="span" className="text-[9px] font-semibold tracking-[0.04em] text-acc-t bg-acc-bg border border-acc/20 px-1.5 py-[1px] rounded-[3px]">
									{t("library.textDetail.pagesCard.current")}
								</Typography>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
};

const CheckIcon = () => (
	<svg
		width="11"
		height="11"
		viewBox="0 0 12 12"
		fill="none"
		stroke="currentColor"
		strokeWidth="1.5"
		strokeLinecap="round"
		strokeLinejoin="round"
		className="text-grn-t shrink-0"
	>
		<polyline points="2,6 5,9 10,3" />
	</svg>
);
