"use client";

import type { District, Region, CreateDistrictDto, PaginatedResponse } from "@/entities/geo";
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { Select } from "@/shared/ui/select";
import { Skeleton } from "@/shared/ui/skeleton";
import { InputLabel } from "@/shared/ui/input";
import { useEffect, useState } from "react";
import type { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import { LocalizedNameFields } from "./localized-name-fields";

interface DistrictsTabProps {
	districts: District[];
	regions: Region[];
	selectedRegionId: string;
	query: UseQueryResult<PaginatedResponse<District>>;
	modal: { open: boolean; item: District | null };
	onSelectRegion: (id: string) => void;
	onOpenCreate: () => void;
	onOpenEdit: (item: District) => void;
	onCloseModal: () => void;
	createMutation: UseMutationResult<District, Error, CreateDistrictDto>;
	updateMutation: UseMutationResult<District, Error, unknown>;
	deleteMutation: UseMutationResult<unknown, Error, string>;
}

export const DistrictsTab = ({
	districts,
	regions,
	selectedRegionId,
	query,
	modal,
	onSelectRegion,
	onOpenCreate,
	onOpenEdit,
	onCloseModal,
	createMutation,
	updateMutation,
	deleteMutation,
}: DistrictsTabProps) => {
	const { t } = useI18n();

	const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
		onSelectRegion(e.currentTarget.value);

	const handleEdit = (item: District) => onOpenEdit(item);
	const handleDelete = (item: District) => {
		if (confirm(t("admin.geo.deleteConfirm", { name: item.name.ru }))) {
			deleteMutation.mutate(item.id);
		}
	};

	const handleSubmit = (data: CreateDistrictDto) => {
		if (modal.item) {
			(updateMutation as UseMutationResult<District, Error, unknown>).mutate({ id: modal.item.id, ...data });
		} else {
			createMutation.mutate(data);
		}
	};

	const isPending = createMutation.isPending || updateMutation.isPending;

	return (
		<>
			<div className="flex flex-col gap-2 border-b border-bd-1 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex items-center gap-2">
					<InputLabel htmlFor="district-region-filter" className="mb-0 whitespace-nowrap">
						{t("admin.geo.filterByRegion")}
					</InputLabel>
					<Select id="district-region-filter" value={selectedRegionId} onChange={handleRegionChange}>
						<option value="">{t("admin.geo.selectRegion")}</option>
						{regions.map((r) => (
							<option key={r.id} value={r.id}>{r.name.ru}</option>
						))}
					</Select>
				</div>
				<Button variant="action" size="default" onClick={onOpenCreate} disabled={!selectedRegionId}>
					{t("admin.geo.districts.create")}
				</Button>
			</div>

			<div className="overflow-x-auto px-5 pb-5 pt-3">
				{!selectedRegionId ? (
					<div className="py-16 text-center text-[13px] text-t-3">
						{t("admin.geo.selectRegionFirst")}
					</div>
				) : query.isPending ? (
					<TableSkeleton />
				) : (
					<table className="w-full text-[13px]">
						<thead>
							<tr className="border-b border-bd-1 text-left text-[11px] font-medium uppercase tracking-wide text-t-3">
								<th className="pb-2 pr-4">{t("admin.heritage.table.nameChe")}</th>
								<th className="pb-2 pr-4">{t("admin.heritage.table.nameRu")}</th>
								<th className="pb-2 pr-4">{t("admin.heritage.table.nameEn")}</th>
								<th className="pb-2 text-right">{t("admin.heritage.table.actions")}</th>
							</tr>
						</thead>
						<tbody>
							{districts.map((item) => (
								<DistrictRow
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
				{selectedRegionId && !query.isPending && districts.length === 0 && (
					<div className="py-16 text-center text-[13px] text-t-3">
						{t("admin.geo.empty")}
					</div>
				)}
			</div>

			<DistrictModal
				open={modal.open}
				item={modal.item}
				regions={regions}
				defaultRegionId={selectedRegionId}
				isPending={isPending}
				onSubmit={handleSubmit}
				onClose={onCloseModal}
			/>
		</>
	);
};

interface DistrictRowProps {
	item: District;
	isDeleting: boolean;
	onEdit: (item: District) => void;
	onDelete: (item: District) => void;
}

const DistrictRow = ({ item, isDeleting, onEdit, onDelete }: DistrictRowProps) => {
	const { t } = useI18n();
	const handleEdit = () => onEdit(item);
	const handleDelete = () => onDelete(item);

	return (
		<tr className="border-b border-bd-1 hover:bg-surf-2">
			<td className="py-2.5 pr-4 font-medium text-t-1">{item.name.che}</td>
			<td className="py-2.5 pr-4 text-t-2">{item.name.ru}</td>
			<td className="py-2.5 pr-4 text-t-2">{item.name.en}</td>
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

interface DistrictModalProps {
	open: boolean;
	item: District | null;
	regions: Region[];
	defaultRegionId: string;
	isPending: boolean;
	onSubmit: (data: CreateDistrictDto) => void;
	onClose: () => void;
}

const DistrictModal = ({ open, item, regions, defaultRegionId, isPending, onSubmit, onClose }: DistrictModalProps) => {
	const { t } = useI18n();
	const [name, setName] = useState({ che: "", ru: "", en: "" });
	const [regionId, setRegionId] = useState(defaultRegionId);

	useEffect(() => {
		if (open) {
			setName(item?.name ?? { che: "", ru: "", en: "" });
			setRegionId(item?.regionId ?? defaultRegionId);
		}
	}, [open, item, defaultRegionId]);

	const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
		setRegionId(e.currentTarget.value);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!name.che.trim() || !name.ru.trim() || !regionId) return;
		onSubmit({ name: { che: name.che.trim(), ru: name.ru.trim(), en: name.en.trim() }, regionId });
	};

	return (
		<Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>
						{item ? t("admin.geo.districts.editTitle") : t("admin.geo.districts.createTitle")}
					</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
					<div>
						<InputLabel htmlFor="district-region">{t("location.region")}</InputLabel>
						<Select id="district-region" value={regionId} onChange={handleRegionChange} required>
							<option value="">{t("admin.geo.selectRegion")}</option>
							{regions.map((r) => (
								<option key={r.id} value={r.id}>{r.name.ru}</option>
							))}
						</Select>
					</div>
					<LocalizedNameFields value={name} onChange={setName} idPrefix="district" />
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
