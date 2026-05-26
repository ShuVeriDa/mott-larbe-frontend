"use client";

import { Typography } from "@/shared/ui/typography";
import { Button } from "@/shared/ui/button";
import { ComponentProps, useState, useEffect } from 'react';
import { useI18n } from "@/shared/lib/i18n";
import { cn } from "@/shared/lib/cn";
import type { AddToDictionaryPayload } from "@/entities/admin-unknown-word";
import type { AddModalState } from "../model/use-admin-unknown-words-page";
import { LemmaAutocomplete } from "./lemma-autocomplete";
import { Check } from "lucide-react";
import { NewEntryForm } from "./new-entry-form";
import { Modal, ModalActions } from "@/shared/ui/modal";

type ActionType = "new" | "link";

interface UnknownWordsAddModalProps {
	state: AddModalState;
	isPending: boolean;
	onClose: () => void;
	onSubmit: (payload: AddToDictionaryPayload) => void;
	onLink: (lemmaId: string) => void;
}

export const UnknownWordsAddModal = ({
	state,
	isPending,
	onClose,
	onSubmit,
	onLink,
}: UnknownWordsAddModalProps) => {
	const { t } = useI18n();
	const [action, setAction] = useState<ActionType>("new");
	const [headword, setHeadword] = useState("");
	const [partOfSpeech, setPartOfSpeech] = useState("");
	const [translation, setTranslation] = useState("");
	const [level, setLevel] = useState("");
	const [domain, setDomain] = useState("");
	const [formsRaw, setFormsRaw] = useState("");
	const [selectedLemma, setSelectedLemma] = useState<{ id: string; label: string } | null>(null);

	useEffect(() => {
		if (state?.open) {
			// eslint-disable-next-line react-hooks/set-state-in-effect -- initialize modal form from selected unknown word
			setAction(state.initialAction ?? "new");
			setHeadword(state.word);
			setPartOfSpeech("");
			setTranslation("");
			setLevel("");
			setDomain("");
			setFormsRaw("");
			setSelectedLemma(null);
		}
	}, [state]);

	const occurrenceText =
		state?.seenCount === 1
			? t("admin.unknownWords.addModal.subtitleOccurrences", { count: state.seenCount })
			: t("admin.unknownWords.addModal.subtitleOccurrencesPlural", { count: state?.seenCount ?? 0 });

	const handleSubmit = () => {
		if (action === "new") {
			const forms = formsRaw
				.split(",")
				.map((s) => s.trim())
				.filter(Boolean);
			onSubmit({
				language: "CHE",
				translation,
				headword: headword || state.word,
				partOfSpeech: partOfSpeech || undefined,
				level: level || undefined,
				domain: domain || undefined,
				forms: forms.length ? forms : undefined,
			});
		} else {
			if (!selectedLemma) return;
			onLink(selectedLemma.id);
		}
	};

	const canSubmit =
		action === "new" ? !!translation && !isPending : !!selectedLemma && !isPending;

	const handleHeadwordChange: NonNullable<ComponentProps<"input">["onChange"]> = (e) => setHeadword(e.currentTarget.value);
	const handlePartOfSpeechChange: NonNullable<ComponentProps<"select">["onChange"]> = (e) => setPartOfSpeech(e.currentTarget.value);
	const handleTranslationChange: NonNullable<ComponentProps<"input">["onChange"]> = (e) => setTranslation(e.currentTarget.value);
	const handleLevelChange: NonNullable<ComponentProps<"select">["onChange"]> = (e) => setLevel(e.currentTarget.value);
	const handleDomainChange: NonNullable<ComponentProps<"input">["onChange"]> = (e) => setDomain(e.currentTarget.value);
	const handleFormsRawChange: NonNullable<ComponentProps<"input">["onChange"]> = (e) => setFormsRaw(e.currentTarget.value);
	const handleLemmaSelect: NonNullable<ComponentProps<typeof LemmaAutocomplete>["onSelect"]> = (id, label) => setSelectedLemma({ id, label });

	return (
		<Modal
			open={!!state?.open}
			onClose={onClose}
			title={t("admin.unknownWords.addModal.title")}
			className="max-w-[520px]"
		>
			<Typography tag="p" className="mb-4 text-[11.5px] text-t-3">{occurrenceText}</Typography>

			{/* Context snippet */}
			{state?.snippet && (
				<div className="mb-3.5 rounded-lg border-l-2 border-bd-3 bg-surf-2 px-3 py-2.5 text-[12px] leading-[1.6] text-t-2">
					{state.snippet}
				</div>
			)}

			{/* Word preview */}
			{state && (
				<div className="mb-3.5 flex items-center gap-2.5 rounded-lg bg-surf-2 px-3 py-2.5">
					<div>
						<div className="font-display text-[16px] font-semibold text-t-1">{state.word}</div>
						{state.normalized !== state.word && (
							<div className="mt-0.5 text-[11.5px] text-t-3">
								{t("admin.unknownWords.addModal.normalizedLabel")}: {state.normalized}
							</div>
						)}
					</div>
				</div>
			)}

			{/* Action selector */}
			<div className="mb-3.5">
				<div className="mb-1.5 block text-[11.5px] font-semibold text-t-2">
					{t("admin.unknownWords.addModal.actionLabel")}
				</div>
				<div className="flex flex-col gap-1.5">
					{(["new", "link"] as ActionType[]).map((type) => {
						const handleActionChange: NonNullable<ComponentProps<"input">["onChange"]> = () => setAction(type);
						return (
							<Typography tag="label"
								key={type}
								className={cn(
									"flex cursor-pointer items-center gap-2 rounded-lg border px-2.5 py-2 transition-colors",
									action === type
										? "border-acc/30 bg-acc-bg"
										: "border-bd-2 hover:border-bd-3 hover:bg-surf-2",
								)}
							>
								<input
									type="radio"
									name="dictAction"
									value={type}
									checked={action === type}
									onChange={handleActionChange}
									className="accent-acc shrink-0"
								/>
								<div>
									<div className="text-[12.5px] font-medium text-t-1">
										{t(
											type === "new"
												? "admin.unknownWords.addModal.createNew"
												: "admin.unknownWords.addModal.linkExisting",
										)}
									</div>
									<div className="text-[11px] text-t-3">
										{t(
											type === "new"
												? "admin.unknownWords.addModal.createNewSub"
												: "admin.unknownWords.addModal.linkExistingSub",
										)}
									</div>
								</div>
							</Typography>
						);
					})}
				</div>
			</div>

			{/* New entry fields */}
			{action === "new" && state && (
				<NewEntryForm
					state={state}
					headword={headword}
					partOfSpeech={partOfSpeech}
					translation={translation}
					level={level}
					domain={domain}
					formsRaw={formsRaw}
					onHeadwordChange={handleHeadwordChange}
					onPartOfSpeechChange={handlePartOfSpeechChange}
					onTranslationChange={handleTranslationChange}
					onLevelChange={handleLevelChange}
					onDomainChange={handleDomainChange}
					onFormsRawChange={handleFormsRawChange}
					t={t}
				/>
			)}

			{/* Link lemma */}
			{action === "link" && (
				<div className="mb-3">
					<Typography tag="label" className="mb-1.5 block text-[11.5px] font-semibold text-t-2">
						{t("admin.unknownWords.addModal.findLemma")}
					</Typography>
					<LemmaAutocomplete
						value={selectedLemma}
						onSelect={handleLemmaSelect}
						placeholder={t("admin.unknownWords.addModal.findLemmaPlaceholder")}
					/>
				</div>
			)}

			<ModalActions>
				<Button
					onClick={onClose}
					title={t("admin.unknownWords.addModal.cancel")}
					variant="ghost"
					className="h-[34px] px-4 rounded-lg text-[13px]"
				>
					{t("admin.unknownWords.addModal.cancel")}
				</Button>
				<Button
					onClick={handleSubmit}
					disabled={!canSubmit}
					title={action === "link" ? t("admin.unknownWords.addModal.submitLink") : t("admin.unknownWords.addModal.submit")}
					variant="action"
					className="h-[34px] px-4 rounded-lg text-[13px] flex-1"
				>
					<Check className="size-3" />
					{action === "link"
						? t("admin.unknownWords.addModal.submitLink")
						: t("admin.unknownWords.addModal.submit")}
				</Button>
			</ModalActions>
		</Modal>
	);
};
