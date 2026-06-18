"use client";

import { useState, type ChangeEvent } from "react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { ModalActions } from "@/shared/ui/modal";
import { Typography } from "@/shared/ui/typography";
import { useI18n } from "@/shared/lib/i18n";
import { useQuery } from "@tanstack/react-query";
import type { CreateAnnouncementPayload } from "@/entities/announcement";
import { adminTextsQueryOptions } from "../lib/admin-texts-query";
import { AnnouncementTemplates } from "./announcement-templates";
import type { AnnouncementTemplate } from "../lib/announcement-templates";

interface CreateAnnouncementFormProps {
	isSubmitting: boolean;
	onSubmit: (payload: CreateAnnouncementPayload) => void;
	onClose: () => void;
}

export const CreateAnnouncementForm = ({
	isSubmitting,
	onSubmit,
	onClose,
}: CreateAnnouncementFormProps) => {
	const { t } = useI18n();

	const [title, setTitle] = useState("");
	const [body, setBody] = useState("");
	const [textSearch, setTextSearch] = useState("");
	const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
	const [selectedTextTitle, setSelectedTextTitle] = useState<string | null>(
		null,
	);
	const [showTextDropdown, setShowTextDropdown] = useState(false);

	const textsQuery = useQuery(adminTextsQueryOptions(textSearch));

	const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) =>
		setTitle(e.currentTarget.value);

	const handleBodyChange = (e: ChangeEvent<HTMLTextAreaElement>) =>
		setBody(e.currentTarget.value);

	const handleTextSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
		setTextSearch(e.currentTarget.value);
		setSelectedTextId(null);
		setSelectedTextTitle(null);
		setShowTextDropdown(true);
	};

	const handleTextSelect = (id: string, textTitle: string) => {
		setSelectedTextId(id);
		setSelectedTextTitle(textTitle);
		setTextSearch(textTitle);
		setShowTextDropdown(false);
	};

	const handleTextClear = () => {
		setSelectedTextId(null);
		setSelectedTextTitle(null);
		setTextSearch("");
	};

	const handleTextInputFocus = () => {
		if (!selectedTextId) setShowTextDropdown(true);
	};

	const handleTextInputBlur = () => {
		setTimeout(() => setShowTextDropdown(false), 150);
	};

	const handleTemplateSelect = (template: AnnouncementTemplate) => {
		setTitle(template.title);
		setBody(template.body);
	};

	const handleSubmit = () => {
		if (!title.trim()) return;
		onSubmit({
			title: title.trim(),
			body: body.trim() || undefined,
			textId: selectedTextId ?? undefined,
		});
	};

	const bodyLength = body.length;
	const isValid = title.trim().length > 0;
	const texts = textsQuery.data ?? [];

	return (
		<>
			<div className="space-y-3.5">
				<AnnouncementTemplates
					onSelect={handleTemplateSelect}
					disabled={isSubmitting}
				/>
				<div className="border-t border-bd-1" />
				<div>
					<Typography
						tag="label"
						className="mb-1.5 block text-[11.5px] font-semibold text-t-2"
					>
						{t("admin.announcements.modal.titleLabel")}{" "}
						<span className="text-red-t">*</span>
					</Typography>
					<Input
						value={title}
						onChange={handleTitleChange}
						placeholder={t("admin.announcements.modal.titlePlaceholder")}
						maxLength={200}
						autoFocus
						disabled={isSubmitting}
					/>
				</div>

				<div>
					<div className="mb-1.5 flex items-center justify-between">
						<Typography
							tag="label"
							htmlFor="announcement-body"
							className="text-[11.5px] font-semibold text-t-2"
						>
							{t("admin.announcements.modal.bodyLabel")}
						</Typography>
						<span className="text-[11px] text-t-4">
							{bodyLength}/2000
						</span>
					</div>
					<textarea
						id="announcement-body"
						value={body}
						onChange={handleBodyChange}
						placeholder={t("admin.announcements.modal.bodyPlaceholder")}
						maxLength={2000}
						disabled={isSubmitting}
						rows={3}
						className="w-full resize-none rounded-base border border-bd-1 bg-bg px-3 py-2 text-[13px] text-t-1 placeholder:text-t-4 focus:outline-none focus:ring-2 focus:ring-acc/50 disabled:opacity-50 transition-shadow duration-150 ease-out"
					/>
				</div>

				<div>
					<Typography
						tag="label"
						className="mb-1.5 block text-[11.5px] font-semibold text-t-2"
					>
						{t("admin.announcements.modal.textLabel")}
					</Typography>
					<div className="relative">
						<Input
							value={textSearch}
							onChange={handleTextSearchChange}
							onFocus={handleTextInputFocus}
							onBlur={handleTextInputBlur}
							placeholder={t("admin.announcements.modal.textPlaceholder")}
							disabled={isSubmitting}
							className={selectedTextId ? "pr-8" : ""}
						/>
						{selectedTextId && (
							<button
								type="button"
								onClick={handleTextClear}
								className="absolute right-2.5 top-1/2 -translate-y-1/2 text-t-3 hover:text-t-1 transition-colors duration-150"
								aria-label={t("admin.announcements.modal.clearText")}
							>
								×
							</button>
						)}
						{showTextDropdown && texts.length > 0 && (
							<div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-48 overflow-y-auto rounded-base border border-bd-1 bg-surf shadow-md">
								{texts.map((text) => {
									const handleMouseDown = () => handleTextSelect(text.id, text.title);
									return (
										<button
											key={text.id}
											type="button"
											onMouseDown={handleMouseDown}
											className="w-full px-3 py-2 text-left text-[12.5px] text-t-1 transition-colors duration-100 hover:bg-surf-2"
										>
											{text.title}
										</button>
									);
								})}
							</div>
						)}
					</div>
				</div>
			</div>

			<ModalActions>
				<Button
					variant="ghost"
					onClick={onClose}
					disabled={isSubmitting}
					className="h-[34px] px-4 rounded-lg text-[13px]"
				>
					{t("admin.announcements.modal.cancel")}
				</Button>
				<Button
					variant="action"
					onClick={handleSubmit}
					disabled={isSubmitting || !isValid}
					className="h-[34px] flex-1 rounded-lg text-[13px]"
				>
					{isSubmitting
						? t("admin.announcements.modal.sending")
						: t("admin.announcements.modal.send")}
				</Button>
			</ModalActions>
		</>
	);
};
