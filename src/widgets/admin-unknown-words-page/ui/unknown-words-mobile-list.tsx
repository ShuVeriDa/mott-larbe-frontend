"use client";

import { useI18n } from "@/shared/lib/i18n";
import type { UnknownWordListItem } from "@/entities/unknown-word";
import type { useUnknownWordMutations } from "@/entities/unknown-word/model/use-unknown-word-mutations";
import { CountBadge } from "./unknown-words-count-badge";
import { formatShortDate } from "../lib/format-date";

interface UnknownWordsMobileListProps {
	words: UnknownWordListItem[];
	mutations: ReturnType<typeof useUnknownWordMutations>;
	isLoading: boolean;
	onAddToDictionary: (word: UnknownWordListItem) => void;
}

export const UnknownWordsMobileList = ({
	words,
	mutations,
	isLoading,
	onAddToDictionary,
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
			{words.map((word) => (
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

					{word.snippet && (
						<div
							className="mb-2 line-clamp-2 text-[12px] leading-[1.5] text-t-2"
							dangerouslySetInnerHTML={{ __html: word.snippet }}
						/>
					)}

					<div className="flex items-center justify-between gap-2">
						<div className="text-[11px] text-t-3">
							{word.texts?.[0] && (
								<span>«{word.texts[0].title}»</span>
							)}
							{word.lastSeen && (
								<span className="ml-1">· {formatShortDate(word.lastSeen)}</span>
							)}
						</div>
						<div className="flex gap-1">
							<button
								type="button"
								onClick={() => onAddToDictionary(word)}
								className="flex size-[30px] cursor-pointer items-center justify-center rounded-md border-none bg-transparent text-t-3 transition-colors hover:bg-acc-bg hover:text-acc-t"
								title={t("admin.unknownWords.row.addToDictionary")}
							>
								<svg width="14" height="14" viewBox="0 0 16 16" fill="none">
									<path
										d="M8 3v10M3 8h10"
										stroke="currentColor"
										strokeWidth="1.4"
										strokeLinecap="round"
									/>
								</svg>
							</button>
							<button
								type="button"
								onClick={() => mutations.remove.mutate(word.id)}
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
			))}
		</div>
	);
};
