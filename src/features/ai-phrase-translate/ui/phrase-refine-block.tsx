"use client";

import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { MessageSquare, Send } from "lucide-react";
import { useState, type ChangeEvent, type KeyboardEvent } from "react";
import type { AiPhraseRefineState } from "../model/use-ai-phrase-translate";

interface PhraseRefineBlockProps {
	refineState: AiPhraseRefineState;
	onOpen: () => void;
	onSubmit: (hint: string) => void;
}

export const PhraseRefineBlock = ({
	refineState,
	onOpen,
	onSubmit,
}: PhraseRefineBlockProps) => {
	const { t } = useI18n();
	const [hint, setHint] = useState("");

	const handleHintChange = (e: ChangeEvent<HTMLTextAreaElement>) =>
		setHint(e.currentTarget.value);

	const handleSubmit = () => {
		if (!hint.trim()) return;
		onSubmit(hint.trim());
	};

	const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleSubmit();
	};

	if (refineState.phase === "idle") {
		return (
			<div className="border-t-[0.5px] border-bd-1 px-3.5 py-2">
				<Button
					size="bare"
					variant="bare"
					onClick={onOpen}
					className="flex items-center gap-1.5 text-[11.5px] text-t-3 transition-colors hover:text-t-1"
				>
					<MessageSquare className="size-3" strokeWidth={1.5} />
					{t("aiTranslation.phrase.refine")}
				</Button>
			</div>
		);
	}

	if (refineState.phase === "open" || refineState.phase === "loading") {
		const isLoading = refineState.phase === "loading";
		return (
			<div className="border-t-[0.5px] border-bd-1 px-3.5 py-2.5">
				<div className="mb-1.5 flex items-center gap-1 text-[11px] font-medium text-t-2">
					<MessageSquare className="size-3" strokeWidth={1.5} />
					{t("aiTranslation.phrase.refine")}
				</div>
				<textarea
					value={hint}
					onChange={handleHintChange}
					onKeyDown={handleKeyDown}
					placeholder={t("aiTranslation.phrase.refinePlaceholder")}
					disabled={isLoading}
					rows={2}
					className="w-full resize-none rounded-[6px] border border-[0.5px] border-bd-2 bg-surf-2 px-2.5 py-1.5 text-[12px] text-t-1 placeholder:text-t-4 focus:border-acc focus:outline-none disabled:opacity-50"
				/>
				<div className="mt-1.5 flex justify-end">
					<Button
						size="bare"
						onClick={handleSubmit}
						disabled={isLoading || !hint.trim()}
						className="flex h-7 items-center gap-1.5 rounded-[6px] bg-acc px-3 text-[12px] font-medium text-white disabled:opacity-50"
					>
						{isLoading ? (
							<div className="size-3 animate-spin rounded-full border border-white/40 border-t-white" />
						) : (
							<Send className="size-3" strokeWidth={1.5} />
						)}
						{t("aiTranslation.phrase.refineSubmit")}
					</Button>
				</div>
			</div>
		);
	}

	if (refineState.phase === "error") {
		return (
			<div className="border-t-[0.5px] border-bd-1 px-3.5 py-2.5">
				<p className="text-[12px] text-red-t">
					{t("aiTranslation.phrase.refineError")}
				</p>
			</div>
		);
	}

	// done
	return (
		<div className="border-t-[0.5px] border-bd-1 bg-pur-bg/40 px-3.5 py-2.5">
			<div className="mb-1 flex items-center gap-1 text-[10.5px] font-semibold uppercase tracking-[0.4px] text-pur-t">
				<MessageSquare className="size-2.5" strokeWidth={1.8} />
				{t("aiTranslation.phrase.refineResult")}
			</div>
			<div className="text-[13.5px] font-medium text-t-1">
				{refineState.result.translation}
			</div>
			{refineState.result.notes && (
				<div className="mt-1 text-[11.5px] text-t-3">
					{refineState.result.notes}
				</div>
			)}
		</div>
	);
};
