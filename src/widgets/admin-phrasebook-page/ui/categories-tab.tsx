"use client";

import type { AdminPhrasebookCategory } from "@/entities/phrasebook";
import { Button } from "@/shared/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/shared/ui/table";
import { Typography } from "@/shared/ui/typography";
import { Inbox, Pencil, Trash2 } from "lucide-react";
import { ComponentProps } from "react";

interface CategoriesTabProps {
	categories: AdminPhrasebookCategory[];
	isLoading: boolean;
	onEdit: (cat: AdminPhrasebookCategory) => void;
	onDelete: (cat: AdminPhrasebookCategory) => void;
	t: (key: string) => string;
}

export const CategoriesTab = ({
	categories,
	isLoading,
	onEdit,
	onDelete,
	t,
}: CategoriesTabProps) => (
	<div className="overflow-hidden rounded-card border border-bd-1 bg-surf">
		<div className="overflow-x-auto [&::-webkit-scrollbar]:h-[3px]">
			<Table className="w-full border-collapse text-[12.5px]">
				<TableHeader>
					<TableRow>
						<TableHead
							className="bg-surf-2 px-2.5 py-[10px] text-left text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3 whitespace-nowrap border-b border-bd-1"
							style={{ width: 50 }}
						>
							{t("adminPhrasebook.categories.col.emoji")}
						</TableHead>
						<TableHead className="bg-surf-2 px-2.5 py-[10px] text-left text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3 border-b border-bd-1">
							{t("adminPhrasebook.categories.col.name")}
						</TableHead>
						<TableHead
							className="bg-surf-2 px-2.5 py-[10px] text-left text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3 whitespace-nowrap border-b border-bd-1"
							style={{ width: 100 }}
						>
							{t("adminPhrasebook.categories.col.phrases")}
						</TableHead>
						<TableHead
							className="bg-surf-2 px-2.5 py-[10px] text-left text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3 whitespace-nowrap border-b border-bd-1"
							style={{ width: 80 }}
						>
							{t("adminPhrasebook.categories.col.order")}
						</TableHead>
						<TableHead
							className="bg-surf-2 border-b border-bd-1"
							style={{ width: 72 }}
						/>
					</TableRow>
				</TableHeader>
				<TableBody>
					{isLoading ? (
						Array.from({ length: 6 }).map((_, i) => (
							<TableRow key={i} className="border-b border-bd-1">
								<TableCell className="px-2.5 py-[10px]">
									<div className="size-6 animate-pulse rounded bg-surf-3" />
								</TableCell>
								<TableCell className="px-2.5 py-[10px]">
									<div className="h-3 w-32 animate-pulse rounded bg-surf-3" />
								</TableCell>
								<TableCell className="px-2.5 py-[10px]">
									<div className="h-3 w-10 animate-pulse rounded bg-surf-3" />
								</TableCell>
								<TableCell className="px-2.5 py-[10px]">
									<div className="h-3 w-6 animate-pulse rounded bg-surf-3" />
								</TableCell>
								<TableCell />
							</TableRow>
						))
					) : categories.length === 0 ? (
						<TableRow>
							<TableCell colSpan={5} className="px-4 py-14 text-center">
								<Inbox className="mx-auto mb-2.5 size-7 text-t-4" />
								<Typography tag="p" className="text-[12.5px] text-t-3">
									{t("adminPhrasebook.categories.empty")}
								</Typography>
							</TableCell>
						</TableRow>
					) : (
						categories.map(cat => (
							<CategoryRow
								key={cat.id}
								category={cat}
								onEdit={onEdit}
								onDelete={onDelete}
								t={t}
							/>
						))
					)}
				</TableBody>
			</Table>
		</div>
	</div>
);

interface CategoryRowProps {
	category: AdminPhrasebookCategory;
	onEdit: (cat: AdminPhrasebookCategory) => void;
	onDelete: (cat: AdminPhrasebookCategory) => void;
	t: (key: string) => string;
}

const CategoryRow = ({ category, onEdit, onDelete, t }: CategoryRowProps) => {
	const handleEdit: NonNullable<ComponentProps<"button">["onClick"]> = () =>
		onEdit(category);
	const handleDelete: NonNullable<ComponentProps<"button">["onClick"]> = () =>
		onDelete(category);

	return (
		<TableRow className="border-b border-bd-1 transition-colors last:border-b-0 hover:bg-surf-2 group">
			<TableCell className="px-2.5 py-[10px]">
				<Typography tag="span" className="text-[20px] leading-none">
					{category.emoji}
				</Typography>
			</TableCell>
			<TableCell className="px-2.5 py-[10px]">
				<Typography tag="p" className="text-[13px] font-medium text-t-1">
					{category.name}
				</Typography>
			</TableCell>
			<TableCell className="px-2.5 py-[10px]">
				<Typography tag="span" className="tabular-nums text-[12.5px] text-t-2">
					{category._count.phrases}
				</Typography>
			</TableCell>
			<TableCell className="px-2.5 py-[10px]">
				<Typography tag="span" className="tabular-nums text-[12.5px] text-t-3">
					{category.sortOrder}
				</Typography>
			</TableCell>
			<TableCell className="px-2 py-[10px]">
				<div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
					<Button
						size="bare"
						onClick={handleEdit}
						aria-label={t("adminPhrasebook.edit")}
						title={t("adminPhrasebook.edit")}
						className="flex size-7 cursor-pointer items-center justify-center rounded-[6px] text-t-3 transition-colors hover:bg-surf-3 hover:text-t-1"
					>
						<Pencil className="size-[13px]" />
					</Button>
					<Button
						size="bare"
						onClick={handleDelete}
						aria-label={t("adminPhrasebook.delete")}
						title={t("adminPhrasebook.delete")}
						className="flex size-7 cursor-pointer items-center justify-center rounded-[6px] text-t-3 transition-colors hover:bg-red-bg hover:text-red-t"
					>
						<Trash2 className="size-[13px]" />
					</Button>
				</div>
			</TableCell>
		</TableRow>
	);
};
