"use client";

import { type ComponentProps } from "react";
import Link from "next/link";
import { Pencil, TextSearch, Trash2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { useI18n } from "@/shared/lib/i18n";
import type { AdminSpellingEntry } from "@/entities/spelling-dictionary";

interface SpellingEntryRowActionsProps {
	entry: AdminSpellingEntry;
	onEdit: (entry: AdminSpellingEntry) => void;
	onDelete: (entry: AdminSpellingEntry) => void;
}

const btnClass =
	"flex size-7 cursor-pointer items-center justify-center rounded-[6px] border-none bg-transparent text-t-3 transition-colors hover:bg-surf-3 hover:text-t-1 [&_svg]:size-[14px]";

export const SpellingEntryRowActions = ({
	entry,
	onEdit,
	onDelete,
}: SpellingEntryRowActionsProps) => {
	const { t, lang } = useI18n();

	const handleEdit: NonNullable<ComponentProps<"button">["onClick"]> = () =>
		onEdit(entry);
	const handleDelete: NonNullable<ComponentProps<"button">["onClick"]> = () =>
		onDelete(entry);

	return (
		<div className="flex items-center gap-1">
			<Button
				size="bare"
				asChild
				title={t("admin.spellingDictionary.actions.viewOccurrences")}
				className={btnClass}
			>
				<Link href={`/${lang}/admin/spelling-dictionary/${entry.id}`}>
					<TextSearch />
				</Link>
			</Button>
			<Button
				size="bare"
				onClick={handleEdit}
				title={t("admin.spellingDictionary.actions.edit")}
				className={btnClass}
			>
				<Pencil />
			</Button>
			<Button
				size="bare"
				onClick={handleDelete}
				title={t("admin.spellingDictionary.actions.delete")}
				className={`${btnClass} hover:bg-red-bg hover:text-red-t`}
			>
				<Trash2 />
			</Button>
		</div>
	);
};
