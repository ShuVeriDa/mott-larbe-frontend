"use client";

import type { Country, Region, CreateRegionDto, PaginatedResponse } from "@/entities/geo";
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { InputLabel } from "@/shared/ui/input";
import { Select } from "@/shared/ui/select";
import { Skeleton } from "@/shared/ui/skeleton";
import { Typography } from "@/shared/ui/typography";
import { useEffect, useState } from "react";
import type { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import { LocalizedNameFields } from "./localized-name-fields";

interface RegionsTabProps {
	regions: Region[];
	countries: Country[];
	selectedCountryId: string;
	query: UseQueryResult<PaginatedResponse<Region>>;
	modal: { open: boolean; item: Region | null };
	onSelectCountry: (id: string) => void;
	onOpenCreate: () => void;
	onOpenEdit: (item: Region) => void;
	onCloseModal: () => void;
	createMutation: UseMutationResult<Region, Error, CreateRegionDto>;
	updateMutation: UseMutationResult<Region, Error, unknown>;
	deleteMutation: UseMutationResult<unknown, Error, string>;
}

export const RegionsTab = ({
	regions,
	countries,
	selectedCountryId,
	query,
	modal,
	onSelectCountry,
	onOpenCreate,
	onOpenEdit,
	onCloseModal,
	createMutation,
	updateMutation,
	deleteMutation,
}: RegionsTabProps) => {
	const { t } = useI18n();

	const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
		onSelectCountry(e.currentTarget.value);

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
			<div className="flex flex-col gap-2 border-b border-bd-1 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex items-center gap-2">
					<InputLabel htmlFor="region-country-filter" className="mb-0 whitespace-nowrap">
						{t("admin.geo.filterByCountry")}
					</InputLabel>
					<Select id="region-country-filter" value={selectedCountryId} onChange={handleCountryChange}>
						<option value="">{t("admin.geo.selectCountry")}</option>
						{countries.map((c) => (
							<option key={c.id} value={c.id}>{c.name.ru}</option>
						))}
					</Select>
				</div>
				<Button variant="action" size="default" onClick={onOpenCreate} disabled={!selectedCountryId}>
					{t("admin.geo.regions.create")}
				</Button>
			</div>

			<div className="overflow-x-auto px-5 pb-5 pt-3">
				{!selectedCountryId ? (
					<div className="py-16 text-center text-[13px] text-t-3">
						{t("admin.geo.selectCountryFirst")}
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
				{selectedCountryId && !query.isPending && regions.length === 0 && (
					<div className="py-16 text-center text-[13px] text-t-3">
						{t("admin.geo.empty")}
					</div>
				)}
			</div>

			<RegionModal
				open={modal.open}
				item={modal.item}
				countries={countries}
				defaultCountryId={selectedCountryId}
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
	countries: Country[];
	defaultCountryId: string;
	isPending: boolean;
	onSubmit: (data: CreateRegionDto) => void;
	onClose: () => void;
}

const RegionModal = ({ open, item, countries, defaultCountryId, isPending, onSubmit, onClose }: RegionModalProps) => {
	const { t } = useI18n();
	const [name, setName] = useState({ che: "", ru: "", en: "" });
	const [countryId, setCountryId] = useState(defaultCountryId);

	useEffect(() => {
		if (open) {
			setName(item?.name ?? { che: "", ru: "", en: "" });
			setCountryId(item?.countryId ?? defaultCountryId);
		}
	}, [open, item, defaultCountryId]);

	const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
		setCountryId(e.currentTarget.value);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!name.che.trim() || !name.ru.trim() || !countryId) return;
		onSubmit({ name: { che: name.che.trim(), ru: name.ru.trim(), en: name.en.trim() }, countryId });
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
					<div>
						<InputLabel htmlFor="region-country">{t("admin.geo.filterByCountry")}</InputLabel>
						<Select id="region-country" value={countryId} onChange={handleCountryChange} required>
							<option value="">{t("admin.geo.selectCountry")}</option>
							{countries.map((c) => (
								<option key={c.id} value={c.id}>{c.name.ru}</option>
							))}
						</Select>
					</div>
					<LocalizedNameFields value={name} onChange={setName} idPrefix="region" />
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
