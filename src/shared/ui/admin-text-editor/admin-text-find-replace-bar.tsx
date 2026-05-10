"use client";

import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import {
	CaseSensitive,
	ChevronDown,
	ChevronUp,
	Replace,
	WholeWord,
	X,
} from "lucide-react";
import type {
	ChangeEvent,
	ComponentProps,
	KeyboardEvent,
	ReactNode,
	RefObject,
} from "react";

interface AdminTextFindReplaceBarProps {
	query: string;
	replacement: string;
	matchLabel: string | null;
	hasMatches: boolean;
	replacePanelOpen: boolean;
	matchCase: boolean;
	wholeWord: boolean;
	searchInputRef: RefObject<HTMLInputElement | null>;
	replacementInputRef: RefObject<HTMLInputElement | null>;
	charsPicker?: ReactNode;
	onQueryChange: (e: ChangeEvent<HTMLInputElement>) => void;
	onReplacementChange: (e: ChangeEvent<HTMLInputElement>) => void;
	onFindNext: () => void;
	onFindPrev: () => void;
	onReplaceActive: () => void;
	onReplaceAll: () => void;
	onClose: () => void;
	onKeyDown: (e: KeyboardEvent) => void;
	onToggleReplacePanel: () => void;
	onToggleMatchCase: () => void;
	onToggleWholeWord: () => void;
	onSearchFocus: () => void;
	onReplaceFocus: () => void;
}

const KbdChip = ({ children }: { children: string }) => (
	<kbd className="inline-flex items-center rounded-[4px] border border-bd-2 bg-surf px-[5px] py-px font-[inherit] text-[10px] font-medium text-t-2 shadow-[0_1px_0_0] shadow-bd-2">
		{children}
	</kbd>
);

export const AdminTextFindReplaceBar = ({
	query,
	replacement,
	matchLabel,
	hasMatches,
	replacePanelOpen,
	matchCase,
	wholeWord,
	searchInputRef,
	replacementInputRef,
	charsPicker,
	onQueryChange,
	onReplacementChange,
	onFindNext,
	onFindPrev,
	onReplaceActive,
	onReplaceAll,
	onClose,
	onKeyDown,
	onToggleReplacePanel,
	onToggleMatchCase,
	onToggleWholeWord,
	onSearchFocus,
	onReplaceFocus,
}: AdminTextFindReplaceBarProps) => {
	const { t } = useI18n();

	const handleFindPrevMouseDown: NonNullable<
		ComponentProps<typeof Button>["onMouseDown"]
	> = e => {
		e.preventDefault();
		onFindPrev();
	};

	const handleFindNextMouseDown: NonNullable<
		ComponentProps<typeof Button>["onMouseDown"]
	> = e => {
		e.preventDefault();
		onFindNext();
	};

	const handleCloseMouseDown: NonNullable<
		ComponentProps<typeof Button>["onMouseDown"]
	> = e => {
		e.preventDefault();
		onClose();
	};

	const handleReplaceActiveMouseDown: NonNullable<
		ComponentProps<typeof Button>["onMouseDown"]
	> = e => {
		e.preventDefault();
		onReplaceActive();
	};

	const handleReplaceAllMouseDown: NonNullable<
		ComponentProps<typeof Button>["onMouseDown"]
	> = e => {
		e.preventDefault();
		onReplaceAll();
	};

	const handleToggleReplaceMouseDown: NonNullable<
		ComponentProps<typeof Button>["onMouseDown"]
	> = e => {
		e.preventDefault();
		onToggleReplacePanel();
	};

	const handleToggleMatchCaseMouseDown: NonNullable<
		ComponentProps<typeof Button>["onMouseDown"]
	> = e => {
		e.preventDefault();
		onToggleMatchCase();
	};

	const handleToggleWholeWordMouseDown: NonNullable<
		ComponentProps<typeof Button>["onMouseDown"]
	> = e => {
		e.preventDefault();
		onToggleWholeWord();
	};

	const insetOptionBtnClass = (pressed: boolean) =>
		cn(
			"flex size-[26px] shrink-0 items-center justify-center rounded-[5px] text-t-2 transition-colors",
			pressed
				? "bg-acc-bg text-acc-t shadow-[inset_0_0_0_1px] shadow-acc/30"
				: "hover:bg-surf-3 hover:text-t-1",
		);

	const replaceOutlineBtnClass = (pressed: boolean) =>
		cn(
			"flex size-[30px] shrink-0 items-center justify-center rounded-base border border-bd-2 transition-colors",
			pressed
				? "border-acc/50 bg-acc-bg text-acc-t"
				: "text-t-2 hover:bg-surf-2 hover:text-t-1",
		);

	return (
		<div className="border-b border-bd-1 bg-surf px-4 py-3">
			<div className="flex gap-3">
				{/* Inputs column */}
				<div className="flex min-w-0 flex-1 flex-col gap-1.5">
					{/* Find / Replace — одна ширина колонки полей; справа — палочка + замена */}
					<div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-2 gap-y-1.5">
						<div className="relative col-start-1 row-start-1 min-w-0">
							<input
								ref={searchInputRef}
								type="text"
								value={query}
								onChange={onQueryChange}
								onKeyDown={onKeyDown}
								onFocus={onSearchFocus}
								placeholder={t(
									"admin.texts.createPage.findReplace.findPlaceholder",
								)}
								className={cn(
									"h-[30px] w-full rounded-base border border-bd-2 bg-surf py-0 pl-[10px] text-[12.5px] text-t-1 outline-none transition-colors placeholder:text-t-3 focus:border-acc",
									matchLabel ? "pr-48" : "pr-[4.5rem]",
								)}
							/>
							<div className="pointer-events-none absolute inset-y-0 right-2 flex flex-row-reverse items-center gap-1">
								{matchLabel ? (
									<span
										className={cn(
											"max-w-[7.25rem] shrink-0 truncate pl-1 text-right tabular-nums select-none text-[11px]",
											hasMatches ? "text-t-3" : "text-amb",
										)}
									>
										{matchLabel}
									</span>
								) : null}
								<div className="pointer-events-auto flex shrink-0 items-center gap-px">
									<Button
										size="bare"
										type="button"
										onMouseDown={handleToggleMatchCaseMouseDown}
										title={t(
											"admin.texts.createPage.findReplace.matchCaseTitle",
										)}
										aria-pressed={matchCase}
										aria-label={t(
											"admin.texts.createPage.findReplace.matchCaseTitle",
										)}
										className={insetOptionBtnClass(matchCase)}
									>
										<CaseSensitive className="size-[14px]" />
									</Button>
									<Button
										size="bare"
										type="button"
										onMouseDown={handleToggleWholeWordMouseDown}
										title={t(
											"admin.texts.createPage.findReplace.wholeWordTitle",
										)}
										aria-pressed={wholeWord}
										aria-label={t(
											"admin.texts.createPage.findReplace.wholeWordTitle",
										)}
										className={insetOptionBtnClass(wholeWord)}
									>
										<WholeWord className="size-[14px]" />
									</Button>
								</div>
							</div>
						</div>
						<div className="col-start-2 row-start-1 flex shrink-0 items-center justify-end gap-2">
							<Button
								size="bare"
								type="button"
								onMouseDown={handleToggleReplaceMouseDown}
								title={t(
									"admin.texts.createPage.findReplace.toggleReplaceTitle",
								)}
								aria-pressed={replacePanelOpen}
								aria-label={t(
									"admin.texts.createPage.findReplace.toggleReplaceTitle",
								)}
								className={replaceOutlineBtnClass(replacePanelOpen)}
							>
								<Replace className="size-[15px]" />
							</Button>
							{charsPicker}
						</div>
						{replacePanelOpen ? (
							<input
								ref={replacementInputRef}
								type="text"
								value={replacement}
								onChange={onReplacementChange}
								onKeyDown={onKeyDown}
								onFocus={onReplaceFocus}
								placeholder={t(
									"admin.texts.createPage.findReplace.replacePlaceholder",
								)}
								className="col-start-1 row-start-2 h-[30px] min-w-0 w-full rounded-base border border-bd-2 bg-surf px-[10px] text-[12.5px] text-t-1 outline-none transition-colors placeholder:text-t-3 focus:border-acc"
							/>
						) : null}
					</div>

					{/* Hints */}
					<div className="flex items-center gap-2.5 pt-px">
						<span className="flex items-center gap-1 text-[11px] text-t-3">
							<KbdChip>Enter</KbdChip>
							{t("admin.texts.createPage.findReplace.hintNext")}
						</span>
						<span className="h-3 w-px bg-bd-2" />
						<span className="flex items-center gap-1 text-[11px] text-t-3">
							<KbdChip>Shift+Enter</KbdChip>
							{t("admin.texts.createPage.findReplace.hintPrev")}
						</span>
						<span className="h-3 w-px bg-bd-2" />
						<span className="flex items-center gap-1 text-[11px] text-t-3">
							<KbdChip>Esc</KbdChip>
							{t("admin.texts.createPage.findReplace.hintClose")}
						</span>
					</div>
				</div>

				{/* Controls column */}
				<div className="flex shrink-0 flex-col gap-1.5">
					{/* Nav + close */}
					<div className="flex items-center gap-1">
						<div className="flex">
							<Button
								size="bare"
								type="button"
								title={t("admin.texts.createPage.findReplace.prevMatch")}
								onMouseDown={handleFindPrevMouseDown}
								disabled={!hasMatches}
								className="flex h-[30px] w-[30px] items-center justify-center rounded-l-base rounded-r-none border border-r-0 border-bd-2 text-t-2 transition-colors hover:bg-surf-2 hover:text-t-1 disabled:opacity-35"
							>
								<ChevronUp className="size-3" />
							</Button>
							<Button
								size="bare"
								type="button"
								title={t("admin.texts.createPage.findReplace.nextMatch")}
								onMouseDown={handleFindNextMouseDown}
								disabled={!hasMatches}
								className="flex h-[30px] w-[30px] items-center justify-center rounded-l-none rounded-r-base border border-bd-2 text-t-2 transition-colors hover:bg-surf-2 hover:text-t-1 disabled:opacity-35"
							>
								<ChevronDown className="size-3" />
							</Button>
						</div>
						<Button
							size="bare"
							type="button"
							title={t("admin.texts.createPage.findReplace.close")}
							onMouseDown={handleCloseMouseDown}
							className="flex h-[30px] w-[30px] items-center justify-center rounded-base border border-bd-2 text-t-3 transition-colors hover:bg-surf-2 hover:text-t-1"
						>
							<X className="size-3" />
						</Button>
					</div>

					{replacePanelOpen ? (
						<div className="flex flex-col gap-1">
							<Button
								size="bare"
								type="button"
								onMouseDown={handleReplaceActiveMouseDown}
								disabled={!hasMatches}
								className="h-[30px] rounded-base bg-acc px-3 text-[12px] font-semibold text-white transition-opacity hover:opacity-[0.88] disabled:opacity-35"
							>
								{t("admin.texts.createPage.findReplace.replace")}
							</Button>
							<Button
								size="bare"
								type="button"
								onMouseDown={handleReplaceAllMouseDown}
								disabled={!hasMatches}
								className="h-[30px] rounded-base border border-acc/30 bg-acc-bg px-3 text-[12px] font-medium text-acc-t transition-colors hover:border-acc/50 hover:bg-acc/10 disabled:opacity-35"
							>
								{t("admin.texts.createPage.findReplace.replaceAll")}
							</Button>
						</div>
					) : null}
				</div>
			</div>
		</div>
	);
};
