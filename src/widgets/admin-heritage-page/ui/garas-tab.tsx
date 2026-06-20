"use client";

import type { Gara, Taip, Nation, CreateGaraDto } from "@/entities/heritage";
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { Select } from "@/shared/ui/select";
import { Skeleton } from "@/shared/ui/skeleton";
import { InputLabel } from "@/shared/ui/input";
import { useEffect, useState } from "react";
import type { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import type { PaginatedResponse } from "@/entities/heritage";
import { LocalizedNameFields } from "./localized-name-fields";

interface GarasTabProps {
	garas: Gara[];
	nations: Nation[];
	taips: Taip[];
	selectedNationId: string;
	selectedTaipId: string;
	query: UseQueryResult<PaginatedResponse<Gara>>;
	modal: { open: boolean; item: Gara | null };
	onSelectNation: (id: string) => void;
	onSelectTaip: (id: string) => void;
	onOpenCreate: () => void;
	onOpenEdit: (item: Gara) => void;
	onCloseModal: () => void;
	createMutation: UseMutationResult<Gara, Error, CreateGaraDto>;
	updateMutation: UseMutationResult<Gara, Error, unknown>;
	deleteMutation: UseMutationResult<unknown, Error, string>;
}

export const GarasTab = ({
	garas,
	nations,
	taips,
	selectedNationId,
	selectedTaipId,
	query,
	modal,
	onSelectNation,
	onSelectTaip,
	onOpenCreate,
	onOpenEdit,
	onCloseModal,
	createMutation,
	updateMutation,
	deleteMutation,
}: GarasTabProps) => {
	const { t } = useI18n();

	const handleNationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		onSelectNation(e.currentTarget.value);
		onSelectTaip("");
	};

	const handleTaipChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
		onSelectTaip(e.currentTarget.value);

	const handleEdit = (item: Gara) => onOpenEdit(item);
	const handleDelete = (item: Gara) => {
		if (confirm(t("admin.heritage.deleteConfirm", { name: item.name.ru }))) {
			deleteMutation.mutate(item.id);
		}
	};

	const handleSubmit = (data: CreateGaraDto) => {
		if (modal.item) {
			(updateMutation as UseMutationResult<Gara, Error, unknown>).mutate({ id: modal.item.id, ...data });
		} else {
			createMutation.mutate(data);
		}
	};

	const isPending = createMutation.isPending || updateMutation.isPending;

	return (
		<>
			<div className="flex flex-col gap-2 border-b border-bd-1 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex flex-wrap items-center gap-2">
					<InputLabel htmlFor="gara-nation-filter" className="mb-0 whitespace-nowrap">
						{t("admin.heritage.filterByNation")}
					</InputLabel>
					<Select id="gara-nation-filter" value={selectedNationId} onChange={handleNationChange}>
						<option value="">{t("admin.heritage.selectNation")}</option>
						{nations.map((n) => (
							<option key={n.id} value={n.id}>{n.name.ru}</option>
						))}
					</Select>
					<InputLabel htmlFor="gara-taip-filter" className="mb-0 whitespace-nowrap">
						{t("heritage.taip")}
					</InputLabel>
					<Select id="gara-taip-filter" value={selectedTaipId} onChange={handleTaipChange} disabled={!selectedNationId}>
						<option value="">{t("admin.heritage.selectTaip")}</option>
						{taips.map((tp) => (
							<option key={tp.id} value={tp.id}>{tp.name.ru}</option>
						))}
					</Select>
				</div>
				<Button variant="action" size="default" onClick={onOpenCreate} disabled={!selectedTaipId}>
					{t("admin.heritage.garas.create")}
				</Button>
			</div>

			<div className="overflow-x-auto px-5 pb-5 pt-3">
				{!selectedTaipId ? (
					<div className="py-16 text-center text-[13px] text-t-3">
						{t("admin.heritage.selectTaipFirst")}
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
							{garas.map((item) => (
								<GaraRow
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
				{selectedTaipId && !query.isPending && garas.length === 0 && (
					<div className="py-16 text-center text-[13px] text-t-3">
						{t("admin.heritage.empty")}
					</div>
				)}
			</div>

			<GaraModal
				open={modal.open}
				item={modal.item}
				taips={taips}
				defaultTaipId={selectedTaipId}
				isPending={isPending}
				onSubmit={handleSubmit}
				onClose={onCloseModal}
			/>
		</>
	);
};

interface GaraRowProps {
	item: Gara;
	isDeleting: boolean;
	onEdit: (item: Gara) => void;
	onDelete: (item: Gara) => void;
}

const GaraRow = ({ item, isDeleting, onEdit, onDelete }: GaraRowProps) => {
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

interface GaraModalProps {
	open: boolean;
	item: Gara | null;
	taips: Taip[];
	defaultTaipId: string;
	isPending: boolean;
	onSubmit: (data: CreateGaraDto) => void;
	onClose: () => void;
}

const GaraModal = ({ open, item, taips, defaultTaipId, isPending, onSubmit, onClose }: GaraModalProps) => {
	const { t } = useI18n();
	const [name, setName] = useState({ che: "", ru: "", en: "" });
	const [taipId, setTaipId] = useState(defaultTaipId);

	useEffect(() => {
		if (open) {
			setName(item?.name ?? { che: "", ru: "", en: "" });
			setTaipId(item?.taipId ?? defaultTaipId);
		}
	}, [open, item, defaultTaipId]);

	const handleTaipChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
		setTaipId(e.currentTarget.value);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!name.che.trim() || !name.ru.trim() || !taipId) return;
		onSubmit({ name: { che: name.che.trim(), ru: name.ru.trim(), en: name.en.trim() }, taipId });
	};

	return (
		<Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>
						{item ? t("admin.heritage.garas.editTitle") : t("admin.heritage.garas.createTitle")}
					</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
					<div>
						<InputLabel htmlFor="gara-taip">{t("heritage.taip")}</InputLabel>
						<Select id="gara-taip" value={taipId} onChange={handleTaipChange} required>
							<option value="">{t("admin.heritage.selectTaip")}</option>
							{taips.map((tp) => (
								<option key={tp.id} value={tp.id}>{tp.name.ru}</option>
							))}
						</Select>
					</div>
					<LocalizedNameFields value={name} onChange={setName} idPrefix="gara" />
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
