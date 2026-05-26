"use client";

import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { MessageSquare, Send } from "lucide-react";
import { useState, type ChangeEvent, type KeyboardEvent } from "react";
import type { AiWordRefineState } from "../model/use-ai-word-refine";

interface WordRefineBlockProps {
	refineState: AiWordRefineState;
	size: "sm" | "md";
	onOpen: () => void;
	onSubmit: (hint: string) => void;
}

export const WordRefineBlock = ({
	refineState,
	size,
	onOpen,
	onSubmit,
}: WordRefineBlockProps) => {
	const { t } = useI18n();
	const [hint, setHint] = useState("");

	const isSm = size === "sm";

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
			<div
				className={
					isSm
						? "border-t border-[0.5px] border-bd-1 px-3.5 py-2"
						: "border-t border-bd-1 px-4 py-2.5"
				}
			>
				<Button
					size="bare"
					onClick={onOpen}
					className={`flex items-center gap-1.5 text-t-3 transition-colors hover:text-t-1 ${isSm ? "text-[11.5px]" : "text-[13px]"}`}
				>
					<MessageSquare
						className={isSm ? "size-3" : "size-3.5"}
						strokeWidth={1.5}
					/>
					{t("aiTranslation.phrase.refine")}
				</Button>
			</div>
		);
	}

	if (refineState.phase === "open" || refineState.phase === "loading") {
		const isLoading = refineState.phase === "loading";
		return (
			<div
				className={
					isSm
						? "border-t border-[0.5px] border-bd-1 px-3.5 py-2.5"
						: "border-t border-bd-1 px-4 py-3"
				}
			>
				<div
					className={`mb-1.5 flex items-center gap-1 font-medium text-t-2 ${isSm ? "text-[11px]" : "text-[12px]"}`}
				>
					<MessageSquare
						className={isSm ? "size-3" : "size-3.5"}
						strokeWidth={1.5}
					/>
					{t("aiTranslation.phrase.refine")}
				</div>
				<textarea
					value={hint}
					onChange={handleHintChange}
					onKeyDown={handleKeyDown}
					placeholder={t("aiTranslation.phrase.refinePlaceholder")}
					disabled={isLoading}
					rows={2}
					className={`w-full resize-none rounded-[6px] border border-[0.5px] border-bd-2 bg-surf-2 px-2.5 py-1.5 text-t-1 placeholder:text-t-4 focus:border-acc focus:outline-none disabled:opacity-50 ${isSm ? "text-[12px]" : "text-[13px]"}`}
				/>
				<div className="mt-1.5 flex justify-end">
					<Button
						size="bare"
						onClick={handleSubmit}
						disabled={isLoading || !hint.trim()}
						className={`flex items-center gap-1.5 rounded-[6px] bg-acc font-medium text-white disabled:opacity-50 ${isSm ? "h-7 px-3 text-[12px]" : "h-8 px-3.5 text-[13px]"}`}
					>
						{isLoading ? (
							<div className="size-3 animate-spin rounded-full border border-white/40 border-t-white" />
						) : (
							<Send
								className={isSm ? "size-3" : "size-3.5"}
								strokeWidth={1.5}
							/>
						)}
						{t("aiTranslation.phrase.refineSubmit")}
					</Button>
				</div>
			</div>
		);
	}

	if (refineState.phase === "error") {
		return (
			<div
				className={
					isSm
						? "border-t border-[0.5px] border-bd-1 px-3.5 py-2.5"
						: "border-t border-bd-1 px-4 py-3"
				}
			>
				<p className={`text-red-t ${isSm ? "text-[12px]" : "text-[13px]"}`}>
					{t("aiTranslation.phrase.refineError")}
				</p>
			</div>
		);
	}

	// done
	return (
		<div
			className={`border-t bg-pur-bg/40 ${isSm ? "border-[0.5px] border-bd-1 px-3.5 py-2.5" : "border-bd-1 px-4 py-3"}`}
		>
			<div
				className={`mb-1 flex items-center gap-1 font-semibold uppercase tracking-[0.4px] text-pur-t ${isSm ? "text-[10.5px]" : "text-[11px]"}`}
			>
				<MessageSquare
					className={isSm ? "size-2.5" : "size-3"}
					strokeWidth={1.8}
				/>
				{t("aiTranslation.phrase.refineResult")}
			</div>
			<div
				className={`font-medium text-t-1 ${isSm ? "text-[13.5px]" : "text-[15px]"}`}
			>
				{refineState.result.translation}
			</div>
			{refineState.result.notes && (
				<div
					className={`mt-1 text-t-3 ${isSm ? "text-[11.5px]" : "text-[12px]"}`}
				>
					{refineState.result.notes}
				</div>
			)}
		</div>
	);
};
