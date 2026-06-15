"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, X, Loader2, ArrowRight } from "lucide-react";
import type { Editor } from "@tiptap/react";
import { Input } from "@/shared/ui/input";
import { spring, variants } from "@/shared/lib/animation";
import { useAddToSpellingDictionary } from "../model/use-add-to-spelling-dictionary";
import { useI18n } from "@/shared/lib/i18n";

interface AddToDictionaryFormProps {
	wrongForm: string;
	editor: Editor;
	selectionFrom: number;
	selectionTo: number;
	onDone: () => void;
	onCancel: () => void;
}

export const AddToDictionaryForm = ({
	wrongForm,
	editor,
	selectionFrom,
	selectionTo,
	onDone,
	onCancel,
}: AddToDictionaryFormProps) => {
	const { t } = useI18n();
	const inputRef = useRef<HTMLInputElement>(null);

	const handleDone = (correctForm: string) => {
		editor.commands.applySpellingFix(selectionFrom, selectionTo, correctForm);
		onDone();
	};

	const { correctForm, error, isPending, handleCorrectFormChange, handleSubmit, reset } =
		useAddToSpellingDictionary({ onDone: handleDone });

	useEffect(() => {
		inputRef.current?.focus();
		return () => reset();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleFormSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		handleSubmit(wrongForm);
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Escape") {
			e.preventDefault();
			onCancel();
		}
	};

	return (
		<motion.div
			variants={variants.scaleIn}
			initial="hidden"
			animate="visible"
			exit="exit"
			transition={spring.snappy}
			className="flex items-center gap-1.5 rounded-card border border-bd-2 bg-surf px-2 py-1.5 shadow-lg backdrop-blur-sm"
		>
			{/* wrong form badge */}
			<span className="shrink-0 rounded-[5px] bg-rose-100 px-1.5 py-0.5 font-mono text-[11px] text-rose-700 line-through select-none">
				{wrongForm}
			</span>

			<ArrowRight className="size-3 shrink-0 text-t-4" />

			{/* correct form input */}
			<form onSubmit={handleFormSubmit} className="flex items-center gap-1">
				<div className="relative">
					<Input
						ref={inputRef}
						value={correctForm}
						onChange={handleCorrectFormChange}
						onKeyDown={handleKeyDown}
						placeholder={t("admin.spellingDictionary.form.placeholder")}
						className="h-7 w-[160px] border-0 bg-surf-2 px-2 py-0 text-[12px] focus-visible:ring-1 focus-visible:ring-acc/60"
						disabled={isPending}
					/>
					{error && (
						<div className="absolute top-full left-0 mt-1 z-10 whitespace-nowrap rounded-[5px] border border-rose-200 bg-rose-50 px-2 py-1 text-[10px] text-rose-600 shadow-sm">
							{error}
						</div>
					)}
				</div>

				{/* submit */}
				<button
					type="submit"
					disabled={isPending || !correctForm.trim()}
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
		</motion.div>
	);
};
