"use client";

import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import {
	type ChangeEvent,
	type FormEvent,
	type KeyboardEvent,
	useState,
} from "react";

export interface NoteFormProps {
	initialValue?: string;
	placeholder?: string;
	onSubmit: (body: string) => void;
	onCancel?: () => void;
	className?: string;
}

export const NoteForm = ({
	initialValue = "",
	placeholder,
	onSubmit,
	onCancel,
	className,
}: NoteFormProps) => {
	const { t } = useI18n();
	const [value, setValue] = useState(initialValue);

	const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) =>
		setValue(e.currentTarget.value);

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		const trimmed = value.trim();
		if (!trimmed) return;
		onSubmit(trimmed);
		setValue("");
	};

	const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
			e.preventDefault();
			const trimmed = value.trim();
			if (trimmed) {
				onSubmit(trimmed);
				setValue("");
			}
		}
		if (e.key === "Escape" && onCancel) {
			onCancel();
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className={cn("flex flex-col gap-2", className)}
		>
			<textarea
				value={value}
				onChange={handleChange}
				onKeyDown={handleKeyDown}
				placeholder={placeholder ?? t("reader.notes.placeholder")}
				rows={3}
				className="w-full resize-none rounded-lg border border-bd-1 bg-surf px-3 py-2 text-[13px] text-t-1 placeholder:text-t-4 focus:border-acc/60 focus:outline-none"
			/>
			<div className="flex items-center gap-2">
				<Button
					type="submit"
					disabled={!value.trim()}
					variant="bare"
					size={null}
					className="block h-7 px-3 rounded-md bg-acc text-center text-[11.5px] font-semibold leading-7 text-white transition-opacity hover:opacity-[0.88]disabled:opacity-40"
				>
					{t("reader.notes.save")}
				</Button>
				{onCancel && (
					<Button
						type="button"
						variant="bare"
						size={null}
						onClick={onCancel}
						className="h-7 rounded-md px-3 text-[12px] text-t-3 hover:bg-surf-2 hover:text-t-1"
					>
						{t("reader.notes.cancel")}
					</Button>
				)}
				<span className="ml-auto text-[11px] text-t-4">⌘↵</span>
			</div>
		</form>
	);
};
