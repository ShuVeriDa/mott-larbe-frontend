"use client";

import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { Plus, X } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

interface AdminTextEditorPageTabsProps {
	pagesCount: number;
	activePage: number;
	stickyTopClassName: string;
	addPageTitle: string;
	deletePageTitle: string;
	pagesSummary: string;
	onAddPage: () => void;
	onSelectPage: (index: number) => void;
	onDeletePage?: (index: number) => void;
	getPageLabel: (index: number) => string;
	extraRight?: ReactNode;
}

export const AdminTextEditorPageTabs = ({
	pagesCount,
	activePage,
	stickyTopClassName,
	addPageTitle,
	deletePageTitle,
	pagesSummary,
	onAddPage,
	onSelectPage,
	onDeletePage,
	getPageLabel,
	extraRight,
}: AdminTextEditorPageTabsProps) => {
	const pageIndexes = Array.from({ length: pagesCount }, (_, index) => index);
	const showDelete = Boolean(onDeletePage) && pagesCount > 1;
	const handleAddPage: NonNullable<ComponentProps<"button">["onClick"]> = () =>
		onAddPage();

	return (
		<div
			className={`sticky ${stickyTopClassName} z-10 flex items-center overflow-x-auto border-b border-bd-1 bg-surf px-3.5 transition-colors [scrollbar-width:none]`}
		>
			{pageIndexes.map(index => {
				const handleTabClick: NonNullable<
					ComponentProps<"button">["onClick"]
				> = () => onSelectPage(index);
				const handleDeleteClick: NonNullable<
					ComponentProps<"button">["onClick"]
				> = e => {
					e.stopPropagation();
					onDeletePage?.(index);
				};

				return (
					<div
						key={index}
						className={`group/tab flex h-9 shrink-0 items-center gap-1 border-b-2 pl-3 pr-1.5 transition-colors ${
							index === activePage
								? "border-acc text-acc-strong"
								: "border-transparent text-t-3 hover:text-t-2"
						}`}
					>
						<Button
							onClick={handleTabClick}
							className="flex items-center gap-1.5 text-xs"
						>
							<Typography
								tag="span"
								className={`flex h-[17px] w-[17px] items-center justify-center rounded-[4px] text-[10px] font-semibold ${
									index === activePage
										? "bg-acc-bg text-acc-strong"
										: "bg-surf-3 text-t-3"
								}`}
							>
								{index + 1}
							</Typography>
							{getPageLabel(index)}
						</Button>
						{showDelete && (
							<Button
								title={deletePageTitle}
								size={"bare"}
								onClick={handleDeleteClick}
								className="ml-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-[3px] opacity-0 transition-opacity hover:bg-surf-3 group-hover/tab:opacity-100"
							>
								<X className="size-2" />
							</Button>
						)}
					</div>
				);
			})}

			<Button
				title={addPageTitle}
				size={"bare"}
				onClick={handleAddPage}
				className="ml-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-[5px] text-t-3 transition-colors hover:bg-surf-3 hover:text-t-2"
			>
				<Plus className="size-[14px]" />
			</Button>

			<div className="ml-auto flex shrink-0 items-center gap-2 pl-2 text-[11px] text-t-3">
				{extraRight}
				<Typography tag="span">{pagesSummary}</Typography>
			</div>
		</div>
	);
};
