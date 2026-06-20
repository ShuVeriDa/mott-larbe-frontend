"use client";

import type { Taip, Nation, Tukhum, CreateTaipDto } from "@/entities/heritage";
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

interface TaipsTabProps {
	taips: Taip[];
	nations: Nation[];
	tukhumy: Tukhum[];
	selectedNationId: string;
	query: UseQueryResult<PaginatedResponse<Taip>>;
	modal: { open: boolean; item: Taip | null };
	onSelectNation: (id: string) => void;
	onOpenCreate: () => void;
	onOpenEdit: (item: Taip) => void;
	onCloseModal: () => void;
	createMutation: UseMutationResult<Taip, Error, CreateTaipDto>;
	updateMutation: UseMutationResult<Taip, Error, unknown>;
	deleteMutation: UseMutationResult<unknown, Error, string>;
}

export const TaipsTab = ({
	taips,
	nations,
	tukhumy,
	selectedNationId,
	query,
	modal,
	onSelectNation,
	onOpenCreate,
	onOpenEdit,
	onCloseModal,
	createMutation,
	updateMutation,
	deleteMutation,
}: TaipsTabProps) => {
	const { t } = useI18n();

	const handleNationChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
		onSelectNation(e.currentTarget.value);

	const handleEdit = (item: Taip) => onOpenEdit(item);
	const handleDelete = (item: Taip) => {
		if (confirm(t("admin.heritage.deleteConfirm", { name: item.name.ru }))) {
			deleteMutation.mutate(item.id);
		}
	};

	const handleSubmit = (data: CreateTaipDto) => {
		if (modal.item) {
			(updateMutation as UseMutationResult<Taip, Error, unknown>).mutate({ id: modal.item.id, ...data });
		} else {
			createMutation.mutate(data);
		}
	};

	const isPending = createMutation.isPending || updateMutation.isPending;

	const getTukhumName = (tukhumId: string | null) => {
		if (!tukhumId) return "—";
		return tukhumy.find((t) => t.id === tukhumId)?.name.ru ?? tukhumId;
	};

	return (
		<>
			<div className="flex flex-col gap-2 border-b border-bd-1 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex items-center gap-2">
					<InputLabel htmlFor="taip-nation-filter" className="mb-0 whitespace-nowrap">
						{t("admin.heritage.filterByNation")}
					</InputLabel>
					<Select id="taip-nation-filter" value={selectedNationId} onChange={handleNationChange}>
						<option value="">{t("admin.heritage.selectNation")}</option>
						{nations.map((n) => (
							<option key={n.id} value={n.id}>{n.name.ru}</option>
						))}
					</Select>
				</div>
				<Button variant="action" size="default" onClick={onOpenCreate} disabled={!selectedNationId}>
					{t("admin.heritage.taips.create")}
				</Button>
			</div>

			<div className="overflow-x-auto px-5 pb-5 pt-3">
				{!selectedNationId ? (
					<div className="py-16 text-center text-[13px] text-t-3">
						{t("admin.heritage.selectNationFirst")}
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
								<th className="pb-2 pr-4">{t("heritage.tukhum")}</th>
								<th className="pb-2 text-right">{t("admin.heritage.table.actions")}</th>
							</tr>
						</thead>
						<tbody>
							{taips.map((item) => (
								<TaipRow
									key={item.id}
									item={item}
									tukhumName={getTukhumName(item.tukhumId)}
									isDeleting={deleteMutation.isPending}
									onEdit={handleEdit}
									onDelete={handleDelete}
								/>
							))}
						</tbody>
					</table>
				)}
				{selectedNationId && !query.isPending && taips.length === 0 && (
					<div className="py-16 text-center text-[13px] text-t-3">
						{t("admin.heritage.empty")}
					</div>
				)}
			</div>

			<TaipModal
				open={modal.open}
				item={modal.item}
				nations={nations}
				tukhumy={tukhumy}
				defaultNationId={selectedNationId}
				isPending={isPending}
				onSubmit={handleSubmit}
				onClose={onCloseModal}
			/>
		</>
	);
};

interface TaipRowProps {
	item: Taip;
	tukhumName: string;
	isDeleting: boolean;
	onEdit: (item: Taip) => void;
	onDelete: (item: Taip) => void;
}

const TaipRow = ({ item, tukhumName, isDeleting, onEdit, onDelete }: TaipRowProps) => {
	const { t } = useI18n();
	const handleEdit = () => onEdit(item);
	const handleDelete = () => onDelete(item);

	return (
		<tr className="border-b border-bd-1 hover:bg-surf-2">
			<td className="py-2.5 pr-4 font-medium text-t-1">{item.name.che}</td>
			<td className="py-2.5 pr-4 text-t-2">{item.name.ru}</td>
			<td className="py-2.5 pr-4 text-t-2">{item.name.en}</td>
			<td className="py-2.5 pr-4 text-[12px] text-t-3">{tukhumName}</td>
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

interface TaipModalProps {
	open: boolean;
	item: Taip | null;
	nations: Nation[];
	tukhumy: Tukhum[];
	defaultNationId: string;
	isPending: boolean;
	onSubmit: (data: CreateTaipDto) => void;
	onClose: () => void;
}

const TaipModal = ({ open, item, nations, tukhumy, defaultNationId, isPending, onSubmit, onClose }: TaipModalProps) => {
	const { t } = useI18n();
	const [name, setName] = useState({ che: "", ru: "", en: "" });
	const [nationId, setNationId] = useState(defaultNationId);
	const [tukhumId, setTukhumId] = useState<string>("");

	useEffect(() => {
		if (open) {
			setName(item?.name ?? { che: "", ru: "", en: "" });
			setNationId(item?.nationId ?? defaultNationId);
			setTukhumId(item?.tukhumId ?? "");
		}
	}, [open, item, defaultNationId]);

	const handleNationChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
		setNationId(e.currentTarget.value);

	const handleTukhumChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
		setTukhumId(e.currentTarget.value);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!name.che.trim() || !name.ru.trim() || !nationId) return;
		onSubmit({
			name: { che: name.che.trim(), ru: name.ru.trim(), en: name.en.trim() },
			nationId,
			tukhumId: tukhumId || null,
		});
	};

	return (
		<Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>
						{item ? t("admin.heritage.taips.editTitle") : t("admin.heritage.taips.createTitle")}
					</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
					<div>
						<InputLabel htmlFor="taip-nation">{t("admin.heritage.nation")}</InputLabel>
						<Select id="taip-nation" value={nationId} onChange={handleNationChange} required>
							<option value="">{t("admin.heritage.selectNation")}</option>
							{nations.map((n) => (
								<option key={n.id} value={n.id}>{n.name.ru}</option>
							))}
						</Select>
					</div>
					<div>
						<InputLabel htmlFor="taip-tukhum">{t("heritage.tukhum")}</InputLabel>
						<Select id="taip-tukhum" value={tukhumId} onChange={handleTukhumChange}>
							<option value="">{t("heritage.no_tukhum")}</option>
							{tukhumy.map((tk) => (
								<option key={tk.id} value={tk.id}>{tk.name.ru}</option>
							))}
						</Select>
					</div>
					<LocalizedNameFields value={name} onChange={setName} idPrefix="taip" />
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
