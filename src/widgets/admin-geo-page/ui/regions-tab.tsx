"use client";

import type { Region, CreateRegionDto, PaginatedResponse } from "@/entities/geo";
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { Input, InputLabel } from "@/shared/ui/input";
import { Skeleton } from "@/shared/ui/skeleton";
import { Typography } from "@/shared/ui/typography";
import { useEffect, useState } from "react";
import type { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import { LocalizedNameFields } from "./localized-name-fields";

interface RegionsTabProps {
	regions: Region[];
	query: UseQueryResult<PaginatedResponse<Region>>;
	modal: { open: boolean; item: Region | null };
	onOpenCreate: () => void;
	onOpenEdit: (item: Region) => void;
	onCloseModal: () => void;
	createMutation: UseMutationResult<Region, Error, CreateRegionDto>;
	updateMutation: UseMutationResult<Region, Error, unknown>;
	deleteMutation: UseMutationResult<unknown, Error, string>;
}

export const RegionsTab = ({
	regions,
	query,
	modal,
	onOpenCreate,
	onOpenEdit,
	onCloseModal,
	createMutation,
	updateMutation,
	deleteMutation,
}: RegionsTabProps) => {
	const { t } = useI18n();

	const handleEdit = (item: Region) => onOpenEdit(item);
	const handleDelete = (item: Region) => {
		if (confirm(t("admin.geo.deleteConfirm", { name: item.name.ru }))) {
			deleteMutation.mutate(item.id);
		}
	};

	const handleSubmit = (data: CreateRegionDto) => {
		if (modal.item) {
			(updateMutation as UseMutationResult<Region, Error, unknown>).mutate({ id: modal.item.id, ...data });
		} else {
			createMutation.mutate(data);
		}
	};

	const isPending = createMutation.isPending || updateMutation.isPending;

	return (
		<>
			<div className="flex items-center justify-between px-5 py-3">
				<Typography tag="p" className="text-[12px] text-t-3">
					{t("admin.geo.regions.subtitle")}
				</Typography>
				<Button variant="action" size="default" onClick={onOpenCreate}>
					{t("admin.geo.regions.create")}
				</Button>
			</div>

			<div className="overflow-x-auto px-5 pb-5">
				{query.isPending ? (
					<TableSkeleton />
				) : (
					<table className="w-full text-[13px]">
						<thead>
							<tr className="border-b border-bd-1 text-left text-[11px] font-medium uppercase tracking-wide text-t-3">
								<th className="pb-2 pr-4">{t("admin.heritage.table.nameChe")}</th>
								<th className="pb-2 pr-4">{t("admin.heritage.table.nameRu")}</th>
								<th className="pb-2 pr-4">{t("admin.heritage.table.nameEn")}</th>
								<th className="pb-2 pr-4">{t("admin.geo.table.countryCode")}</th>
								<th className="pb-2 text-right">{t("admin.heritage.table.actions")}</th>
							</tr>
						</thead>
						<tbody>
							{regions.map((item) => (
								<RegionRow
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
				{!query.isPending && regions.length === 0 && (
					<div className="py-16 text-center text-[13px] text-t-3">
						{t("admin.geo.empty")}
					</div>
				)}
			</div>

			<RegionModal
				open={modal.open}
				item={modal.item}
				isPending={isPending}
				onSubmit={handleSubmit}
				onClose={onCloseModal}
			/>
		</>
	);
};

interface RegionRowProps {
	item: Region;
	isDeleting: boolean;
	onEdit: (item: Region) => void;
	onDelete: (item: Region) => void;
}

const RegionRow = ({ item, isDeleting, onEdit, onDelete }: RegionRowProps) => {
	const { t } = useI18n();
	const handleEdit = () => onEdit(item);
	const handleDelete = () => onDelete(item);

	return (
		<tr className="border-b border-bd-1 hover:bg-surf-2">
			<td className="py-2.5 pr-4 font-medium text-t-1">{item.name.che}</td>
			<td className="py-2.5 pr-4 text-t-2">{item.name.ru}</td>
			<td className="py-2.5 pr-4 text-t-2">{item.name.en}</td>
			<td className="py-2.5 pr-4 font-mono text-[12px] text-t-3">{item.countryCode}</td>
			<td className="py-2.5 text-right">
				<div className="flex justify-end gap-2">
					<Button variant="ghost" size="default" onClick={handleEdit}>{t("common.edit")}</Button>
					<Button variant="danger" size="default" onClick={handleDelete} disabled={isDeleting}>
						{t("common.delete")}
					</Button>
				</div>
			</td>
		</tr>
	);
};

interface RegionModalProps {
	open: boolean;
	item: Region | null;
	isPending: boolean;
	onSubmit: (data: CreateRegionDto) => void;
	onClose: () => void;
}

const RegionModal = ({ open, item, isPending, onSubmit, onClose }: RegionModalProps) => {
	const { t } = useI18n();
	const [name, setName] = useState({ che: "", ru: "", en: "" });
	const [countryCode, setCountryCode] = useState("RU");

	useEffect(() => {
		if (open) {
			setName(item?.name ?? { che: "", ru: "", en: "" });
			setCountryCode(item?.countryCode ?? "RU");
		}
	}, [open, item]);

	const handleCountryCodeChange = (e: React.ChangeEvent<HTMLInputElement>) =>
		setCountryCode(e.currentTarget.value.toUpperCase());

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!name.che.trim() || !name.ru.trim() || !countryCode.trim()) return;
		onSubmit({ name: { che: name.che.trim(), ru: name.ru.trim(), en: name.en.trim() }, countryCode: countryCode.trim() });
	};

	return (
		<Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>
						{item ? t("admin.geo.regions.editTitle") : t("admin.geo.regions.createTitle")}
					</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
					<LocalizedNameFields value={name} onChange={setName} idPrefix="region" />
					<div>
						<InputLabel htmlFor="region-country">{t("admin.geo.table.countryCode")}</InputLabel>
						<Input
							id="region-country"
							value={countryCode}
							onChange={handleCountryCodeChange}
							placeholder="RU"
							maxLength={3}
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

const TableSkeleton = () => (
	<div className="flex flex-col gap-2">
		{Array.from({ length: 5 }).map((_, i) => (
			<Skeleton key={i} className="h-10" />
		))}
	</div>
);
