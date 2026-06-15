"use client";

import { PhraseLang, type AdminPhrasebookSuggestion } from "@/entities/phrasebook";
import { AdminCard } from "@/shared/ui/admin-card";
import { cn } from "@/shared/lib/cn";
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
import { CheckCheck, Inbox, Trash2 } from "lucide-react";
import { ComponentProps } from "react";

interface SuggestionsTabProps {
	suggestions: AdminPhrasebookSuggestion[];
	isLoading: boolean;
	onAccept: (s: AdminPhrasebookSuggestion) => void;
	onDelete: (id: string) => void;
	t: (key: string) => string;
}

export const SuggestionsTab = ({
	suggestions,
	isLoading,
	onAccept,
	onDelete,
	t,
}: SuggestionsTabProps) => (
	<AdminCard>
		<div className="overflow-x-auto [&::-webkit-scrollbar]:h-[3px]">
			<Table className="w-full border-collapse text-[12.5px]">
				<TableHeader>
					<TableRow>
						<TableHead className="bg-surf-2 px-2.5 py-[10px] text-left text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3 border-b border-bd-1">
							{t("adminPhrasebook.suggestions.col.phrase")}
						</TableHead>
						<TableHead
							className="bg-surf-2 px-2.5 py-[10px] text-left text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3 whitespace-nowrap border-b border-bd-1"
							style={{ width: 130 }}
						>
							{t("adminPhrasebook.suggestions.col.category")}
						</TableHead>
						<TableHead
							className="bg-surf-2 px-2.5 py-[10px] text-left text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3 whitespace-nowrap border-b border-bd-1"
							style={{ width: 44 }}
						>
							{t("adminPhrasebook.suggestions.col.lang")}
						</TableHead>
						<TableHead
							className="bg-surf-2 px-2.5 py-[10px] text-left text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3 whitespace-nowrap border-b border-bd-1"
							style={{ width: 130 }}
						>
							{t("adminPhrasebook.suggestions.col.author")}
						</TableHead>
						<TableHead
							className="bg-surf-2 px-2.5 py-[10px] text-left text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3 whitespace-nowrap border-b border-bd-1"
							style={{ width: 100 }}
						>
							{t("adminPhrasebook.suggestions.col.date")}
						</TableHead>
						<TableHead
							className="bg-surf-2 border-b border-bd-1"
							style={{ width: 72 }}
						/>
					</TableRow>
				</TableHeader>
				<TableBody>
					{isLoading ? (
						Array.from({ length: 5 }).map((_, i) => (
							<TableRow key={i} className="border-b border-bd-1">
								<TableCell className="px-2.5 py-[10px]">
									<div className="h-3 w-40 animate-pulse rounded bg-surf-3" />
									<div className="mt-1.5 h-2 w-28 animate-pulse rounded bg-surf-3" />
								</TableCell>
								{Array.from({ length: 4 }).map((_, j) => (
									<TableCell key={j} className="px-2.5 py-[10px]">
										<div className="h-3 w-14 animate-pulse rounded bg-surf-3" />
									</TableCell>
								))}
								<TableCell />
							</TableRow>
						))
					) : suggestions.length === 0 ? (
						<TableRow>
							<TableCell colSpan={6} className="px-4 py-14 text-center">
								<Inbox className="mx-auto mb-2.5 size-7 text-t-4" />
								<Typography tag="p" className="text-[12.5px] text-t-3">
									{t("adminPhrasebook.suggestions.empty")}
								</Typography>
							</TableCell>
						</TableRow>
					) : (
						suggestions.map(s => (
							<SuggestionRow
								key={s.id}
								suggestion={s}
								onAccept={onAccept}
								onDelete={onDelete}
								t={t}
							/>
						))
					)}
				</TableBody>
			</Table>
		</div>
	</AdminCard>
);

interface SuggestionRowProps {
	suggestion: AdminPhrasebookSuggestion;
	onAccept: (s: AdminPhrasebookSuggestion) => void;
	onDelete: (id: string) => void;
	t: (key: string) => string;
}

const SuggestionRow = ({
	suggestion,
	onAccept,
	onDelete,
	t,
}: SuggestionRowProps) => {
	const handleAccept: NonNullable<ComponentProps<"button">["onClick"]> = () =>
		onAccept(suggestion);
	const handleDelete: NonNullable<ComponentProps<"button">["onClick"]> = () =>
		onDelete(suggestion.id);

	return (
		<TableRow className="border-b border-bd-1 transition-colors last:border-b-0 hover:bg-surf-2 group">
			<TableCell className="px-2.5 py-[10px]">
				<Typography
					tag="p"
					className="text-[13px] font-medium text-t-1 leading-snug"
				>
					{suggestion.original}
				</Typography>
				<Typography
					tag="p"
					className="mt-0.5 text-[11.5px] text-t-3 leading-snug"
				>
					{suggestion.translation}
				</Typography>
				{suggestion.context && (
					<Typography
						tag="p"
						className="mt-0.5 text-[11px] italic text-t-3 leading-snug line-clamp-1"
					>
						{suggestion.context}
					</Typography>
				)}
			</TableCell>
			<TableCell className="px-2.5 py-[10px]">
				<Typography tag="span" className="text-[12px] text-t-2">
					{suggestion.category?.name ?? <span className="text-t-4">—</span>}
				</Typography>
			</TableCell>
			<TableCell className="px-2.5 py-[10px]">
				<Typography
					tag="span"
					className={cn(
						"inline-flex items-center rounded-[5px] px-[7px] py-[2px] text-[10.5px] font-semibold uppercase",
						suggestion.lang === PhraseLang.CHE
							? "bg-acc-bg text-acc-t"
							: "bg-surf-3 text-t-3",
					)}
				>
					{suggestion.lang}
				</Typography>
			</TableCell>
			<TableCell className="px-2.5 py-[10px]">
				<Typography tag="span" className="text-[12px] text-t-2">
					{suggestion.user.username}
				</Typography>
			</TableCell>
			<TableCell className="px-2.5 py-[10px]">
				<Typography tag="span" className="text-[11.5px] text-t-3 tabular-nums">
					{new Date(suggestion.createdAt).toLocaleDateString()}
				</Typography>
			</TableCell>
			<TableCell className="px-2 py-[10px]">
				<div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
					<Button
						size="bare"
						onClick={handleAccept}
						aria-label={t("adminPhrasebook.suggestions.accept")}
						title={t("adminPhrasebook.suggestions.accept")}
						className="flex size-7 cursor-pointer items-center justify-center rounded-[6px] text-t-3 transition-colors hover:bg-grn-bg hover:text-grn-t"
					>
						<CheckCheck className="size-[13px]" />
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
