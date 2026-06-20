"use client";

import type { Nation, CreateNationDto } from "@/entities/heritage";
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { Skeleton } from "@/shared/ui/skeleton";
import { Typography } from "@/shared/ui/typography";
import { useEffect, useState } from "react";
import type { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import type { PaginatedResponse } from "@/entities/heritage";
import { LocalizedNameFields } from "./localized-name-fields";
import { Input, InputLabel } from "@/shared/ui/input";

interface NationsTabProps {
	nations: Nation[];
	query: UseQueryResult<PaginatedResponse<Nation>>;
	modal: { open: boolean; item: Nation | null };
	onOpenCreate: () => void;
	onOpenEdit: (item: Nation) => void;
	onCloseModal: () => void;
	createMutation: UseMutationResult<Nation, Error, CreateNationDto>;
	updateMutation: UseMutationResult<Nation, Error, { id: string } & Parameters<(id: string, dto: unknown) => unknown>[1]>;
	deleteMutation: UseMutationResult<unknown, Error, string>;
}

export const NationsTab = ({
	nations,
	query,
	modal,
	onOpenCreate,
	onOpenEdit,
	onCloseModal,
	createMutation,
	updateMutation,
	deleteMutation,
}: NationsTabProps) => {
	const { t } = useI18n();

	const handleEdit = (item: Nation) => onOpenEdit(item);
	const handleDelete = (item: Nation) => {
		if (confirm(t("admin.heritage.deleteConfirm", { name: item.name.ru }))) {
			deleteMutation.mutate(item.id);
		}
	};

	const handleSubmit = (data: CreateNationDto) => {
		if (modal.item) {
			updateMutation.mutate({ id: modal.item.id, ...data } as unknown as { id: string } & Parameters<(id: string, dto: unknown) => unknown>[1]);
		} else {
			createMutation.mutate(data);
		}
	};

	const isPending = createMutation.isPending || updateMutation.isPending;

	return (
		<>
			<div className="flex items-center justify-between px-5 py-3">
				<Typography tag="p" className="text-[12px] text-t-3">
					{t("admin.heritage.nations.subtitle")}
				</Typography>
				<Button variant="action" size="default" onClick={onOpenCreate}>
					{t("admin.heritage.nations.create")}
				</Button>
			</div>

			<div className="overflow-x-auto px-5 pb-5">
				{query.isPending ? (
					<NationsTableSkeleton />
				) : (
					<table className="w-full text-[13px]">
						<thead>
							<tr className="border-b border-bd-1 text-left text-[11px] font-medium uppercase tracking-wide text-t-3">
								<th className="pb-2 pr-4">{t("admin.heritage.table.nameChe")}</th>
								<th className="pb-2 pr-4">{t("admin.heritage.table.nameRu")}</th>
								<th className="pb-2 pr-4">{t("admin.heritage.table.nameEn")}</th>
								<th className="pb-2 pr-4">{t("admin.heritage.table.slug")}</th>
								<th className="pb-2 text-right">{t("admin.heritage.table.actions")}</th>
							</tr>
						</thead>
						<tbody>
							{nations.map((item) => (
								<NationRow
									key={item.id}
									item={item}
									isDeleting={deleteMutation.isPending}
									onEdit={handleEdit}
									onDelete={handleDelete}
								/>
							))}
						</tbody>
					</table>
				)}
				{!query.isPending && nations.length === 0 && (
					<div className="py-16 text-center text-[13px] text-t-3">
						{t("admin.heritage.empty")}
					</div>
				)}
			</div>

			<NationModal
				open={modal.open}
				item={modal.item}
				isPending={isPending}
				onSubmit={handleSubmit}
				onClose={onCloseModal}
			/>
		</>
	);
};

interface NationRowProps {
	item: Nation;
	isDeleting: boolean;
	onEdit: (item: Nation) => void;
	onDelete: (item: Nation) => void;
}

const NationRow = ({ item, isDeleting, onEdit, onDelete }: NationRowProps) => {
	const { t } = useI18n();
	const handleEdit = () => onEdit(item);
	const handleDelete = () => onDelete(item);

	return (
		<tr className="border-b border-bd-1 hover:bg-surf-2">
			<td className="py-2.5 pr-4 font-medium text-t-1">{item.name.che}</td>
			<td className="py-2.5 pr-4 text-t-2">{item.name.ru}</td>
			<td className="py-2.5 pr-4 text-t-2">{item.name.en}</td>
			<td className="py-2.5 pr-4 font-mono text-[12px] text-t-3">{item.slug}</td>
			<td className="py-2.5 text-right">
				<div className="flex justify-end gap-2">
					<Button variant="ghost" size="default" onClick={handleEdit}>
						{t("common.edit")}
					</Button>
					<Button variant="danger" size="default" onClick={handleDelete} disabled={isDeleting}>
						{t("common.delete")}
					</Button>
				</div>
			</td>
		</tr>
	);
};

interface NationModalProps {
	open: boolean;
	item: Nation | null;
	isPending: boolean;
	onSubmit: (data: CreateNationDto) => void;
	onClose: () => void;
}

const NationModal = ({ open, item, isPending, onSubmit, onClose }: NationModalProps) => {
	const { t } = useI18n();
	const [name, setName] = useState({ che: "", ru: "", en: "" });
	const [slug, setSlug] = useState("");

	useEffect(() => {
		if (open) {
			setName(item?.name ?? { che: "", ru: "", en: "" });
			setSlug(item?.slug ?? "");
		}
	}, [open, item]);

	const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) =>
		setSlug(e.currentTarget.value);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!name.che.trim() || !name.ru.trim() || !slug.trim()) return;
		onSubmit({ name: { che: name.che.trim(), ru: name.ru.trim(), en: name.en.trim() }, slug: slug.trim() });
	};

	return (
		<Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>
						{item ? t("admin.heritage.nations.editTitle") : t("admin.heritage.nations.createTitle")}
					</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
					<LocalizedNameFields value={name} onChange={setName} idPrefix="nation" />
					<div>
						<InputLabel htmlFor="nation-slug">{t("admin.heritage.table.slug")}</InputLabel>
						<Input
							id="nation-slug"
							value={slug}
							onChange={handleSlugChange}
							placeholder="nakhchiy"
							required
						/>
					</div>
					<div className="flex justify-end gap-2 pt-2">
						<Button type="button" variant="ghost" onClick={onClose}>{t("common.cancel")}</Button>
						<Button type="submit" variant="action" disabled={isPending}>
							{isPending ? t("common.saving") : t("common.save")}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
};

const NationsTableSkeleton = () => (
	<div className="flex flex-col gap-2">
		{Array.from({ length: 5 }).map((_, i) => (
			<Skeleton key={i} className="h-10" />
		))}
	</div>
);
