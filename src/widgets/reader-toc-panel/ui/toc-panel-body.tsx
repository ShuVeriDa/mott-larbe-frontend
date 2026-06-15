"use client";

import { useTextToc, type TocEntry } from "@/entities/text-toc";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { List } from "lucide-react";

interface TocPanelBodyProps {
	textId: string;
	currentPage: number;
	onNavigate: (page: number) => void;
	onClose: () => void;
}

export const TocPanelBody = ({
	textId,
	currentPage,
	onNavigate,
	onClose,
}: TocPanelBodyProps) => {
	const { t } = useI18n();
	const { data: entries = [], isLoading } = useTextToc(textId);

	const isEmpty = !isLoading && entries.length === 0;

	const handleEntryClick = (entry: TocEntry) => {
		onNavigate(entry.pageNumber);
		onClose();
	};

	return (
		<div className="flex min-h-0 flex-1 flex-col gap-3">
			{isLoading && (
				<Typography className="text-[12px] text-t-4">
					{t("reader.toc.loading")}
				</Typography>
			)}
			{isEmpty && (
				<div className="flex flex-col items-center gap-2 py-6 text-center">
					<List className="size-8 text-t-4" strokeWidth={1.2} />
					<Typography className="text-[13px] text-t-3">
						{t("reader.toc.empty")}
					</Typography>
				</div>
			)}
			<div className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto">
				{entries.map(entry => {
					const isActive = entry.pageNumber === currentPage;
					const label =
						entry.title ?? `${t("reader.toc.page")} ${entry.pageNumber}`;

					const handleClick = () => handleEntryClick(entry);

					return (
						<Button
							key={entry.pageNumber}
							title={label}
							onClick={handleClick}
							className={cn(
								"flex w-full items-baseline gap-2 rounded-[6px] px-2.5 py-2 text-left text-[13px] transition-colors",
								isActive
									? "bg-acc-bg text-acc-t"
									: "text-t-2 hover:bg-surf-2 hover:text-t-1",
							)}
						>
							<Typography
								tag="span"
								className="shrink-0 text-[11px] tabular-nums text-t-4"
							>
								{entry.pageNumber}
							</Typography>
							<Typography tag="span" className="min-w-0 truncate">
								{label}
							</Typography>
						</Button>
					);
				})}
			</div>
		</div>
	);
};
