"use client";

import type { AdminGenre } from "@/entities/genre";
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { Input, InputLabel } from "@/shared/ui/input";
import { useEffect, useState } from "react";

interface GenreModalProps {
	open: boolean;
	genre: AdminGenre | null;
	isLoading: boolean;
	onSubmit: (data: { name: string; slug: string; sortOrder: number }) => void;
	onClose: () => void;
}

const toSlug = (name: string) =>
	name
		.toLowerCase()
		.replace(/\s+/g, "-")
		.replace(/[^\w-]/g, "");

export const GenreModal = ({ open, genre, isLoading, onSubmit, onClose }: GenreModalProps) => {
	const { t } = useI18n();
	const [name, setName] = useState("");
	const [slug, setSlug] = useState("");
	const [sortOrder, setSortOrder] = useState(0);
	const [slugTouched, setSlugTouched] = useState(false);

	useEffect(() => {
		if (open) {
			setName(genre?.name ?? "");
			setSlug(genre?.slug ?? "");
			setSortOrder(genre?.sortOrder ?? 0);
			setSlugTouched(false);
		}
	}, [open, genre]);

	const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const val = e.currentTarget.value;
		setName(val);
		if (!slugTouched) setSlug(toSlug(val));
	};

	const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSlugTouched(true);
		setSlug(e.currentTarget.value);
	};

	const handleSortOrderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSortOrder(Number(e.currentTarget.value) || 0);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!name.trim() || !slug.trim()) return;
		onSubmit({ name: name.trim(), slug: slug.trim(), sortOrder });
	};

	const isEdit = genre !== null;

	return (
		<Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>
						{isEdit ? t("admin.genres.modal.editTitle") : t("admin.genres.modal.createTitle")}
					</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
					<div>
						<InputLabel htmlFor="genre-name">{t("admin.genres.modal.name")}</InputLabel>
						<Input
							id="genre-name"
							value={name}
							onChange={handleNameChange}
							placeholder={t("admin.genres.modal.namePlaceholder")}
							required
						/>
					</div>

					<div>
						<InputLabel htmlFor="genre-slug">{t("admin.genres.modal.slug")}</InputLabel>
						<Input
							id="genre-slug"
							value={slug}
							onChange={handleSlugChange}
							placeholder="poetry"
							required
						/>
					</div>

					<div>
						<InputLabel htmlFor="genre-order">{t("admin.genres.modal.sortOrder")}</InputLabel>
						<Input
							id="genre-order"
							type="number"
							min={0}
							value={sortOrder}
							onChange={handleSortOrderChange}
						/>
					</div>

					<div className="flex justify-end gap-2 pt-2">
						<Button type="button" variant="ghost" onClick={onClose}>
							{t("common.cancel")}
						</Button>
						<Button type="submit" variant="action" disabled={isLoading}>
							{isLoading ? t("common.saving") : t("common.save")}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
};
