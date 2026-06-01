"use client";

import type { AdminGenre } from "@/entities/genre";
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { useAdminGenresPage } from "../model/use-admin-genres-page";
import { GenreModal } from "./genre-modal";

export const AdminGenresPage = () => {
	const { t } = useI18n();
	const {
		genresQuery,
		genres,
		modalOpen,
		editGenre,
		isSubmitting,
		isDeleting,
		handleOpenCreate,
		handleOpenEdit,
		handleCloseModal,
		handleDelete,
		handleSubmit,
	} = useAdminGenresPage();

	return (
		<div className="flex min-h-0 flex-1 flex-col">
			{/* Topbar */}
			<div className="flex items-center justify-between border-b border-bd-1 px-5 py-3.5">
				<div>
					<Typography tag="h1" className="text-[15px] font-semibold text-t-1">
						{t("admin.genres.title")}
					</Typography>
					<Typography tag="p" className="text-[12px] text-t-3">
						{t("admin.genres.subtitle")}
					</Typography>
				</div>
				<Button variant="action" size="default" onClick={handleOpenCreate}>
					{t("admin.genres.create")}
				</Button>
			</div>

			<div className="overflow-y-auto px-5 py-5">
				{genresQuery.isPending ? (
					<GenresTableSkeleton />
				) : (
					<table className="w-full text-[13px]">
						<thead>
							<tr className="border-b border-bd-1 text-left text-[11px] font-medium uppercase tracking-wide text-t-3">
								<th className="pb-2 pr-4">{t("admin.genres.table.name")}</th>
								<th className="pb-2 pr-4">{t("admin.genres.table.slug")}</th>
								<th className="pb-2 pr-4 text-right">{t("admin.genres.table.sortOrder")}</th>
								<th className="pb-2 pr-4 text-right">{t("admin.genres.table.texts")}</th>
								<th className="pb-2 text-right">{t("admin.genres.table.actions")}</th>
							</tr>
						</thead>
						<tbody>
							{genres.map((genre) => (
								<GenreRow
									key={genre.id}
									genre={genre}
									isDeleting={isDeleting}
									onEdit={handleOpenEdit}
									onDelete={handleDelete}
								/>
							))}
						</tbody>
					</table>
				)}

				{!genresQuery.isPending && genres.length === 0 && (
					<div className="py-16 text-center text-[13px] text-t-3">
						{t("admin.genres.empty")}
					</div>
				)}
			</div>

			<GenreModal
				open={modalOpen}
				genre={editGenre}
				isLoading={isSubmitting}
				onSubmit={handleSubmit}
				onClose={handleCloseModal}
			/>
		</div>
	);
};

interface GenreRowProps {
	genre: AdminGenre;
	isDeleting: boolean;
	onEdit: (genre: AdminGenre) => void;
	onDelete: (id: string) => void;
}

const GenreRow = ({ genre, isDeleting, onEdit, onDelete }: GenreRowProps) => {
	const { t } = useI18n();

	const handleEdit = () => onEdit(genre);
	const handleDelete = () => {
		if (confirm(t("admin.genres.deleteConfirm", { name: genre.name }))) {
			onDelete(genre.id);
		}
	};

	return (
		<tr className="border-b border-bd-1 hover:bg-surf-2">
			<td className="py-2.5 pr-4 font-medium text-t-1">{genre.name}</td>
			<td className="py-2.5 pr-4 font-mono text-[12px] text-t-3">{genre.slug}</td>
			<td className="py-2.5 pr-4 text-right text-t-2">{genre.sortOrder}</td>
			<td className="py-2.5 pr-4 text-right text-t-2">{genre._count.texts}</td>
			<td className="py-2.5 text-right">
				<div className="flex justify-end gap-2">
					<Button variant="ghost" size="default" onClick={handleEdit}>
						{t("common.edit")}
					</Button>
					<Button
						variant="danger"
						size="default"
						onClick={handleDelete}
						disabled={isDeleting}
					>
						{t("common.delete")}
					</Button>
				</div>
			</td>
		</tr>
	);
};

const GenresTableSkeleton = () => (
	<div className="flex flex-col gap-2">
		{Array.from({ length: 8 }).map((_, i) => (
			<div key={i} className="h-10 animate-pulse rounded bg-surf-2" />
		))}
	</div>
);
