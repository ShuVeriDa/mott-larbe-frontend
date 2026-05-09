"use client";

import { ComponentProps } from 'react';
import { useRouter } from "next/navigation";
import { useI18n } from "@/shared/lib/i18n";
import { cn } from "@/shared/lib/cn";
import type { AdminDictEntryCard, AdminDictRelatedLemma, AdminDictSense, AdminDictExample } from "@/entities/dictionary";
import type { DictModal } from "../model/use-admin-dictionary-detail-page";

const IconEdit = () => (
	<svg viewBox="0 0 16 16" fill="none" className="size-[13px]">
		<path d="M10.5 3.5l2 2L5 13H3v-2l7.5-7.5z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
	</svg>
);

const IconTrash = () => (
	<svg viewBox="0 0 16 16" fill="none" className="size-[13px]">
		<path d="M3 5h10M5 5V4a1 1 0 011-1h4a1 1 0 011 1v1M6 8v4M10 8v4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
		<path d="M4 5l.7 7.5A1 1 0 005.7 13h4.6a1 1 0 001-.95L12 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
	</svg>
);

const IconPlus = () => (
	<svg viewBox="0 0 16 16" fill="none" className="size-[11px]">
		<path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
	</svg>
);

interface ExampleItemProps {
	example: AdminDictExample;
	onEdit: () => void;
	onDelete: () => void;
}

const ExampleItem = ({ example, onEdit, onDelete }: ExampleItemProps) => (
	<div className="group relative rounded-lg border border-bd-1 bg-surf-2 px-3 py-2.5">
		<div className="mb-1 font-display text-[13px] italic leading-[1.4] text-t-1">
			{example.text}
		</div>
		{example.translation && (
			<div className="text-[11.5px] leading-[1.3] text-t-3">{example.translation}</div>
		)}
		<div className="absolute right-2 top-[7px] flex gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 max-sm:opacity-100">
			<button
				className="flex size-[26px] items-center justify-center rounded-md border-none bg-transparent text-t-3 transition-colors hover:bg-surf-3 hover:text-t-1"
				onClick={onEdit}
			>
				<IconEdit />
			</button>
			<button
				className="flex size-[26px] items-center justify-center rounded-md border-none bg-transparent text-t-3 transition-colors hover:bg-red-bg hover:text-red-t"
				onClick={onDelete}
			>
				<IconTrash />
			</button>
		</div>
	</div>
);

interface SenseBlockProps {
	sense: AdminDictSense;
	idx: number;
	onEditSense: () => void;
	onDeleteSense: () => void;
	onAddExample: (senseId: string) => void;
	onEditExample: (ex: AdminDictExample) => void;
	onDeleteExample: (exId: string) => void;
}

const SenseBlock = ({
	sense,
	idx,
	onEditSense,
	onDeleteSense,
	onAddExample,
	onEditExample,
	onDeleteExample,
}: SenseBlockProps) => {
	const { t } = useI18n();
		const handleClick: NonNullable<ComponentProps<"button">["onClick"]> = () => onAddExample(sense.id);
return (
		<div className="group relative border-b border-bd-1 px-4 py-3.5 transition-colors hover:bg-surf-2 last:border-b-0">
			<div className="mb-2.5 flex items-start gap-2.5">
				<div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md bg-surf-3 text-[10px] font-bold text-t-3">
					{idx}
				</div>
				<div className="min-w-0 flex-1">
					<div className="mb-0.5 text-[14px] font-medium text-t-1">{sense.definition}</div>
					{sense.notes && (
						<div className="text-[12px] italic text-t-3">{sense.notes}</div>
					)}
				</div>
				<div className="flex shrink-0 gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 max-sm:opacity-100">
					<button
						className="flex size-[26px] items-center justify-center rounded-md bg-transparent text-t-3 transition-colors hover:bg-surf-3 hover:text-t-1"
						onClick={onEditSense}
					>
						<IconEdit />
					</button>
					<button
						className="flex size-[26px] items-center justify-center rounded-md bg-transparent text-t-3 transition-colors hover:bg-red-bg hover:text-red-t"
						onClick={onDeleteSense}
					>
						<IconTrash />
					</button>
				</div>
			</div>

			{/* Examples */}
			{sense.examples.length > 0 && (
				<div className="ml-[30px] flex flex-col gap-2 mb-2.5">
					{sense.examples.map((ex) => {
					  const handleEdit: NonNullable<ComponentProps<typeof ExampleItem>["onEdit"]> = () => onEditExample(ex);
					  const handleDelete: NonNullable<ComponentProps<typeof ExampleItem>["onDelete"]> = () => onDeleteExample(ex.id);
					  return (
						<ExampleItem
							key={ex.id}
							example={ex}
							onEdit={handleEdit}
							onDelete={handleDelete}
						/>
					);
					})}
				</div>
			)}

			{/* Add example */}
			<div className="ml-[30px]">
				<button
					className="flex h-[26px] items-center gap-1.5 rounded-md border border-dashed border-bd-2 bg-transparent px-2.5 text-[11.5px] text-t-3 transition-colors hover:border-solid hover:border-acc hover:bg-acc-bg hover:text-acc-t"
					onClick={handleClick}
				>
					<IconPlus />
					{t("admin.dictionaryDetail.addExample")}
				</button>
			</div>
		</div>
	);
};

interface LemmasSensesCardProps {
	data: AdminDictEntryCard | undefined;
	relatedLemmas: AdminDictRelatedLemma[] | undefined;
	currentLemmaId: string;
	lang: string;
	isLoading: boolean;
	onOpenModal: (m: DictModal) => void;
	onDeleteSense: (senseId: string) => void;
	onDeleteExample: (exId: string) => void;
}

export const LemmasSensesCard = ({
	data,
	relatedLemmas,
	currentLemmaId,
	lang,
	isLoading,
	onOpenModal,
	onDeleteSense,
	onDeleteExample,
}: LemmasSensesCardProps) => {
	const { t } = useI18n();
	const router = useRouter();

	if (isLoading) {
		return (
			<div className="overflow-hidden rounded-xl border border-bd-1 bg-surf transition-colors">
				<div className="flex items-center justify-between border-b border-bd-1 px-4 py-3">
					<div className="h-3 w-32 animate-pulse rounded bg-surf-3" />
				</div>
				{[0, 1].map((i) => (
					<div key={i} className="border-b border-bd-1 px-4 py-3.5">
						<div className="mb-2 flex gap-2.5">
							<div className="size-5 animate-pulse rounded-md bg-surf-3" />
							<div className="h-4 w-48 animate-pulse rounded bg-surf-3" />
						</div>
					</div>
				))}
			</div>
		);
	}

	if (!data) return null;

	const tabs = relatedLemmas && relatedLemmas.length > 1 ? relatedLemmas : null;

		const handleClick: NonNullable<ComponentProps<"button">["onClick"]> = () => onOpenModal({ type: "addSense" });
	const handleClick2: NonNullable<ComponentProps<"button">["onClick"]> = () => onOpenModal({ type: "addSense" });
return (
		<div className="overflow-hidden rounded-xl border border-bd-1 bg-surf transition-colors">
			{/* Header */}
			<div className="flex items-center justify-between border-b-0 px-4 py-3">
				<span className="text-[11.5px] font-semibold uppercase tracking-[0.5px] text-t-2">
					{t("admin.dictionaryDetail.lemmasAndSenses")}
				</span>
				<button
					className="flex h-[26px] items-center gap-1.5 rounded-md border border-bd-2 bg-transparent px-2.5 text-[11.5px] text-t-2 transition-colors hover:border-bd-3 hover:bg-surf-2 hover:text-t-1"
					onClick={handleClick}
				>
					<svg width="11" height="11" viewBox="0 0 16 16" fill="none">
						<path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
					</svg>
					{t("admin.dictionaryDetail.addSense")}
				</button>
			</div>

			{/* Lemma tabs (only if multiple lemmas for this entry) */}
			{tabs && (
				<div className="mx-4 mb-0 mt-0">
					<div className="flex w-fit gap-0 rounded-[9px] bg-surf-2 p-0.5">
						{tabs.map((lemma) => {
						  const handleClick: NonNullable<ComponentProps<"button">["onClick"]> = () => {
									if (!lemma.isCurrent) router.push(`/${lang}/admin/dictionary/${lemma.id}`);
								};
						  return (
							<button
								key={lemma.id}
								className={cn(
									"rounded-[6px] px-3.5 py-1 font-display text-[12.5px] font-medium transition-colors",
									lemma.isCurrent
										? "bg-surf text-t-1 shadow-[0_1px_3px_rgba(0,0,0,0.07)]"
										: "bg-transparent text-t-3 hover:text-t-2",
								)}
								onClick={handleClick}
							>
								{lemma.baseForm}{" "}
								{lemma.partOfSpeech && (
									<span className="font-sans text-[10px] opacity-50">{lemma.partOfSpeech}</span>
								)}
							</button>
						);
						})}
					</div>
				</div>
			)}

			{/* Senses list */}
			<div className="mt-2">
				{data.senses.length === 0 ? (
					<div className="px-4 py-6 text-center text-[12.5px] text-t-3">
						{t("admin.dictionaryDetail.noSenses")}
					</div>
				) : (
					data.senses.map((sense, i) => {
					  const handleEditSense: NonNullable<ComponentProps<typeof SenseBlock>["onEditSense"]> = () => onOpenModal({ type: "editSense", sense });
					  const handleDeleteSense: NonNullable<ComponentProps<typeof SenseBlock>["onDeleteSense"]> = () => onDeleteSense(sense.id);
					  const handleAddExample: NonNullable<ComponentProps<typeof SenseBlock>["onAddExample"]> = (senseId) => onOpenModal({ type: "addExample", senseId });
					  const handleEditExample: NonNullable<ComponentProps<typeof SenseBlock>["onEditExample"]> = (ex) => onOpenModal({ type: "editExample", example: ex });
					  return (
						<SenseBlock
							key={sense.id}
							sense={sense}
							idx={i + 1}
							onEditSense={handleEditSense}
							onDeleteSense={handleDeleteSense}
							onAddExample={handleAddExample}
							onEditExample={handleEditExample}
							onDeleteExample={onDeleteExample}
						/>
					);
					})
				)}
			</div>

			{/* Add sense footer */}
			<div className="flex items-center border-t border-bd-1 px-4 py-2.5">
				<button
					className="flex h-[26px] items-center gap-1.5 rounded-md border border-dashed border-bd-2 bg-transparent px-2.5 text-[11.5px] text-t-3 transition-colors hover:border-solid hover:border-acc hover:bg-acc-bg hover:text-acc-t"
					onClick={handleClick2}
				>
					<IconPlus />
					{t("admin.dictionaryDetail.addSense")}
				</button>
			</div>
		</div>
	);
};
