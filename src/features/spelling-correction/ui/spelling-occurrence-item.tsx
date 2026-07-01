"use client";

import type { ChangeEvent } from "react";
import { Checkbox } from "@/shared/ui/checkbox";
import { Select } from "@/shared/ui/select";
import { Typography } from "@/shared/ui/typography";
import { parseCorrectForm } from "@/entities/spelling-dictionary";
import type { SpellingOccurrence } from "../model/types";

interface SpellingOccurrenceItemProps {
	occurrence: SpellingOccurrence;
	checked: boolean;
	allCorrectForms: string[];
	onToggle: (index: number) => void;
	onSelectCorrectForm: (index: number, correctForm: string) => void;
}

export const SpellingOccurrenceItem = ({
	occurrence,
	checked,
	allCorrectForms,
	onToggle,
	onSelectCorrectForm,
}: SpellingOccurrenceItemProps) => {
	const handleCheckedChange = () => onToggle(occurrence.index);

	const handleFormChange = (e: ChangeEvent<HTMLSelectElement>) =>
		onSelectCorrectForm(occurrence.index, e.currentTarget.value);

	const hasMultipleForms = allCorrectForms.length > 1;

	const renderCorrectForm = (value: string) =>
		parseCorrectForm(value).map((node, i) =>
			node.superscript ? <sup key={i}>{node.text}</sup> : <span key={i}>{node.text}</span>,
		);

	return (
		<label className="flex cursor-pointer items-start gap-2.5 px-4 py-2.5 transition-colors hover:bg-surf-2">
			<Checkbox
				checked={checked}
				onCheckedChange={handleCheckedChange}
				className="mt-0.5 shrink-0"
			/>
			<div className="min-w-0 flex-1">
				<Typography tag="span" className="text-[12.5px] leading-snug text-t-2">
					{occurrence.before ? (
						<Typography tag="span" className="text-t-3">{occurrence.before} </Typography>
					) : null}
					<Typography tag="span" className="font-semibold text-rose-600 line-through">
						{occurrence.originalText}
					</Typography>
					<Typography tag="span" className="mx-1.5 text-t-4">→</Typography>
					{hasMultipleForms ? null : (
						<Typography tag="span" className="font-semibold text-t-1">
							{renderCorrectForm(occurrence.selectedCorrectForm)}
						</Typography>
					)}
					{occurrence.after ? (
						<Typography tag="span" className="text-t-3">{hasMultipleForms ? null : " "}{occurrence.after}</Typography>
					) : null}
				</Typography>

				{hasMultipleForms && (
					<div className="mt-1.5">
						<Select
							value={occurrence.selectedCorrectForm}
							onChange={handleFormChange}
							variant="sm"
							wrapperClassName="max-w-[200px]"
						>
							{allCorrectForms.map(form => (
								<option key={form} value={form}>
									{parseCorrectForm(form).map(n => n.text).join("")}
								</option>
							))}
						</Select>
					</div>
				)}
			</div>
		</label>
	);
};
