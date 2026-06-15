"use client";

import {
	PhraseLang,
	type AdminPhrasebookCategory,
	type AdminPhrasebookPhrase,
} from "@/entities/phrasebook";
import { AdminCard } from "@/shared/ui/admin-card";
import { cn } from "@/shared/lib/cn";
import { Button } from "@/shared/ui/button";
import { SearchBox } from "@/shared/ui/search-box";
import { Select } from "@/shared/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/shared/ui/table";
import { Typography } from "@/shared/ui/typography";
import { Bookmark, Inbox, Pencil, Trash2 } from "lucide-react";
import { ComponentProps } from "react";

interface PhrasesTabProps {
	phrases: AdminPhrasebookPhrase[];
	categories: AdminPhrasebookCategory[];
	isLoading: boolean;
	search: string;
	categoryId: string | undefined;
	total: number;
	page: number;
	totalPages: number;
	onSearchChange: (v: string) => void;
	onCategoryFilter: (id: string | null) => void;
	onPageChange: (p: number) => void;
	onEdit: (phrase: AdminPhrasebookPhrase) => void;
	onDelete: (phrase: AdminPhrasebookPhrase) => void;
	t: (key: string) => string;
}

export const PhrasesTab = ({
	phrases,
	categories,
	isLoading,
	search,
	categoryId,
	total,
	page,
	totalPages,
	onSearchChange,
	onCategoryFilter,
	onPageChange,
	onEdit,
	onDelete,
	t,
}: PhrasesTabProps) => {
	const handleSearchChange: NonNullable<
		ComponentProps<"input">["onChange"]
	> = e => onSearchChange(e.currentTarget.value);

	const handleCategoryChange: NonNullable<
		ComponentProps<"select">["onChange"]
	> = e => onCategoryFilter(e.currentTarget.value || null);

	const handlePrevPageClick = () => onPageChange(page - 1);
	const handleNextPageClick = () => onPageChange(page + 1);

	return (
		<>
			<div className="mb-3.5 flex flex-wrap items-center gap-2">
				<SearchBox
					value={search}
					onChange={handleSearchChange}
					placeholder={t("adminPhrasebook.phrases.searchPlaceholder")}
					wrapperClassName="min-w-[180px] flex-1 max-sm:min-w-full max-sm:order-first"
					className="h-8"
				/>
				<div className="flex flex-wrap gap-1.5">
					<Select
						value={categoryId ?? ""}
						onChange={handleCategoryChange}
						wrapperClassName="w-auto"
						className="bg-surf text-t-2 rounded-lg h-8 hover:border-bd-3"
					>
						<option value="">
							{t("adminPhrasebook.phrases.allCategories")}
						</option>
						{categories.map(c => (
							<option key={c.id} value={c.id}>
								{c.emoji} {c.name}
							</option>
						))}
					</Select>
				</div>
				{total > 0 && (
					<Typography
						tag="span"
						className="ml-auto text-[11.5px] text-t-3 tabular-nums"
					>
						{t("adminPhrasebook.phrases.totalCount").replace(
							"{count}",
							String(total),
						)}
					</Typography>
				)}
			</div>

			<AdminCard>
				<div className="overflow-x-auto [&::-webkit-scrollbar]:h-[3px]">
					<Table className="w-full border-collapse text-[12.5px]">
						<TableHeader>
							<TableRow>
								<TableHead className="bg-surf-2 px-2.5 py-[10px] text-left text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3 border-b border-bd-1">
									{t("adminPhrasebook.phrases.col.phrase")}
								</TableHead>
								<TableHead
									className="bg-surf-2 px-2.5 py-[10px] text-left text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3 whitespace-nowrap border-b border-bd-1"
									style={{ width: 130 }}
								>
									{t("adminPhrasebook.phrases.col.category")}
								</TableHead>
								<TableHead
									className="bg-surf-2 px-2.5 py-[10px] text-left text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3 whitespace-nowrap border-b border-bd-1"
									style={{ width: 44 }}
								>
									{t("adminPhrasebook.phrases.col.lang")}
								</TableHead>
								<TableHead
									className="bg-surf-2 px-2.5 py-[10px] text-left text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3 whitespace-nowrap border-b border-bd-1"
									style={{ width: 70 }}
								>
									{t("adminPhrasebook.phrases.col.words")}
								</TableHead>
								<TableHead
									className="bg-surf-2 px-2.5 py-[10px] text-left text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3 whitespace-nowrap border-b border-bd-1"
									style={{ width: 60 }}
								>
									<Bookmark className="size-[13px]" />
								</TableHead>
								<TableHead
									className="bg-surf-2 border-b border-bd-1"
									style={{ width: 72 }}
								/>
							</TableRow>
						</TableHeader>
						<TableBody>
							{isLoading ? (
								Array.from({ length: 8 }).map((_, i) => (
									<TableRow key={i} className="border-b border-bd-1">
										<TableCell className="px-2.5 py-[10px]">
											<div className="h-3 w-44 animate-pulse rounded bg-surf-3" />
											<div className="mt-1.5 h-2 w-28 animate-pulse rounded bg-surf-3" />
										</TableCell>
										{Array.from({ length: 4 }).map((_, j) => (
											<TableCell key={j} className="px-2.5 py-[10px]">
												<div className="h-3 w-12 animate-pulse rounded bg-surf-3" />
											</TableCell>
										))}
										<TableCell />
									</TableRow>
								))
							) : phrases.length === 0 ? (
								<TableRow>
									<TableCell colSpan={6} className="px-4 py-14 text-center">
										<Inbox className="mx-auto mb-2.5 size-7 text-t-4" />
										<Typography tag="p" className="text-[12.5px] text-t-3">
											{search || categoryId
												? t("adminPhrasebook.phrases.emptySearch")
												: t("adminPhrasebook.phrases.empty")}
										</Typography>
									</TableCell>
								</TableRow>
							) : (
								phrases.map(phrase => (
									<PhraseRow
										key={phrase.id}
										phrase={phrase}
										categoryName={
											categories.find(c => c.id === phrase.categoryId)?.name
										}
										onEdit={onEdit}
										onDelete={onDelete}
										t={t}
									/>
								))
							)}
						</TableBody>
					</Table>
				</div>

				{totalPages > 1 && (
					<div className="flex items-center justify-between gap-2 border-t border-bd-1 px-3.5 py-2.5">
						<Typography tag="span" className="text-[11.5px] text-t-3">
							{t("adminPhrasebook.phrases.page")
								.replace("{page}", String(page))
								.replace("{total}", String(totalPages))}
						</Typography>
						<div className="flex items-center gap-1">
							<Button
								onClick={handlePrevPageClick}
								disabled={page <= 1}
								className="flex h-7 min-w-[28px] cursor-pointer items-center justify-center rounded-md border border-bd-2 bg-surf px-2 text-[12px] text-t-2 transition-colors hover:bg-surf-2 hover:text-t-1 disabled:cursor-default disabled:opacity-40"
							>
								←
							</Button>
							<Button
								onClick={handleNextPageClick}
								disabled={page >= totalPages}
								className="flex h-7 min-w-[28px] cursor-pointer items-center justify-center rounded-md border border-bd-2 bg-surf px-2 text-[12px] text-t-2 transition-colors hover:bg-surf-2 hover:text-t-1 disabled:cursor-default disabled:opacity-40"
							>
								→
							</Button>
						</div>
					</div>
				)}
			</AdminCard>
		</>
	);
};

interface PhraseRowProps {
	phrase: AdminPhrasebookPhrase;
	categoryName: string | undefined;
	onEdit: (phrase: AdminPhrasebookPhrase) => void;
	onDelete: (phrase: AdminPhrasebookPhrase) => void;
	t: (key: string) => string;
}

const PhraseRow = ({
	phrase,
	categoryName,
	onEdit,
	onDelete,
	t,
}: PhraseRowProps) => {
	const handleEdit: NonNullable<ComponentProps<"button">["onClick"]> = () =>
		onEdit(phrase);
	const handleDelete: NonNullable<ComponentProps<"button">["onClick"]> = () =>
		onDelete(phrase);

	return (
		<TableRow className="border-b border-bd-1 transition-colors last:border-b-0 hover:bg-surf-2 group">
			<TableCell className="px-2.5 py-[10px]">
				<div className="flex items-baseline gap-1.5">
					<Typography
						tag="p"
						className="text-[13px] font-medium text-t-1 leading-snug"
					>
						{phrase.original}
					</Typography>
					{phrase.transliteration && (
						<Typography
							tag="span"
							className="text-[11px] italic text-t-3 leading-snug"
						>
							{phrase.transliteration}
						</Typography>
					)}
				</div>
				<Typography
					tag="p"
					className="mt-0.5 text-[11.5px] text-t-3 leading-snug line-clamp-1"
				>
					{phrase.translation}
				</Typography>
			</TableCell>
			<TableCell className="px-2.5 py-[10px]">
				<Typography tag="span" className="text-[12px] text-t-2">
					{categoryName ?? "—"}
				</Typography>
			</TableCell>
			<TableCell className="px-2.5 py-[10px]">
				<Typography
					tag="span"
					className={cn(
						"inline-flex items-center rounded-[5px] px-[7px] py-[2px] text-[10.5px] font-semibold uppercase",
						phrase.lang === PhraseLang.CHE
							? "bg-acc-bg text-acc-t"
							: "bg-surf-3 text-t-3",
					)}
				>
					{phrase.lang}
				</Typography>
			</TableCell>
			<TableCell className="px-2.5 py-[10px]">
				<Typography tag="span" className="tabular-nums text-[12.5px] text-t-3">
					{phrase.words.length > 0 ? (
						phrase.words.length
					) : (
						<span className="text-t-4">—</span>
					)}
				</Typography>
			</TableCell>
			<TableCell className="px-2.5 py-[10px]">
				{phrase._count.saves > 0 ? (
					<Typography
						tag="span"
						className="tabular-nums text-[12.5px] text-t-2"
					>
						{phrase._count.saves}
					</Typography>
				) : (
					<Typography tag="span" className="text-t-4">
						—
					</Typography>
				)}
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
