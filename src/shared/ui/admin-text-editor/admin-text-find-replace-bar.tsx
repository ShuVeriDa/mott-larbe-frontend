"use client";

import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import type { ChangeEvent, KeyboardEvent, RefObject } from "react";

interface AdminTextFindReplaceBarProps {
	query: string;
	replacement: string;
	matchLabel: string | null;
	hasMatches: boolean;
	searchInputRef: RefObject<HTMLInputElement | null>;
	onQueryChange: (e: ChangeEvent<HTMLInputElement>) => void;
	onReplacementChange: (e: ChangeEvent<HTMLInputElement>) => void;
	onFindNext: () => void;
	onFindPrev: () => void;
	onReplaceActive: () => void;
	onReplaceAll: () => void;
	onClose: () => void;
	onKeyDown: (e: KeyboardEvent) => void;
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
	searchInputRef,
	onQueryChange,
	onReplacementChange,
	onFindNext,
	onFindPrev,
	onReplaceActive,
	onReplaceAll,
	onClose,
	onKeyDown,
}: AdminTextFindReplaceBarProps) => {
	const { t } = useI18n();

	return (
		<div className="border-b border-bd-1 bg-surf px-4 py-3">
			<div className="flex gap-3">
				{/* Inputs column */}
				<div className="flex min-w-0 flex-1 flex-col gap-1.5">
					{/* Find */}
					<div className="relative">
						<input
							ref={searchInputRef}
							type="text"
							value={query}
							onChange={onQueryChange}
							onKeyDown={onKeyDown}
							placeholder={t("admin.texts.createPage.findReplace.findPlaceholder")}
							className="h-[30px] w-full rounded-base border border-bd-2 bg-surf pl-[10px] pr-16 text-[12.5px] text-t-1 outline-none transition-colors placeholder:text-t-3 focus:border-acc"
						/>
						{matchLabel && (
							<span
								className={`pointer-events-none absolute inset-y-0 right-2.5 flex items-center select-none tabular-nums text-[11px] ${
									hasMatches ? "text-t-3" : "text-amb"
								}`}
							>
								{matchLabel}
							</span>
						)}
					</div>

					{/* Replace */}
					<input
						type="text"
						value={replacement}
						onChange={onReplacementChange}
						onKeyDown={onKeyDown}
						placeholder={t("admin.texts.createPage.findReplace.replacePlaceholder")}
						className="h-[30px] w-full rounded-base border border-bd-2 bg-surf px-[10px] text-[12.5px] text-t-1 outline-none transition-colors placeholder:text-t-3 focus:border-acc"
					/>

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
								title={t("admin.texts.createPage.findReplace.prevMatch")}
								onMouseDown={onFindPrev}
								disabled={!hasMatches}
								className="flex h-[30px] w-[30px] items-center justify-center rounded-l-base rounded-r-none border border-r-0 border-bd-2 text-t-2 transition-colors hover:bg-surf-2 hover:text-t-1 disabled:opacity-35"
							>
								<ChevronUp className="size-3" />
							</Button>
							<Button
								size="bare"
								title={t("admin.texts.createPage.findReplace.nextMatch")}
								onMouseDown={onFindNext}
								disabled={!hasMatches}
								className="flex h-[30px] w-[30px] items-center justify-center rounded-l-none rounded-r-base border border-bd-2 text-t-2 transition-colors hover:bg-surf-2 hover:text-t-1 disabled:opacity-35"
							>
								<ChevronDown className="size-3" />
							</Button>
						</div>
						<Button
							size="bare"
							title={t("admin.texts.createPage.findReplace.close")}
							onMouseDown={onClose}
							className="flex h-[30px] w-[30px] items-center justify-center rounded-base border border-bd-2 text-t-3 transition-colors hover:bg-surf-2 hover:text-t-1"
						>
							<X className="size-3" />
						</Button>
					</div>

					{/* Replace buttons */}
					<div className="flex flex-col gap-1">
						<Button
							size="bare"
							onMouseDown={onReplaceActive}
							disabled={!hasMatches}
							className="h-[30px] rounded-base bg-acc px-3 text-[12px] font-semibold text-white transition-opacity hover:opacity-[0.88] disabled:opacity-35"
						>
							{t("admin.texts.createPage.findReplace.replace")}
						</Button>
						<Button
							size="bare"
							onMouseDown={onReplaceAll}
							disabled={!hasMatches}
							className="h-[30px] rounded-base border border-acc/30 bg-acc-bg px-3 text-[12px] font-medium text-acc-t transition-colors hover:border-acc/50 hover:bg-acc/10 disabled:opacity-35"
						>
							{t("admin.texts.createPage.findReplace.replaceAll")}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};
