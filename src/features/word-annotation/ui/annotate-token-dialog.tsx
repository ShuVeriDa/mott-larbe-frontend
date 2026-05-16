"use client";

import { useState } from "react";
import { SearchIcon } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { useI18n } from "@/shared/lib/i18n";
import { useToast } from "@/shared/lib/toast";
import type { TextToken } from "@/entities/text";
import { useAnnotateToken } from "../model/use-annotate-token";
import { useLemmaSearch } from "../model/use-lemma-search";
import type { AnnotateScope, LemmaSearchResult } from "../api";
import { LemmaResultItem } from "./lemma-result-item";
import { AnnotationScopeOption } from "./annotation-scope-option";

interface AnnotateTokenDialogProps {
	token: TextToken;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export const AnnotateTokenDialog = ({
	token,
	open,
	onOpenChange,
}: AnnotateTokenDialogProps) => {
	const { t } = useI18n();
	const { success, error } = useToast();

	const [query, setQuery] = useState("");
	const [selectedLemma, setSelectedLemma] = useState<LemmaSearchResult | null>(
		null,
	);
	const [scope, setScope] = useState<AnnotateScope | null>(null);

	const { data: results = [], isLoading } = useLemmaSearch(query);
	const { mutate: annotate, isPending } = useAnnotateToken(token.id);

	const resetState = () => {
		setQuery("");
		setSelectedLemma(null);
		setScope(null);
	};

	const handleOpenChange = (nextOpen: boolean) => {
		if (!nextOpen) resetState();
		onOpenChange(nextOpen);
	};

	const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setQuery(e.currentTarget.value);
		setSelectedLemma(null);
		setScope(null);
	};

	const handleSelectLemma = (lemma: LemmaSearchResult) => {
		setSelectedLemma(lemma);
		setScope(null);
	};

	const handleScopeSelect = (nextScope: AnnotateScope) => {
		setScope(nextScope);
	};

	const handleSave = () => {
		if (!selectedLemma || !scope) return;
		annotate(
			{ lemmaId: selectedLemma.id, scope },
			{
				onSuccess: () => {
					success(
						scope === "global"
							? t("reader.annotate.successGlobal", { word: token.normalized })
							: t("reader.annotate.successLocal"),
					);
					resetState();
					onOpenChange(false);
				},
				onError: () => error(t("reader.annotate.error")),
			},
		);
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className="max-w-md gap-4 p-0">
				<DialogHeader className="px-5 pt-5 pb-0">
					<DialogTitle>
						{t("reader.annotate.title", { word: token.original })}
					</DialogTitle>
				</DialogHeader>

				<div className="px-5">
					<div className="relative">
						<SearchIcon className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-t-3" />
						<Input
							value={query}
							onChange={handleQueryChange}
							placeholder={t("reader.annotate.searchPlaceholder")}
							className="pl-8"
							autoFocus
						/>
					</div>
				</div>

				<div className="mx-5 max-h-[180px] overflow-y-auto rounded-base border border-hairline border-bd-1">
					{isLoading ? (
						<div className="flex items-center justify-center py-6">
							<div className="size-4 animate-spin rounded-full border-2 border-surf-3 border-t-acc" />
						</div>
					) : results.length > 0 ? (
						<div className="p-1">
							{results.map((lemma) => (
								<LemmaResultItem
									key={lemma.id}
									lemma={lemma}
									selected={selectedLemma?.id === lemma.id}
									onSelect={() => handleSelectLemma(lemma)}
								/>
							))}
						</div>
					) : query.trim().length >= 2 ? (
						<div className="py-6 text-center text-[12px] text-t-3">
							{t("reader.annotate.noResults")}
						</div>
					) : (
						<div className="py-6 text-center text-[12px] text-t-3">
							{t("reader.annotate.searchHint")}
						</div>
					)}
				</div>

				{selectedLemma && (
					<div className="flex flex-col gap-2 px-5">
						<AnnotationScopeOption
							active={scope === "local"}
							label={t("reader.annotate.scopeLocal")}
							description={t("reader.annotate.scopeLocalDesc")}
							onClick={() => handleScopeSelect("local")}
						/>
						<AnnotationScopeOption
							active={scope === "global"}
							label={t("reader.annotate.scopeGlobal", {
								word: token.normalized,
							})}
							description={t("reader.annotate.scopeGlobalDesc")}
							onClick={() => handleScopeSelect("global")}
						/>
					</div>
				)}

				<div className="flex gap-2 px-5 pb-5">
					<Button
						size="bare"
						onClick={() => handleOpenChange(false)}
						className="flex h-[34px] flex-1 items-center justify-center rounded-base border border-hairline border-bd-2 bg-surf-2 text-[13px] font-medium text-t-1 transition-colors hover:border-bd-3 hover:bg-surf-3"
					>
						{t("reader.annotate.cancel")}
					</Button>
					<Button
						size="bare"
						disabled={!selectedLemma || !scope || isPending}
						onClick={handleSave}
						className="flex h-[34px] flex-1 items-center justify-center rounded-base bg-acc text-[13px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
					>
						{isPending
							? t("reader.annotate.saving")
							: t("reader.annotate.save")}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};
