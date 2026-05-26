"use client";

import { Typography } from "@/shared/ui/typography";
import { Button } from "@/shared/ui/button";
import { Modal } from "@/shared/ui/modal";
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

	return (
		<Modal
			open={!!state}
			onClose={onClose}
			title={
				<>
					{t("admin.unknownWords.contextsModal.title")}
					{state && (
						<span className="ml-2 text-[12px] font-normal text-t-3">
							<span className="font-display font-semibold text-t-2">{state.word}</span>
							{data && (
								<>
									{" · "}
									{t("admin.unknownWords.contextsModal.occurrences", { count: data.total })}
								</>
							)}
						</span>
					)}
				</>
			}
			className="max-w-[600px]"
		>
			<div className="flex flex-col gap-2.5">
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
							<Typography tag="p" className="text-[13px] leading-[1.65] text-t-2">
								{ctx.snippet}
							</Typography>
							<div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-t-3">
								<Typography tag="span">«{ctx.textTitle}»</Typography>
								{ctx.pageNumber != null && (
									<>
										<Typography tag="span">·</Typography>
										<Typography tag="span">
											{t("admin.unknownWords.contextsModal.page", { n: ctx.pageNumber })}
										</Typography>
									</>
								)}
							</div>
						</div>
					))
				)}
			</div>
		</Modal>
	);
};
