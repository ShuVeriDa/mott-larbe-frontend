"use client";

import type {
	AdminPhrasebookCategory,
	CreateAdminCategoryDto,
	UpdateAdminCategoryDto,
} from "@/entities/phrasebook";
import { cn } from "@/shared/lib/cn";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Modal, ModalActions } from "@/shared/ui/modal";
import { Typography } from "@/shared/ui/typography";
import { useState, type ComponentProps } from "react";
import { EmojiPickerInput } from "./emoji-picker-input";

interface CategoryModalProps {
	open: boolean;
	category?: AdminPhrasebookCategory | null;
	isSubmitting: boolean;
	onCreate: (dto: CreateAdminCategoryDto) => void;
	onUpdate: (id: string, dto: UpdateAdminCategoryDto) => void;
	onClose: () => void;
	t: (key: string) => string;
}

export const CategoryModal = ({
	open,
	category,
	isSubmitting,
	onCreate,
	onUpdate,
	onClose,
	t,
}: CategoryModalProps) => {
	const isEdit = !!category;

	const [emoji, setEmoji] = useState(category?.emoji ?? "");
	const [name, setName] = useState(category?.name ?? "");
	const [sortOrder, setSortOrder] = useState(String(category?.sortOrder ?? 0));
	const [errors, setErrors] = useState<Record<string, string>>({});

	const handleSubmit: NonNullable<ComponentProps<"button">["onClick"]> = () => {
		const errs: Record<string, string> = {};
		if (!emoji.trim())
			errs.emoji = t("adminPhrasebook.categoryModal.emojiRequired");
		if (!name.trim())
			errs.name = t("adminPhrasebook.categoryModal.nameRequired");
		if (Object.keys(errs).length > 0) {
			setErrors(errs);
			return;
		}

		const dto = {
			emoji: emoji.trim(),
			name: name.trim(),
			sortOrder: Number(sortOrder),
		};
		if (isEdit && category) onUpdate(category.id, dto);
		else onCreate(dto);
	};

	const handleEmojiSelect = (value: string) => {
		setEmoji(value);
		setErrors(p => ({ ...p, emoji: "" }));
	};

	const handleNameChange: NonNullable<
		ComponentProps<"input">["onChange"]
	> = e => {
		setName(e.currentTarget.value);
		setErrors(p => ({ ...p, name: "" }));
	};

	const handleSortOrderChange: NonNullable<
		ComponentProps<"input">["onChange"]
	> = e => {
		setSortOrder(e.currentTarget.value);
	};

	return (
		<Modal
			open={open}
			onClose={onClose}
			title={
				isEdit
					? t("adminPhrasebook.categoryModal.editTitle")
					: t("adminPhrasebook.categoryModal.createTitle")
			}
			className="max-w-[380px]"
		>
			<div className="space-y-3.5">
				<div className="grid grid-cols-[72px_1fr] gap-2.5">
					<div>
						<Typography
							tag="label"
							className="mb-1.5 block text-[11.5px] font-semibold text-t-2"
						>
							{t("adminPhrasebook.categoryModal.emojiLabel")} *
						</Typography>
						<EmojiPickerInput
							value={emoji}
							onChange={handleEmojiSelect}
							hasError={!!errors.emoji}
							searchPlaceholder={t("adminPhrasebook.emojiSearch")}
						/>
						{errors.emoji && (
							<Typography tag="p" className="mt-1 text-[11px] text-red-500">
								{errors.emoji}
							</Typography>
						)}
					</div>
					<div>
						<Typography
							tag="label"
							className="mb-1.5 block text-[11.5px] font-semibold text-t-2"
						>
							{t("adminPhrasebook.categoryModal.nameLabel")} *
						</Typography>
						<Input
							className={cn(errors.name && "border-red-400")}
							placeholder={t("adminPhrasebook.categoryModal.namePlaceholder")}
							value={name}
							onChange={handleNameChange}
						/>
						{errors.name && (
							<Typography tag="p" className="mt-1 text-[11px] text-red-500">
								{errors.name}
							</Typography>
						)}
					</div>
				</div>

				<div>
					<Typography
						tag="label"
						className="mb-1.5 block text-[11.5px] font-semibold text-t-2"
					>
						{t("adminPhrasebook.categoryModal.sortOrderLabel")}
					</Typography>
					<Input
						type="number"
						min={0}
						className="w-[100px]"
						value={sortOrder}
						onChange={handleSortOrderChange}
					/>
				</div>
			</div>

			<ModalActions>
				<Button
					variant="ghost"
					onClick={onClose}
					disabled={isSubmitting}
					className="h-[34px] px-4 rounded-lg text-[13px]"
				>
					{t("adminPhrasebook.cancel")}
				</Button>
				<Button
					variant="action"
					onClick={handleSubmit}
					disabled={isSubmitting}
					className="h-[34px] flex-1 rounded-lg text-[13px]"
				>
					{isSubmitting
						? t("adminPhrasebook.saving")
						: isEdit
							? t("adminPhrasebook.save")
							: t("adminPhrasebook.create")}
				</Button>
			</ModalActions>
		</Modal>
	);
};
