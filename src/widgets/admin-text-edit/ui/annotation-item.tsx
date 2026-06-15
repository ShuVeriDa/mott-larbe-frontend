"use client";

import type { AnnotatedFormOnPage } from "@/features/word-annotation";
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { Pencil, Trash2 } from "lucide-react";

interface AnnotationItemProps {
	form: AnnotatedFormOnPage;
	onEdit: (form: AnnotatedFormOnPage) => void;
	onDelete: (form: AnnotatedFormOnPage) => void;
}

export const AnnotationItem = ({
	form,
	onEdit,
	onDelete,
}: AnnotationItemProps) => {
	const { t } = useI18n();
	const handleEdit = () => onEdit(form);
	const handleDelete = () => onDelete(form);

	return (
		<div className="group relative rounded-lg border-[0.5px] border-bd-1 bg-surf-2 p-3 transition-colors hover:border-bd-2">
			<div className="mb-1 flex items-start justify-between gap-2">
				<div className="min-w-0">
					<Typography tag="span" className="text-[13px] font-semibold text-t-1">
						{form.normalized}
					</Typography>
					<Typography tag="span" className="ml-1.5 text-[11px] text-t-3">
						→ {form.lemmaBaseForm}
					</Typography>
				</div>
				<div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
					<Button
						onClick={handleEdit}
						title={t("admin.texts.editPage.wordAnnotation.edit")}
						className="rounded p-1 text-t-3 transition-colors hover:bg-surf-3 hover:text-t-1"
					>
						<Pencil className="size-3" />
					</Button>
					<Button
						onClick={handleDelete}
						title={t("admin.texts.editPage.wordAnnotation.delete")}
						className="rounded p-1 text-t-3 transition-colors hover:bg-red/10 hover:text-red"
					>
						<Trash2 className="size-3" />
					</Button>
				</div>
			</div>
			{form.translation && (
				<div className="text-[12px] text-t-2">{form.translation}</div>
			)}
		</div>
	);
};
