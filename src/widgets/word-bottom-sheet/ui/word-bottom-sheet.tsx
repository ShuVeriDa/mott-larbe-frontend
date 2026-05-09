"use client";

import { Typography } from "@/shared/ui/typography";

import { Button } from "@/shared/ui/button";
import { useEffect } from 'react';
import { createPortal } from "react-dom";
import { Plus, X } from "lucide-react";
import type { TextToken } from "@/entities/text";
import { useWordLookup, type WordLookupResponse } from "@/entities/word";
import {
	useAddToVocabulary,
	useRemoveFromVocabulary,
} from "@/features/add-to-vocabulary";
import { LearnStatusRow } from "@/features/learn-status";
import { useWordLookupStore } from "@/features/word-lookup";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { useToast } from "@/shared/lib/toast";

const SheetContent = ({
	token,
	lookup,
	textId,
	onClose,
}: {
	token: TextToken;
	lookup: WordLookupResponse;
	textId: string;
	onClose: () => void;
}) => {
	const { t } = useI18n();
	const { success, error } = useToast();
	const { mutate: add, isPending: adding } = useAddToVocabulary();
	const { mutate: remove, isPending: removing } = useRemoveFromVocabulary();
	const isPending = adding || removing;

	const onPrimary = () => {
		if (lookup.inDictionary && lookup.dictionaryEntryId) {
			remove(
				{ dictionaryEntryId: lookup.dictionaryEntryId, tokenId: token.id },
				{
					onSuccess: () => success(t("reader.toasts.removedFromDict")),
					onError: () => error(t("reader.toasts.dictFailed")),
				},
			);
			return;
		}
		add(
			{ tokenId: token.id },
			{
				onSuccess: () => success(t("reader.toasts.addedToDict")),
				onError: () => error(t("reader.toasts.dictFailed")),
			},
		);
	};

	return (
		<div className="flex max-h-[85vh] flex-col">
			<div className="flex justify-center pt-2.5 pb-1.5">
				<div className="h-1 w-9 rounded-full bg-surf-4" />
			</div>
			<div className="flex-1 overflow-y-auto">
				<div className="border-b border-hairline border-bd-1 px-4 pb-3.5">
					<div className="mb-1 font-display text-[22px] font-semibold tracking-[-0.3px] text-t-1">
						{token.text}
					</div>
					<div className="text-[12px] text-t-3">
						{t("reader.panel.baseForm")}:{" "}
						<Typography tag="strong" className="font-medium text-t-2">{lookup.baseForm}</Typography>
					</div>
				</div>
				<div className="border-b border-hairline border-bd-1 px-4 py-3.5">
					<div className="mb-1 text-[16px] font-medium text-t-1">
						{lookup.translation}
					</div>
					{lookup.tranAlt ? (
						<div className="text-[13px] leading-[1.5] text-t-3">
							{lookup.tranAlt}
						</div>
					) : null}
				</div>
				{lookup.tags.length > 0 ? (
					<div className="flex flex-wrap gap-1 border-b border-hairline border-bd-1 px-4 py-2.5">
						{lookup.tags.map((tag) => (
							<Typography tag="span"
								key={tag}
								className="rounded-[5px] border-hairline border-bd-1 bg-surf-2 px-2 py-0.5 text-[10.5px] font-medium text-t-2"
							>
								{tag}
							</Typography>
						))}
					</div>
				) : null}
				<div className="border-b border-hairline border-bd-1 px-4 py-3.5">
					<div className="mb-2 text-[10.5px] font-semibold uppercase tracking-[0.6px] text-t-3">
						{t("reader.panel.sections.level")}
					</div>
					<LearnStatusRow
						lemmaId={lookup.lemmaId}
						tokenId={token.id}
						textId={textId}
						current={lookup.userStatus}
					/>
				</div>
			</div>
			<div className="flex shrink-0 gap-2 px-4 pt-3 pb-[max(16px,env(safe-area-inset-bottom))]">
				<Button
					onClick={onPrimary}
					disabled={isPending}
					className={cn(
						"flex h-11 flex-1 items-center justify-center gap-1.5 rounded-[10px] text-[14px] font-semibold text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-60",
						lookup.inDictionary ? "bg-grn" : "bg-acc",
					)}
				>
					<Plus className="size-3.5" strokeWidth={1.8} />
					{lookup.inDictionary
						? t("reader.popup.inDictionary")
						: t("reader.popup.addToDictionary")}
				</Button>
				<Button
					onClick={onClose}
					aria-label={t("reader.sheet.close")}
					className="inline-flex h-11 items-center justify-center gap-1.5 rounded-[10px] border-hairline border-bd-2 bg-surf-2 px-4 text-[14px] font-semibold text-t-2"
				>
					<X className="size-4" strokeWidth={1.6} />
					{t("reader.sheet.close")}
				</Button>
			</div>
		</div>
	);
};

export const WordBottomSheet = ({ textId }: { textId: string }) => {
	const { t } = useI18n();
	const surface = useWordLookupStore((s) => s.surface);
	const token = useWordLookupStore((s) => s.activeToken);
	const closeSheet = useWordLookupStore((s) => s.closeSheet);

	const isVisible = surface === "sheet" && Boolean(token);

	const { data, isLoading } = useWordLookup(
		isVisible && token ? token.id : null,
	);

	useEffect(() => {
		if (!isVisible) return;
		const onKey = (event: KeyboardEvent) => {
			if (event.key === "Escape") closeSheet();
		};
		document.addEventListener("keydown", onKey);
		const prev = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			document.removeEventListener("keydown", onKey);
			document.body.style.overflow = prev;
		};
	}, [isVisible, closeSheet]);

	if (!isVisible || !token || typeof window === "undefined") return null;

	return createPortal(
		<>
			<div
				className="fixed inset-0 z-[180] bg-black/40"
				onClick={closeSheet}
				aria-hidden="true"
			/>
			<div
				role="dialog"
				aria-label={token.text}
				aria-modal="true"
				className="fixed inset-x-0 bottom-0 z-[190] rounded-t-2xl border-t border-hairline border-bd-2 bg-surf shadow-lg animate-[fadeUp_0.25s_ease]"
			>
				{isLoading || !data ? (
					<div className="flex flex-col items-center justify-center gap-2 p-6">
						<div className="size-[18px] animate-spin rounded-full border-2 border-surf-3 border-t-acc" />
						<div className="text-[12px] text-t-3">
							{t("reader.popup.loading")}
						</div>
					</div>
				) : (
					<SheetContent
						token={token}
						lookup={data}
						textId={textId}
						onClose={closeSheet}
					/>
				)}
			</div>
		</>,
		document.body,
	);
};
