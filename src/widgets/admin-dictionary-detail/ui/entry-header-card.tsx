"use client";

import { useI18n } from "@/shared/lib/i18n";
import { CefrBadge } from "@/entities/dictionary";
import type { AdminDictEntryCard } from "@/entities/dictionary";

const POS_STYLE: Record<string, string> = {
	n: "bg-acc-bg text-acc-t",
	noun: "bg-acc-bg text-acc-t",
	v: "bg-grn-bg text-grn-t",
	verb: "bg-grn-bg text-grn-t",
	adj: "bg-pur-bg text-pur-t",
	adjective: "bg-pur-bg text-pur-t",
	adv: "bg-amb-bg text-amb-t",
	adverb: "bg-amb-bg text-amb-t",
};

const posStyle = (pos: string | null) =>
	pos ? (POS_STYLE[pos.toLowerCase()] ?? "bg-surf-3 text-t-2") : "bg-surf-3 text-t-2";

interface EntryHeaderCardProps {
	data: AdminDictEntryCard | undefined;
	isLoading: boolean;
	lemmasCount: number | undefined;
}

export const EntryHeaderCard = ({ data, isLoading, lemmasCount }: EntryHeaderCardProps) => {
	const { t } = useI18n();

	if (isLoading) {
		return (
			<div className="overflow-hidden rounded-xl border border-bd-1 bg-surf transition-colors">
				<div className="px-5 py-5">
					<div className="mb-2.5 h-9 w-40 animate-pulse rounded-lg bg-surf-3" />
					<div className="flex gap-2">
						<div className="h-5 w-14 animate-pulse rounded-md bg-surf-3" />
						<div className="h-5 w-8 animate-pulse rounded-md bg-surf-3" />
					</div>
				</div>
				<div className="grid grid-cols-3 border-t border-bd-1">
					{[0, 1, 2].map((i) => (
						<div key={i} className="flex flex-col gap-1.5 px-4 py-3">
							<div className="h-2.5 w-14 animate-pulse rounded bg-surf-3" />
							<div className="h-5 w-8 animate-pulse rounded bg-surf-3" />
						</div>
					))}
				</div>
			</div>
		);
	}

	if (!data) return null;

	return (
		<div className="overflow-hidden rounded-xl border border-bd-1 bg-surf transition-colors">
			{/* Word + meta */}
			<div className="px-5 py-5">
				<div className="mb-2.5 font-display text-[32px] font-medium leading-[1.1] tracking-[-0.3px] text-t-1 max-sm:text-[26px]">
					{data.baseForm}
				</div>
				<div className="flex flex-wrap items-center gap-2">
					{data.partOfSpeech && (
						<span className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-[11.5px] font-semibold italic ${posStyle(data.partOfSpeech)}`}>
							{data.partOfSpeech}
						</span>
					)}
					{data.level && <CefrBadge level={data.level} />}
					<span className="h-3.5 w-px bg-bd-2" />
					<span className="flex items-center gap-1 text-[12px] text-t-3">
						<svg width="12" height="12" viewBox="0 0 16 16" fill="none">
							<path d="M2 12l4-4.5 2.5 2.5L12 5l2 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
						</svg>
						{t("admin.dictionaryDetail.frequency")}:{" "}
						<strong className="font-semibold text-t-2">{data.frequency ?? "—"}</strong>
					</span>
					<span className="h-3.5 w-px bg-bd-2" />
					<span className="flex items-center gap-1 text-[12px] text-t-3">
						ID:{" "}
						<strong className="font-mono text-[11px] font-normal text-t-3">
							{data.id.slice(0, 10)}
						</strong>
					</span>
				</div>
			</div>

			{/* Mini stats */}
			<div className="grid grid-cols-3 border-t border-bd-1">
				<div className="flex flex-col gap-0.5 border-r border-bd-1 px-4 py-3">
					<span className="text-[10.5px] text-t-3">{t("admin.dictionaryDetail.senses")}</span>
					<span className="text-[17px] font-semibold leading-none text-t-1">{data.senses.length}</span>
				</div>
				<div className="flex flex-col gap-0.5 border-r border-bd-1 px-4 py-3">
					<span className="text-[10.5px] text-t-3">{t("admin.dictionaryDetail.lemmas")}</span>
					<span className="text-[17px] font-semibold leading-none text-t-1">{lemmasCount ?? "—"}</span>
				</div>
				<div className="flex flex-col gap-0.5 px-4 py-3">
					<span className="text-[10.5px] text-t-3">{t("admin.dictionaryDetail.morphForms")}</span>
					<span className="text-[17px] font-semibold leading-none text-t-1">{data.forms.length}</span>
				</div>
			</div>
		</div>
	);
};
