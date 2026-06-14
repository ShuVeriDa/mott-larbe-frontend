"use client";

import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import {
	type ComponentProps,
	type ReactNode,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";

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

const SCROLL_STEP = 160;

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
	const scrollRef = useRef<HTMLDivElement>(null);
	const [canScrollLeft, setCanScrollLeft] = useState(false);
	const [canScrollRight, setCanScrollRight] = useState(false);

	const updateScrollState = useCallback(() => {
		const el = scrollRef.current;
		if (!el) return;
		setCanScrollLeft(el.scrollLeft > 0);
		setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
	}, []);

	useEffect(() => {
		const el = scrollRef.current;
		if (!el) return;
		updateScrollState();
		el.addEventListener("scroll", updateScrollState);
		const ro = new ResizeObserver(updateScrollState);
		ro.observe(el);
		return () => {
			el.removeEventListener("scroll", updateScrollState);
			ro.disconnect();
		};
	}, [updateScrollState]);

	useEffect(() => {
		updateScrollState();
	}, [pagesCount, updateScrollState]);

	const handleScrollLeft: NonNullable<ComponentProps<"button">["onClick"]> =
		() => {
			scrollRef.current?.scrollBy({ left: -SCROLL_STEP, behavior: "smooth" });
		};

	const handleScrollRight: NonNullable<ComponentProps<"button">["onClick"]> =
		() => {
			scrollRef.current?.scrollBy({ left: SCROLL_STEP, behavior: "smooth" });
		};

	const pageIndexes = Array.from({ length: pagesCount }, (_, index) => index);
	const showDelete = Boolean(onDeletePage) && pagesCount > 1;
	const handleAddPage: NonNullable<ComponentProps<"button">["onClick"]> = () =>
		onAddPage();

	return (
		<div
			className={`sticky ${stickyTopClassName} z-10 flex items-center border-b border-bd-1 bg-surf transition-colors`}
		>
			{canScrollLeft && (
				<Button
					size="bare"
					onClick={handleScrollLeft}
					className="flex h-full shrink-0 items-center justify-center border-r border-bd-1 px-1.5 text-t-3 hover:bg-surf-2 hover:text-t-2"
				>
					<ChevronLeft className="size-3.5" />
				</Button>
			)}

			<div
				ref={scrollRef}
				className="flex min-w-0 flex-1 items-center overflow-x-auto px-1.5 [scrollbar-width:none]"
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
								title={getPageLabel(index)}
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
			</div>

			{canScrollRight && (
				<Button
					size="bare"
					onClick={handleScrollRight}
					className="flex h-full shrink-0 items-center justify-center border-l border-bd-1 px-1.5 text-t-3 hover:bg-surf-2 hover:text-t-2"
				>
					<ChevronRight className="size-3.5" />
				</Button>
			)}

			<div className="flex shrink-0 items-center gap-2 border-l border-bd-1 px-3 text-[11px] text-t-3">
				{extraRight}
				<Typography tag="span">{pagesSummary}</Typography>
			</div>
		</div>
	);
};
