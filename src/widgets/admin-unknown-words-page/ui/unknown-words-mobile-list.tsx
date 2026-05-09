"use client";

import { ComponentProps } from 'react';
import { useI18n } from "@/shared/lib/i18n";
import type { UnknownWordItem } from "@/entities/admin-unknown-word";
import type { useAdminUnknownWordMutations } from "@/entities/admin-unknown-word/model/use-admin-unknown-word-mutations";
import { CountBadge } from "./unknown-words-count-badge";
import { formatShortDate } from "../lib/format-date";

interface UnknownWordsMobileListProps {
	words: UnknownWordItem[];
	mutations: ReturnType<typeof useAdminUnknownWordMutations>;
	isLoading: boolean;
	onAddToDictionary: (word: UnknownWordItem) => void;
	onLinkToLemma: (word: UnknownWordItem) => void;
	onViewContexts: (word: UnknownWordItem) => void;
}

export const UnknownWordsMobileList = ({
	words,
	mutations,
	isLoading,
	onAddToDictionary,
	onLinkToLemma,
	onViewContexts,
}: UnknownWordsMobileListProps) => {
	const { t } = useI18n();

	if (isLoading) {
		return (
			<div className="hidden max-sm:block">
				{Array.from({ length: 5 }).map((_, i) => (
					<div key={i} className="border-b border-bd-1 px-3.5 py-3.5 last:border-b-0">
						<div className="mb-2 flex items-start gap-2.5">
							<div className="h-4 w-24 animate-pulse rounded bg-surf-3" />
							<div className="ml-auto h-5 w-6 animate-pulse rounded bg-surf-3" />
						</div>
						<div className="mb-2 h-3 w-full animate-pulse rounded bg-surf-3" />
						<div className="h-3 w-3/4 animate-pulse rounded bg-surf-3" />
					</div>
				))}
			</div>
		);
	}

	return (
		<div className="hidden max-sm:block">
			{words.map((word) => {
			  const handleClick: NonNullable<ComponentProps<"button">["onClick"]> = () => onAddToDictionary(word);
			  const handleClick2: NonNullable<ComponentProps<"button">["onClick"]> = () => onLinkToLemma(word);
			  const handleClick3: NonNullable<ComponentProps<"button">["onClick"]> = () => onViewContexts(word);
			  const handleClick4: NonNullable<ComponentProps<"button">["onClick"]> = () => mutations.remove.mutate(word.id);
			  return (
				<div key={word.id} className="border-b border-bd-1 px-3.5 py-3.5 last:border-b-0">
					<div className="mb-2 flex items-start gap-2.5">
						<div className="min-w-0 flex-1">
							<div className="font-display text-[15px] font-semibold text-t-1">
								{word.word}
							</div>
							{word.normalized !== word.word && (
								<div className="mt-0.5 text-[11px] text-t-3">
									{t("admin.unknownWords.addModal.normalizedLabel")}: {word.normalized}
								</div>
							)}
						</div>
						<CountBadge count={word.seenCount} />
					</div>

					{word.firstContext?.snippet && (
						<div className="mb-2 line-clamp-2 text-[12px] leading-relaxed text-t-2">
							{word.firstContext.snippet}
						</div>
					)}

					<div className="flex items-center justify-between gap-2">
						<div className="text-[11px] text-t-3">
							{word.firstContext?.textTitle && (
								<span>«{word.firstContext.textTitle}»</span>
							)}
							{word.lastSeen && (
								<span className="ml-1">· {formatShortDate(word.lastSeen)}</span>
							)}
						</div>
						<div className="flex gap-1">
							<button
								type="button"
								onClick={handleClick}
								className="flex size-[30px] cursor-pointer items-center justify-center rounded-md border-none bg-transparent text-t-3 transition-colors hover:bg-acc-bg hover:text-acc-t"
								title={t("admin.unknownWords.row.addToDictionary")}
							>
								<svg width="14" height="14" viewBox="0 0 16 16" fill="none">
									<path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
								</svg>
							</button>
							<button
								type="button"
								onClick={handleClick2}
								className="flex size-[30px] cursor-pointer items-center justify-center rounded-md border-none bg-transparent text-t-3 transition-colors hover:bg-surf-2 hover:text-t-2"
								title={t("admin.unknownWords.row.linkToLemma")}
							>
								<svg width="14" height="14" viewBox="0 0 16 16" fill="none">
									<circle cx="8" cy="8" r="5" stroke="currentColor" strokeWidth="1.4" />
									<path d="M9 9.5L8 8V5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
								</svg>
							</button>
							<button
								type="button"
								onClick={handleClick3}
								className="flex size-[30px] cursor-pointer items-center justify-center rounded-md border-none bg-transparent text-t-3 transition-colors hover:bg-surf-2 hover:text-t-2"
								title={t("admin.unknownWords.row.allContexts")}
							>
								<svg width="14" height="14" viewBox="0 0 16 16" fill="none">
									<rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.4" />
									<path d="M5 6h6M5 9h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
								</svg>
							</button>
							<button
								type="button"
								onClick={handleClick4}
								disabled={mutations.remove.isPending}
								className="flex size-[30px] cursor-pointer items-center justify-center rounded-md border-none bg-transparent text-t-3 transition-colors hover:bg-red-bg hover:text-red-t disabled:opacity-50"
								title={t("admin.unknownWords.row.delete")}
							>
								<svg width="14" height="14" viewBox="0 0 16 16" fill="none">
									<path
										d="M3 5h10M5 5V4a1 1 0 011-1h4a1 1 0 011 1v1M6 8v4M10 8v4"
										stroke="currentColor"
										strokeWidth="1.4"
										strokeLinecap="round"
									/>
									<path
										d="M4 5l.7 7.5A1 1 0 005.7 13h4.6a1 1 0 001-.95L12 5"
										stroke="currentColor"
										strokeWidth="1.4"
										strokeLinecap="round"
									/>
								</svg>
							</button>
						</div>
					</div>
				</div>
			);
			})}
		</div>
	);
};
