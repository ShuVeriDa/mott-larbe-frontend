"use client";

import { Typography } from "@/shared/ui/typography";
import { useI18n } from "@/shared/lib/i18n";
import { useAnnouncementTemplates, type AnnouncementTemplate } from "../lib/announcement-templates";

interface AnnouncementTemplatesProps {
	onSelect: (template: AnnouncementTemplate) => void;
	disabled?: boolean;
}

export const AnnouncementTemplates = ({
	onSelect,
	disabled,
}: AnnouncementTemplatesProps) => {
	const { t } = useI18n();
	const templates = useAnnouncementTemplates();

	return (
		<div>
			<Typography
				tag="p"
				className="mb-2 text-[11.5px] font-semibold text-t-2"
			>
				{t("admin.announcements.modal.templatesLabel")}
			</Typography>
			<div className="flex flex-wrap gap-1.5">
				{templates.map((template) => {
					const handleClick = () => onSelect(template);
					return (
						<button
							key={template.key}
							type="button"
							onClick={handleClick}
							disabled={disabled}
							className="rounded-full border border-bd-1 bg-surf-2 px-3 py-1 text-[11.5px] text-t-2 transition-all duration-150 ease-out hover:border-acc/50 hover:bg-acc/10 hover:text-t-1 disabled:pointer-events-none disabled:opacity-40"
						>
							{template.title}
						</button>
					);
				})}
			</div>
		</div>
	);
};
