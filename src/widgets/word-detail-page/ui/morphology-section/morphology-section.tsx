"use client";

import type { DetailMorphForm } from "@/entities/dictionary";
import { useI18n } from "@/shared/lib/i18n";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/shared/ui/table";
import { Typography } from "@/shared/ui/typography";
import { CardSection } from "../card-section";

export interface MorphologySectionProps {
	forms: DetailMorphForm[];
	declensionClass: string | null;
}

export const MorphologySection = ({
	forms,
	declensionClass,
}: MorphologySectionProps) => {
	const { t } = useI18n();

	if (forms.length === 0) return null;

	return (
		<CardSection
			title={t("vocabulary.wordDetail.sections.morphology")}
			rightSlot={
				declensionClass ? (
					<Typography tag="span" className="text-[11px] text-t-3">
						{t("vocabulary.wordDetail.declensionClass", {
							name: declensionClass,
						})}
					</Typography>
				) : undefined
			}
		>
			<div className="overflow-x-auto -webkit-overflow-scrolling-touch">
				<Table
					className="w-full min-w-[280px] border-collapse"
					aria-label={t("vocabulary.wordDetail.sections.morphology")}
				>
					<TableHeader>
						<TableRow>
							<TableHead className="pb-1.5 pr-2 text-left text-[10px] font-semibold uppercase tracking-[0.5px] text-t-3">
								{t("vocabulary.wordDetail.morphTable.case")}
							</TableHead>
							<TableHead className="pb-1.5 pr-2 text-left text-[10px] font-semibold uppercase tracking-[0.5px] text-t-3">
								{t("vocabulary.wordDetail.morphTable.form")}
							</TableHead>
							<TableHead className="pb-1.5 pr-2 text-left text-[10px] font-semibold uppercase tracking-[0.5px] text-t-3">
								{t("vocabulary.wordDetail.morphTable.meaning")}
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{forms.map((form, idx) => (
							<TableRow
								key={`${form.form}-${idx}`}
								className="border-t-[0.5px] border-bd-1"
							>
								<TableCell className="py-1.5 pr-2 text-[12px] text-t-3">
									{form.caseLabel ?? form.gramCase ?? form.grammarTag ?? "—"}
								</TableCell>
								<TableCell className="py-1.5 pr-2">
									<Typography
										tag="span"
										className="inline-flex items-center rounded-[5px] border-[0.5px] border-bd-1 bg-surf-2 px-2 py-[2px] font-display text-[12px] italic text-t-1"
									>
										{form.form}
									</Typography>
								</TableCell>
								<TableCell className="py-1.5 pr-2 text-[12px] text-t-3">
									{form.translation ?? "—"}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</CardSection>
	);
};
