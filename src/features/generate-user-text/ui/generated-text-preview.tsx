"use client";

import { Typography } from "@/shared/ui/typography";
import { useI18n } from "@/shared/lib/i18n";
import type { TipTapDoc } from "@/shared/ui/notion-editor";
import { renderPlainParagraphs } from "../lib/render-plain-paragraphs";

interface GeneratedTextPreviewProps {
	content: TipTapDoc;
}

export const GeneratedTextPreview = ({ content }: GeneratedTextPreviewProps) => {
	const { t } = useI18n();
	const paragraphs = renderPlainParagraphs(content);

	return (
		<div>
			<Typography tag="h3" size="sm" className="mb-2 font-semibold text-t-1">
				{t("myTexts.generate.applyMode.previewTitle")}
			</Typography>
			<div className="max-h-72 space-y-3 overflow-y-auto rounded-base border-[0.5px] border-bd-2 bg-surf p-3">
				{paragraphs.map((paragraph, index) => (
					<Typography key={index} tag="p" size="sm" className="text-t-1">
						{paragraph}
					</Typography>
				))}
			</div>
		</div>
	);
};
