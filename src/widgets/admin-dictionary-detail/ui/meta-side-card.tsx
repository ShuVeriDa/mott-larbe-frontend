"use client";

import { Typography } from "@/shared/ui/typography";

import { Button } from "@/shared/ui/button";

import { ComponentProps, ReactNode } from 'react';
import { useI18n } from "@/shared/lib/i18n";
import { CefrBadge } from "@/entities/dictionary";
import type { AdminDictEntryCard } from "@/entities/dictionary";
import type { DictModal } from "../model/use-admin-dictionary-detail-page";

const IconEdit = () => (
	<svg viewBox="0 0 16 16" fill="none" className="size-[13px]">
		<path d="M10.5 3.5l2 2L5 13H3v-2l7.5-7.5z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
	</svg>
);

interface MetaSideCardProps {
	data: AdminDictEntryCard | undefined;
	isLoading: boolean;
	onOpenModal: (m: DictModal) => void;
}

export const MetaSideCard = ({ data, isLoading, onOpenModal }: MetaSideCardProps) => {
	const { t } = useI18n();

	const formatDate = (iso: string) =>
		new Date(iso).toLocaleDateString("ru-RU", {
			day: "numeric",
			month: "short",
			year: "numeric",
		});

	if (isLoading) {
		return (
			<div className="overflow-hidden rounded-xl border border-bd-1 bg-surf transition-colors">
				<div className="flex items-center justify-between border-b border-bd-1 px-4 py-3">
					<div className="h-3 w-24 animate-pulse rounded bg-surf-3" />
				</div>
				{[0, 1, 2, 3, 4, 5].map((i) => (
					<div key={i} className="flex items-center justify-between border-b border-bd-1 px-4 py-2.5 last:border-b-0">
						<div className="h-3 w-20 animate-pulse rounded bg-surf-3" />
						<div className="h-3 w-16 animate-pulse rounded bg-surf-3" />
					</div>
				))}
			</div>
		);
	}

	if (!data) return null;

	const rows: Array<{ key: string; value: ReactNode }> = [
		{
			key: t("admin.dictionaryDetail.pos"),
			value: data.partOfSpeech ?? "—",
		},
		{
			key: t("admin.dictionaryDetail.level"),
			value: data.level ? <CefrBadge level={data.level} /> : "—",
		},
		{
			key: t("admin.dictionaryDetail.frequency"),
			value: data.frequency?.toLocaleString("ru-RU") ?? "—",
		},
		{
			key: t("admin.dictionaryDetail.createdAt"),
			value: <Typography tag="span" className="text-t-3">{formatDate(data.createdAt)}</Typography>,
		},
		{
			key: t("admin.dictionaryDetail.updatedAt"),
			value: <Typography tag="span" className="text-t-3">{formatDate(data.updatedAt)}</Typography>,
		},
		{
			key: "ID",
			value: (
				<Typography tag="span" className="font-mono text-[11px] text-t-3">{data.id.slice(0, 10)}</Typography>
			),
		},
	];

		const handleClick: NonNullable<ComponentProps<"button">["onClick"]> = () => onOpenModal({ type: "editMeta" });
return (
		<div className="overflow-hidden rounded-xl border border-bd-1 bg-surf transition-colors">
			<div className="flex items-center justify-between border-b border-bd-1 px-4 py-3">
				<Typography tag="span" className="text-[11.5px] font-semibold uppercase tracking-[0.5px] text-t-2">
					{t("admin.dictionaryDetail.metadata")}
				</Typography>
				<Button
					className="flex size-[26px] items-center justify-center rounded-md bg-transparent text-t-3 transition-colors hover:bg-surf-3 hover:text-t-1"
					onClick={handleClick}
					title={t("admin.dictionaryDetail.edit")}
				>
					<IconEdit />
				</Button>
			</div>
			<div>
				{rows.map((row) => (
					<div
						key={row.key}
						className="flex items-center justify-between border-b border-bd-1 px-4 py-2.5 text-[12.5px] last:border-b-0"
					>
						<Typography tag="span" className="text-t-3">{row.key}</Typography>
						<Typography tag="span" className="font-medium text-t-1">{row.value}</Typography>
					</div>
				))}
			</div>
		</div>
	);
};
