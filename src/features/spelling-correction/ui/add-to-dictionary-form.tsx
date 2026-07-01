"use client";

import type { CorrectFormNode, SpellingMatchType } from "@/entities/spelling-dictionary";
import { serializeCorrectForm } from "@/entities/spelling-dictionary";
import { spring, variants } from "@/shared/lib/animation";
import { useI18n } from "@/shared/lib/i18n";
import { cn } from "@/shared/lib/cn";
import { CorrectFormEditor } from "@/shared/ui/correct-form-editor";
import type { Editor } from "@tiptap/react";
import { motion } from "framer-motion";
import { ArrowRight, Check, Loader2, X } from "lucide-react";
import { useEffect } from "react";
import { useAddToSpellingDictionary } from "../model/use-add-to-spelling-dictionary";

interface AddToDictionaryFormProps {
	wrongForm: string;
	editor: Editor;
	selectionFrom: number;
	selectionTo: number;
	onDone: () => void;
	onCancel: () => void;
}

const MATCH_TYPES: { value: SpellingMatchType; labelKey: string }[] = [
	{ value: "substring", labelKey: "admin.spellingDictionary.matchTypeShort.substring" },
	{ value: "whole_word", labelKey: "admin.spellingDictionary.matchTypeShort.whole_word" },
	{ value: "prefix", labelKey: "admin.spellingDictionary.matchTypeShort.prefix" },
	{ value: "suffix", labelKey: "admin.spellingDictionary.matchTypeShort.suffix" },
];

export const AddToDictionaryForm = ({
	wrongForm,
	editor,
	selectionFrom,
	selectionTo,
	onDone,
	onCancel,
}: AddToDictionaryFormProps) => {
	const { t } = useI18n();

	const handleDone = (correctFormNodes: CorrectFormNode[]) => {
		editor.commands.applySpellingFix(
			selectionFrom,
			selectionTo,
			serializeCorrectForm(correctFormNodes),
		);
		onDone();
	};

	const {
		correctFormNodes,
		setCorrectFormNodes,
		correctFormPlainText,
		matchType,
		setMatchType,
		error,
		isPending,
		handleSubmit,
		reset,
	} = useAddToSpellingDictionary({ onDone: handleDone });

	useEffect(() => {
		return () => reset();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleFormSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		handleSubmit(wrongForm);
	};

	return (
		<motion.div
			variants={variants.scaleIn}
			initial="hidden"
			animate="visible"
			exit="exit"
			transition={spring.snappy}
			className="flex flex-col gap-1.5 rounded-card border border-bd-2 bg-surf px-2 py-1.5 shadow-lg backdrop-blur-sm"
		>
			{/* top row: wrong → correct + actions */}
			<div className="flex items-center gap-1.5">
				{/* wrong form badge */}
				<span className="shrink-0 rounded-[5px] bg-rose-100 px-1.5 py-0.5 font-mono text-[11px] text-rose-700 line-through select-none">
					{wrongForm}
				</span>

				<ArrowRight className="size-3 shrink-0 text-t-4" />

				{/* correct form editor + submit */}
				<form onSubmit={handleFormSubmit} className="flex items-center gap-1">
					<div className="relative">
						<CorrectFormEditor
							value={correctFormNodes}
							onChange={setCorrectFormNodes}
							placeholder={t("admin.spellingDictionary.form.placeholder")}
							className="h-5 min-w-[100px] w-full border bg-surf-1 px-2 py-0 text-[12px]"
							disabled={isPending}
							autoFocus
						/>
						{error && (
							<div className="absolute top-full left-0 mt-1 z-10 whitespace-nowrap rounded-[5px] border border-rose-200 bg-rose-50 px-2 py-1 text-[10px] text-rose-600 shadow-sm">
								{error}
							</div>
						)}
					</div>

					<button
						type="submit"
						disabled={isPending || !correctFormPlainText.trim()}
						title={t("admin.spellingDictionary.form.submitTitle")}
						className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] bg-acc text-white transition-all duration-100 ease-out hover:bg-acc-t active:scale-95 disabled:pointer-events-none disabled:opacity-40"
					>
						{isPending ? (
							<Loader2 className="size-3.5 animate-spin" />
						) : (
							<Check className="size-3.5" />
						)}
					</button>
				</form>

				{/* cancel */}
				<button
					type="button"
					title={t("admin.spellingDictionary.form.cancelTitle")}
					onClick={onCancel}
					className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] text-t-3 transition-all duration-100 ease-out hover:bg-surf-3 hover:text-t-1 active:scale-95"
				>
					<X className="size-3.5" />
				</button>
			</div>

			{/* match type pills */}
			<div className="flex items-center gap-1 pl-0.5">
				{MATCH_TYPES.map(({ value, labelKey }) => (
					<button
						key={value}
						type="button"
						disabled={isPending}
						onClick={() => setMatchType(value)}
						className={cn(
							"rounded-[5px] px-1.5 py-0.5 text-[10px] font-medium transition-colors duration-100 ease-out",
							matchType === value
								? "bg-acc text-white"
								: "bg-surf-2 text-t-3 hover:bg-surf-3 hover:text-t-1",
						)}
					>
						{t(labelKey)}
					</button>
				))}
			</div>
		</motion.div>
	);
};
