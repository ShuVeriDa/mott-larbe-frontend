"use client";

import { useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { ExternalLink, Plus } from "lucide-react";
import type { TextToken } from "@/entities/text";
import { useWordLookup, type WordLookupResponse } from "@/entities/word";
import {
	useAddToVocabulary,
	useRemoveFromVocabulary,
} from "@/features/add-to-vocabulary";
import {
	useWordLookupStore,
	type PopupAnchor,
} from "@/features/word-lookup";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { useToast } from "@/shared/lib/toast";

const POPUP_WIDTH = 264;
const ESTIMATED_HEIGHT = 220;
const SAFE_MARGIN = 10;

const computePosition = (anchor: PopupAnchor) => {
	if (typeof window === "undefined") return { left: 0, top: 0 };
	let left = anchor.left + anchor.width / 2 - POPUP_WIDTH / 2;
	let top = anchor.top + anchor.height + 8;
	left = Math.max(
		SAFE_MARGIN,
		Math.min(left, window.innerWidth - POPUP_WIDTH - SAFE_MARGIN),
	);
	if (top + ESTIMATED_HEIGHT > window.innerHeight - SAFE_MARGIN) {
		top = anchor.top - ESTIMATED_HEIGHT - 8;
	}
	return { left, top };
};

const PopupBody = ({
	token,
	lookup,
	onOpenInPanel,
}: {
	token: TextToken;
	lookup: WordLookupResponse;
	onOpenInPanel: () => void;
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
		<>
			<div className="border-b border-hairline border-bd-1 px-3.5 pt-3.5 pb-2.5">
				<div className="mb-1 text-[17px] font-semibold tracking-[-0.2px] text-t-1">
					{token.text}
				</div>
				<div className="text-[11.5px] text-t-3">
					{t("reader.panel.baseForm")}:{" "}
					<strong className="font-medium text-t-2">{lookup.baseForm}</strong>
				</div>
			</div>
			<div className="border-b border-hairline border-bd-1 px-3.5 py-2.5">
				<div className="mb-1 text-[14px] font-medium text-t-1">
					{lookup.translation}
				</div>
				{lookup.tranAlt ? (
					<div className="text-[12px] leading-[1.5] text-t-3">
						{lookup.tranAlt}
					</div>
				) : null}
			</div>
			{lookup.tags.length > 0 ? (
				<div className="flex flex-wrap gap-1 border-b border-hairline border-bd-1 px-3.5 py-2">
					{lookup.tags.slice(0, 3).map((tag) => (
						<span
							key={tag}
							className="rounded-[4px] border-hairline border-bd-1 bg-surf-2 px-[7px] py-0.5 text-[10.5px] font-medium text-t-2"
						>
							{tag}
						</span>
					))}
				</div>
			) : null}
			<div className="flex gap-1.5 p-2.5">
				<button
					type="button"
					onClick={onPrimary}
					disabled={isPending}
					className={cn(
						"flex h-[30px] flex-1 items-center justify-center gap-1.5 rounded-base text-[11.5px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60",
						lookup.inDictionary ? "bg-grn" : "bg-acc",
					)}
				>
					<Plus className="size-3" strokeWidth={1.8} />
					{lookup.inDictionary
						? t("reader.popup.inDictionary")
						: t("reader.popup.addToDictionary")}
				</button>
				<button
					type="button"
					onClick={onOpenInPanel}
					aria-label={t("reader.popup.openPanel")}
					className="inline-flex h-[30px] w-[30px] items-center justify-center rounded-base border-hairline border-bd-1 bg-surf-2 text-t-2 transition-colors hover:border-bd-2 hover:bg-surf-3 hover:text-t-1"
				>
					<ExternalLink className="size-3.5" strokeWidth={1.4} />
				</button>
			</div>
		</>
	);
};

export const WordPopup = () => {
	const { t } = useI18n();
	const surface = useWordLookupStore((s) => s.surface);
	const token = useWordLookupStore((s) => s.activeToken);
	const anchor = useWordLookupStore((s) => s.anchor);
	const closePopup = useWordLookupStore((s) => s.closePopup);
	const openInPanel = useWordLookupStore((s) => s.openInPanel);
	const isVisible = surface === "popup" && Boolean(token) && Boolean(anchor);

	const { data, isLoading } = useWordLookup(
		isVisible && token ? token.id : null,
	);

	const position = useMemo(
		() => (anchor ? computePosition(anchor) : { left: 0, top: 0 }),
		[anchor],
	);

	useEffect(() => {
		if (!isVisible) return;
		const onKey = (event: KeyboardEvent) => {
			if (event.key === "Escape") closePopup();
		};
		document.addEventListener("keydown", onKey);
		return () => document.removeEventListener("keydown", onKey);
	}, [isVisible, closePopup]);

	if (!isVisible || !token || typeof window === "undefined") return null;

	const onOpenInPanel = () => {
		openInPanel(token);
	};

	return createPortal(
		<>
			<div
				className="fixed inset-0 z-[199]"
				onClick={closePopup}
				aria-hidden="true"
			/>
			<div
				role="dialog"
				aria-label={token.text}
				className="fixed z-[200] w-[264px] overflow-hidden rounded-card border-hairline border-bd-2 bg-surf shadow-lg"
				style={{ left: position.left, top: position.top }}
			>
				{isLoading || !data ? (
					<div className="flex flex-col items-center justify-center gap-2 p-6">
						<div className="size-[18px] animate-spin rounded-full border-2 border-surf-3 border-t-acc" />
						<div className="text-[12px] text-t-3">
							{t("reader.popup.loading")}
						</div>
					</div>
				) : (
					<PopupBody
						token={token}
						lookup={data}
						onOpenInPanel={onOpenInPanel}
					/>
				)}
			</div>
		</>,
		document.body,
	);
};
