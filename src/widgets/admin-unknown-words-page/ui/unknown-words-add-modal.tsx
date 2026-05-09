"use client";

import { Typography } from "@/shared/ui/typography";
import { Button } from "@/shared/ui/button";
import { ComponentProps, useEffect, useRef, useState } from 'react';
import { useI18n } from "@/shared/lib/i18n";
import { cn } from "@/shared/lib/cn";
import type { AddToDictionaryPayload } from "@/entities/admin-unknown-word";
import type { AddModalState } from "../model/use-admin-unknown-words-page";
import { useLemmaSearch } from "@/entities/admin-unknown-word";

type ActionType = "new" | "link";

interface UnknownWordsAddModalProps {
	state: AddModalState;
	isPending: boolean;
	onClose: () => void;
	onSubmit: (payload: AddToDictionaryPayload) => void;
	onLink: (lemmaId: string) => void;
}

const inputCls =
	"h-9 w-full rounded-lg border border-bd-2 bg-surf-2 px-2.5 text-[13px] text-t-1 outline-none placeholder:text-t-3 focus:border-acc focus:bg-surf transition-colors";
const selectCls = cn(inputCls, "cursor-pointer appearance-none pr-7");
const CHEVRON_BG =
	"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='11' height='11' viewBox='0 0 16 16' fill='none'%3E%3Cpath d='M4 6l4 4 4-4' stroke='%23a5a39a' stroke-width='1.4' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")";

// ── Sub-components ─────────────────────────────────────────────────────────────

const LemmaAutocomplete = ({
	value,
	onSelect,
	placeholder,
}: {
	value: { id: string; label: string } | null;
	onSelect: (id: string, label: string) => void;
	placeholder: string;
}) => {
	const [q, setQ] = useState(value?.label ?? "");
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);
	const { data, isFetching } = useLemmaSearch(q);

	useEffect(() => {
		if (!value) {
			// eslint-disable-next-line react-hooks/set-state-in-effect -- clear local query when external value resets
			setQ("");
		}
	}, [value]);

	useEffect(() => {
		const handler = (e: MouseEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node /* intentional: outside-click target */)) setOpen(false);
		};
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, []);

	const handleChange: NonNullable<ComponentProps<"input">["onChange"]> = (e) => {
		setQ(e.currentTarget.value);
		setOpen(true);
	};
	const handleFocus: NonNullable<ComponentProps<"input">["onFocus"]> = () => q && setOpen(true);

	return (
		<div ref={ref} className="relative">
			<input
				type="text"
				value={q}
				onChange={handleChange}
				onFocus={handleFocus}
				placeholder={placeholder}
				className={inputCls}
				autoComplete="off"
			/>
			{open && q.length >= 1 && (
				<div className="absolute left-0 top-[calc(100%+4px)] z-30 w-full max-h-[220px] overflow-y-auto [&::-webkit-scrollbar]:w-0 rounded-[9px] border border-bd-2 bg-surf shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
					{isFetching && !data?.length ? (
						<div className="px-3 py-2.5 text-[12px] text-t-3">…</div>
					) : data?.length ? (
						data.map((item) => {
							const handleMouseDown: NonNullable<ComponentProps<"button">["onMouseDown"]> = (e) => {
								e.preventDefault();
								onSelect(item.id, item.headword);
								setQ(
									item.translation
										? `${item.headword} — ${item.translation}`
										: item.headword,
								);
								setOpen(false);
							};
							return (
								<Button
									key={item.id}
									onMouseDown={handleMouseDown}
									className="flex w-full flex-col gap-0.5 px-3 py-2 text-left transition-colors hover:bg-surf-2"
								>
									<Typography tag="span" className="text-[13px] font-medium text-t-1">{item.headword}</Typography>
									{item.translation && (
										<Typography tag="span" className="text-[11px] text-t-3">{item.translation}</Typography>
									)}
								</Button>
							);
						})
					) : (
						<div className="px-3 py-2.5 text-[12px] text-t-3">—</div>
					)}
				</div>
			)}
		</div>
	);
};

const NewEntryForm = ({
	state,
	headword,
	partOfSpeech,
	translation,
	level,
	domain,
	formsRaw,
	onHeadwordChange,
	onPartOfSpeechChange,
	onTranslationChange,
	onLevelChange,
	onDomainChange,
	onFormsRawChange,
	t,
}: {
	state: AddModalState;
	headword: string;
	partOfSpeech: string;
	translation: string;
	level: string;
	domain: string;
	formsRaw: string;
	onHeadwordChange: NonNullable<ComponentProps<"input">["onChange"]>;
	onPartOfSpeechChange: NonNullable<ComponentProps<"select">["onChange"]>;
	onTranslationChange: NonNullable<ComponentProps<"input">["onChange"]>;
	onLevelChange: NonNullable<ComponentProps<"select">["onChange"]>;
	onDomainChange: NonNullable<ComponentProps<"input">["onChange"]>;
	onFormsRawChange: NonNullable<ComponentProps<"input">["onChange"]>;
	t: ReturnType<typeof useI18n>["t"];
}) => (
	<div>
		<div className="grid grid-cols-2 gap-2.5 max-sm:grid-cols-1">
			<div className="mb-3">
				<Typography tag="label" className="mb-1.5 block text-[11.5px] font-semibold text-t-2">
					{t("admin.unknownWords.addModal.headword")}
				</Typography>
				<input
					type="text"
					value={headword}
					onChange={onHeadwordChange}
					placeholder={state?.word}
					className={inputCls}
				/>
			</div>
			<div className="mb-3">
				<Typography tag="label" className="mb-1.5 block text-[11.5px] font-semibold text-t-2">
					{t("admin.unknownWords.addModal.partOfSpeech")}
				</Typography>
				<select
					value={partOfSpeech}
					onChange={onPartOfSpeechChange}
					className={selectCls}
					style={{
						backgroundImage: CHEVRON_BG,
						backgroundRepeat: "no-repeat",
						backgroundPosition: "right 8px center",
					}}
				>
					<option value="">{t("admin.unknownWords.addModal.posNone")}</option>
					<option value="noun">{t("admin.unknownWords.addModal.posNoun")}</option>
					<option value="verb">{t("admin.unknownWords.addModal.posVerb")}</option>
					<option value="adjective">{t("admin.unknownWords.addModal.posAdj")}</option>
					<option value="adverb">{t("admin.unknownWords.addModal.posAdv")}</option>
					<option value="particle">{t("admin.unknownWords.addModal.posParticle")}</option>
				</select>
			</div>
		</div>

		<div className="mb-3">
			<Typography tag="label" className="mb-1.5 block text-[11.5px] font-semibold text-t-2">
				{t("admin.unknownWords.addModal.translation")}
			</Typography>
			<input
				type="text"
				value={translation}
				onChange={onTranslationChange}
				placeholder={t("admin.unknownWords.addModal.translationPlaceholder")}
				className={inputCls}
			/>
		</div>

		<div className="grid grid-cols-2 gap-2.5 max-sm:grid-cols-1">
			<div className="mb-3">
				<Typography tag="label" className="mb-1.5 block text-[11.5px] font-semibold text-t-2">
					{t("admin.unknownWords.addModal.level")}
				</Typography>
				<select
					value={level}
					onChange={onLevelChange}
					className={selectCls}
					style={{
						backgroundImage: CHEVRON_BG,
						backgroundRepeat: "no-repeat",
						backgroundPosition: "right 8px center",
					}}
				>
					<option value="">{t("admin.unknownWords.addModal.levelNone")}</option>
					{["A1", "A2", "B1", "B2", "C1", "C2"].map((l) => (
						<option key={l} value={l}>{l}</option>
					))}
				</select>
			</div>
			<div className="mb-3">
				<Typography tag="label" className="mb-1.5 block text-[11.5px] font-semibold text-t-2">
					{t("admin.unknownWords.addModal.domain")}
				</Typography>
				<input
					type="text"
					value={domain}
					onChange={onDomainChange}
					placeholder={t("admin.unknownWords.addModal.domainPlaceholder")}
					className={inputCls}
				/>
			</div>
		</div>

		<div className="mb-3">
			<Typography tag="label" className="mb-1.5 block text-[11.5px] font-semibold text-t-2">
				{t("admin.unknownWords.addModal.forms")}
			</Typography>
			<input
				type="text"
				value={formsRaw}
				onChange={onFormsRawChange}
				placeholder={t("admin.unknownWords.addModal.formsPlaceholder")}
				className={inputCls}
			/>
			<Typography tag="p" className="mt-1 text-[11px] text-t-3">
				{t("admin.unknownWords.addModal.formsHint")}
			</Typography>
		</div>
	</div>
);

// ── Main component ─────────────────────────────────────────────────────────────

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

	if (!state?.open) return null;

	const occurrenceText =
		state.seenCount === 1
			? t("admin.unknownWords.addModal.subtitleOccurrences", { count: state.seenCount })
			: t("admin.unknownWords.addModal.subtitleOccurrencesPlural", { count: state.seenCount });

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

	const handleBackdropClick: NonNullable<ComponentProps<"div">["onClick"]> = (e) =>
		/* intentional: backdrop-only click */ e.target === e.currentTarget && onClose();
	const handleHeadwordChange: NonNullable<ComponentProps<"input">["onChange"]> = (e) => setHeadword(e.currentTarget.value);
	const handlePartOfSpeechChange: NonNullable<ComponentProps<"select">["onChange"]> = (e) => setPartOfSpeech(e.currentTarget.value);
	const handleTranslationChange: NonNullable<ComponentProps<"input">["onChange"]> = (e) => setTranslation(e.currentTarget.value);
	const handleLevelChange: NonNullable<ComponentProps<"select">["onChange"]> = (e) => setLevel(e.currentTarget.value);
	const handleDomainChange: NonNullable<ComponentProps<"input">["onChange"]> = (e) => setDomain(e.currentTarget.value);
	const handleFormsRawChange: NonNullable<ComponentProps<"input">["onChange"]> = (e) => setFormsRaw(e.currentTarget.value);
	const handleLemmaSelect: NonNullable<ComponentProps<typeof LemmaAutocomplete>["onSelect"]> = (id, label) => setSelectedLemma({ id, label });

	return (
		<div
			className="fixed inset-0 z-200 flex items-center justify-center bg-black/35 p-4 backdrop-blur-sm max-sm:items-end max-sm:p-0"
			onClick={handleBackdropClick}
		>
			<div className="w-full max-w-[520px] max-h-[calc(100vh-32px)] overflow-y-auto [&::-webkit-scrollbar]:w-0 rounded-[14px] border border-bd-2 bg-surf p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] animate-[modal-in_0.15s_ease] max-sm:max-w-full max-sm:rounded-t-[18px] max-sm:rounded-b-none max-sm:max-h-[94vh]">
				{/* Header */}
				<div className="mb-4 flex items-start justify-between">
					<div>
						<div className="font-display text-[15px] text-t-1">
							{t("admin.unknownWords.addModal.title")}
						</div>
						<div className="mt-0.5 text-[11.5px] text-t-3">{occurrenceText}</div>
					</div>
					<Button
						onClick={onClose}
						className="flex size-7 cursor-pointer items-center justify-center rounded-md border-none bg-transparent text-t-3 transition-colors hover:bg-surf-2 hover:text-t-2"
					>
						<svg width="14" height="14" viewBox="0 0 16 16" fill="none">
							<path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
						</svg>
					</Button>
				</div>

				{/* Context snippet */}
				{state.snippet && (
					<div className="mb-3.5 rounded-lg border-l-2 border-bd-3 bg-surf-2 px-3 py-2.5 text-[12px] leading-[1.6] text-t-2">
						{state.snippet}
					</div>
				)}

				{/* Word preview */}
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
				{action === "new" && (
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

				{/* Footer */}
				<div className="mt-4 flex justify-end gap-2 border-t border-bd-1 pt-3.5 max-sm:flex-col-reverse">
					<Button
						onClick={onClose}
						className="flex h-[30px] cursor-pointer items-center gap-1.5 rounded-base border border-bd-2 bg-transparent px-3 text-[12px] font-medium text-t-2 transition-colors hover:border-bd-3 hover:text-t-1 max-sm:h-[42px] max-sm:justify-center max-sm:text-[13.5px]"
					>
						{t("admin.unknownWords.addModal.cancel")}
					</Button>
					<Button
						onClick={handleSubmit}
						disabled={!canSubmit}
						className="flex h-[30px] cursor-pointer items-center gap-1.5 rounded-base border-none bg-acc px-3 text-[12px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50 max-sm:h-[42px] max-sm:justify-center max-sm:text-[13.5px]"
					>
						<svg width="12" height="12" viewBox="0 0 16 16" fill="none">
							<path d="M3 8.5L6.5 12 13 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
						</svg>
						{action === "link"
							? t("admin.unknownWords.addModal.submitLink")
							: t("admin.unknownWords.addModal.submit")}
					</Button>
				</div>
			</div>
		</div>
	);
};
