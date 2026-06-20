"use client";

import type { Settlement, District, Region, CreateSettlementDto, PaginatedResponse, SettlementType } from "@/entities/geo";
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { Select } from "@/shared/ui/select";
import { Skeleton } from "@/shared/ui/skeleton";
import { InputLabel } from "@/shared/ui/input";
import { useEffect, useState } from "react";
import type { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import { LocalizedNameFields } from "./localized-name-fields";

const SETTLEMENT_TYPES: SettlementType[] = ["city", "village", "town"];

const settlementTypeBadgeVariant = (type: SettlementType) => {
	if (type === "city") return "acc" as const;
	if (type === "town") return "amb" as const;
	return "neu" as const;
};

interface SettlementsTabProps {
	settlements: Settlement[];
	regions: Region[];
	districts: District[];
	selectedRegionId: string;
	selectedDistrictId: string;
	query: UseQueryResult<PaginatedResponse<Settlement>>;
	modal: { open: boolean; item: Settlement | null };
	onSelectRegion: (id: string) => void;
	onSelectDistrict: (id: string) => void;
	onOpenCreate: () => void;
	onOpenEdit: (item: Settlement) => void;
	onCloseModal: () => void;
	createMutation: UseMutationResult<Settlement, Error, CreateSettlementDto>;
	updateMutation: UseMutationResult<Settlement, Error, unknown>;
	deleteMutation: UseMutationResult<unknown, Error, string>;
}

export const SettlementsTab = ({
	settlements,
	regions,
	districts,
	selectedRegionId,
	selectedDistrictId,
	query,
	modal,
	onSelectRegion,
	onSelectDistrict,
	onOpenCreate,
	onOpenEdit,
	onCloseModal,
	createMutation,
	updateMutation,
	deleteMutation,
}: SettlementsTabProps) => {
	const { t } = useI18n();

	const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		onSelectRegion(e.currentTarget.value);
		onSelectDistrict("");
	};

	const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
		onSelectDistrict(e.currentTarget.value);

	const handleEdit = (item: Settlement) => onOpenEdit(item);
	const handleDelete = (item: Settlement) => {
		if (confirm(t("admin.geo.deleteConfirm", { name: item.name.ru }))) {
			deleteMutation.mutate(item.id);
		}
	};

	const handleSubmit = (data: CreateSettlementDto) => {
		if (modal.item) {
			(updateMutation as UseMutationResult<Settlement, Error, unknown>).mutate({ id: modal.item.id, ...data });
		} else {
			createMutation.mutate(data);
		}
	};

	const isPending = createMutation.isPending || updateMutation.isPending;

	const getTypeLabel = (type: SettlementType) => t(`location.type_${type}`);

	return (
		<>
			<div className="flex flex-col gap-2 border-b border-bd-1 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex flex-wrap items-center gap-2">
					<InputLabel htmlFor="settlement-region-filter" className="mb-0 whitespace-nowrap">
						{t("admin.geo.filterByRegion")}
					</InputLabel>
					<Select id="settlement-region-filter" value={selectedRegionId} onChange={handleRegionChange}>
						<option value="">{t("admin.geo.selectRegion")}</option>
						{regions.map((r) => (
							<option key={r.id} value={r.id}>{r.name.ru}</option>
						))}
					</Select>
					<InputLabel htmlFor="settlement-district-filter" className="mb-0 whitespace-nowrap">
						{t("location.district")}
					</InputLabel>
					<Select id="settlement-district-filter" value={selectedDistrictId} onChange={handleDistrictChange} disabled={!selectedRegionId}>
						<option value="">{t("admin.geo.selectDistrict")}</option>
						{districts.map((d) => (
							<option key={d.id} value={d.id}>{d.name.ru}</option>
						))}
					</Select>
				</div>
				<Button variant="action" size="default" onClick={onOpenCreate} disabled={!selectedDistrictId}>
					{t("admin.geo.settlements.create")}
				</Button>
			</div>

			<div className="overflow-x-auto px-5 pb-5 pt-3">
				{!selectedDistrictId ? (
					<div className="py-16 text-center text-[13px] text-t-3">
						{t("admin.geo.selectDistrictFirst")}
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
								<th className="pb-2 pr-4">{t("admin.geo.table.type")}</th>
								<th className="pb-2 text-right">{t("admin.heritage.table.actions")}</th>
							</tr>
						</thead>
						<tbody>
							{settlements.map((item) => (
								<SettlementRow
									key={item.id}
									item={item}
									typeLabel={getTypeLabel(item.type)}
									isDeleting={deleteMutation.isPending}
									onEdit={handleEdit}
									onDelete={handleDelete}
								/>
							))}
						</tbody>
					</table>
				)}
				{selectedDistrictId && !query.isPending && settlements.length === 0 && (
					<div className="py-16 text-center text-[13px] text-t-3">
						{t("admin.geo.empty")}
					</div>
				)}
			</div>

			<SettlementModal
				open={modal.open}
				item={modal.item}
				districts={districts}
				defaultDistrictId={selectedDistrictId}
				isPending={isPending}
				onSubmit={handleSubmit}
				onClose={onCloseModal}
			/>
		</>
	);
};

interface SettlementRowProps {
	item: Settlement;
	typeLabel: string;
	isDeleting: boolean;
	onEdit: (item: Settlement) => void;
	onDelete: (item: Settlement) => void;
}

const SettlementRow = ({ item, typeLabel, isDeleting, onEdit, onDelete }: SettlementRowProps) => {
	const { t } = useI18n();
	const handleEdit = () => onEdit(item);
	const handleDelete = () => onDelete(item);

	return (
		<tr className="border-b border-bd-1 hover:bg-surf-2">
			<td className="py-2.5 pr-4 font-medium text-t-1">{item.name.che}</td>
			<td className="py-2.5 pr-4 text-t-2">{item.name.ru}</td>
			<td className="py-2.5 pr-4 text-t-2">{item.name.en}</td>
			<td className="py-2.5 pr-4">
				<Badge variant={settlementTypeBadgeVariant(item.type)}>{typeLabel}</Badge>
			</td>
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

interface SettlementModalProps {
	open: boolean;
	item: Settlement | null;
	districts: District[];
	defaultDistrictId: string;
	isPending: boolean;
	onSubmit: (data: CreateSettlementDto) => void;
	onClose: () => void;
}

const SettlementModal = ({ open, item, districts, defaultDistrictId, isPending, onSubmit, onClose }: SettlementModalProps) => {
	const { t } = useI18n();
	const [name, setName] = useState({ che: "", ru: "", en: "" });
	const [districtId, setDistrictId] = useState(defaultDistrictId);
	const [type, setType] = useState<SettlementType>("village");

	useEffect(() => {
		if (open) {
			setName(item?.name ?? { che: "", ru: "", en: "" });
			setDistrictId(item?.districtId ?? defaultDistrictId);
			setType(item?.type ?? "village");
		}
	}, [open, item, defaultDistrictId]);

	const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
		setDistrictId(e.currentTarget.value);

	const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
		setType(e.currentTarget.value as SettlementType);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!name.che.trim() || !name.ru.trim() || !districtId) return;
		onSubmit({ name: { che: name.che.trim(), ru: name.ru.trim(), en: name.en.trim() }, districtId, type });
	};

	return (
		<Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>
						{item ? t("admin.geo.settlements.editTitle") : t("admin.geo.settlements.createTitle")}
					</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
					<div>
						<InputLabel htmlFor="settlement-district">{t("location.district")}</InputLabel>
						<Select id="settlement-district" value={districtId} onChange={handleDistrictChange} required>
							<option value="">{t("admin.geo.selectDistrict")}</option>
							{districts.map((d) => (
								<option key={d.id} value={d.id}>{d.name.ru}</option>
							))}
						</Select>
					</div>
					<LocalizedNameFields value={name} onChange={setName} idPrefix="settlement" />
					<div>
						<InputLabel htmlFor="settlement-type">{t("admin.geo.table.type")}</InputLabel>
						<Select id="settlement-type" value={type} onChange={handleTypeChange} required>
							{SETTLEMENT_TYPES.map((tp) => (
								<option key={tp} value={tp}>{t(`location.type_${tp}`)}</option>
							))}
						</Select>
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
