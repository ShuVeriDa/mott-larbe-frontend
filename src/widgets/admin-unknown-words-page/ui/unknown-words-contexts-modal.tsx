"use client";

import { useI18n } from "@/shared/lib/i18n";
import { useAdminUnknownWordContexts } from "@/entities/admin-unknown-word";
import type { ContextsModalState } from "../model/use-admin-unknown-words-page";

interface UnknownWordsContextsModalProps {
	state: ContextsModalState;
	onClose: () => void;
}

export const UnknownWordsContextsModal = ({
	state,
	onClose,
}: UnknownWordsContextsModalProps) => {
	const { t } = useI18n();
	const { data, isLoading } = useAdminUnknownWordContexts(state?.wordId ?? null);

	if (!state) return null;

	return (
		<div
			className="fixed inset-0 z-200 flex items-center justify-center bg-black/35 p-4 backdrop-blur-sm max-sm:items-end max-sm:p-0"
			onClick={(e) => e.target === e.currentTarget && onClose()}
		>
			<div className="flex w-full max-w-[600px] max-h-[calc(100vh-32px)] flex-col rounded-[14px] border border-bd-2 bg-surf shadow-[0_4px_12px_rgba(0,0,0,0.08)] animate-[modal-in_0.15s_ease] max-sm:max-w-full max-sm:rounded-t-[18px] max-sm:rounded-b-none max-sm:max-h-[92vh]">
				{/* Header */}
				<div className="flex shrink-0 items-center justify-between border-b border-bd-1 px-5 py-3.5">
					<div>
						<div className="font-display text-[15px] text-t-1">
							{t("admin.unknownWords.contextsModal.title")}
						</div>
						<div className="mt-0.5 flex items-center gap-1.5 text-[11.5px] text-t-3">
							<span className="font-display font-semibold text-t-2">{state.word}</span>
							{data && (
								<>
									<span>·</span>
									<span>
										{t("admin.unknownWords.contextsModal.occurrences", {
											count: data.total,
										})}
									</span>
								</>
							)}
						</div>
					</div>
					<button
						type="button"
						onClick={onClose}
						className="flex size-7 cursor-pointer items-center justify-center rounded-md border-none bg-transparent text-t-3 transition-colors hover:bg-surf-2 hover:text-t-2"
					>
						<svg width="14" height="14" viewBox="0 0 16 16" fill="none">
							<path
								d="M4 4l8 8M12 4l-8 8"
								stroke="currentColor"
								strokeWidth="1.4"
								strokeLinecap="round"
							/>
						</svg>
					</button>
				</div>

				{/* Body */}
				<div className="flex flex-col gap-2.5 overflow-y-auto p-5 [&::-webkit-scrollbar]:w-0">
					{isLoading ? (
						Array.from({ length: 4 }).map((_, i) => (
							<div key={i} className="rounded-lg border border-bd-1 bg-surf-2 p-3">
								<div className="mb-2 h-3 w-3/4 animate-pulse rounded bg-surf-3" />
								<div className="h-2.5 w-1/3 animate-pulse rounded bg-surf-3" />
							</div>
						))
					) : !data?.contexts.length ? (
						<div className="py-8 text-center text-[13px] text-t-3">
							{t("admin.unknownWords.contextsModal.empty")}
						</div>
					) : (
						data.contexts.map((ctx, i) => (
							<div
								key={`${ctx.tokenId}-${i}`}
								className="rounded-lg border border-bd-1 bg-surf-2 p-3"
							>
								<p className="text-[13px] leading-[1.65] text-t-2">
									{ctx.snippet}
								</p>
								<div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-t-3">
									<span>«{ctx.textTitle}»</span>
									{ctx.pageNumber != null && (
										<>
											<span>·</span>
											<span>
												{t("admin.unknownWords.contextsModal.page", {
													n: ctx.pageNumber,
												})}
											</span>
										</>
									)}
								</div>
							</div>
						))
					)}
				</div>
			</div>
		</div>
	);
};
