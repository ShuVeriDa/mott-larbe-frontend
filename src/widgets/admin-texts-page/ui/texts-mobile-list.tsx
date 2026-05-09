"use client";

import { Typography } from "@/shared/ui/typography";

import { useI18n } from "@/shared/lib/i18n";
import type { AdminTextListItem } from "@/entities/admin-text";
import type { useAdminTextMutations } from "@/entities/admin-text/model/use-admin-text-mutations";
import { TextLevelBadge } from "./text-level-badge";
import { TextStatusBadge } from "./text-status-badge";
import { TextProcessingBar } from "./text-processing-bar";
import { TextRowActions } from "./text-row-actions";

interface TextsMobileListProps {
	texts: AdminTextListItem[];
	mutations: ReturnType<typeof useAdminTextMutations>;
	isLoading: boolean;
}

const formatDate = (iso: string) =>
	new Date(iso).toLocaleDateString("ru-RU", { day: "numeric", month: "short", year: "numeric" });

export const TextsMobileList = ({ texts, mutations, isLoading }: TextsMobileListProps) => {
	const { t } = useI18n();

	if (isLoading) {
		return (
			<div className="hidden max-sm:block">
				{Array.from({ length: 4 }).map((_, i) => (
					<div key={i} className="border-b border-bd-1 px-4 py-3.5">
						<div className="mb-2 flex items-start gap-2.5">
							<div className="h-3.5 w-3.5 animate-pulse rounded bg-surf-3" />
							<div className="flex-1 space-y-2">
								<div className="h-3.5 w-3/4 animate-pulse rounded bg-surf-3" />
								<div className="flex gap-1.5">
									<div className="h-4.5 w-7 animate-pulse rounded bg-surf-3" />
									<div className="h-4 w-20 animate-pulse rounded bg-surf-3" />
								</div>
							</div>
						</div>
					</div>
				))}
			</div>
		);
	}

	return (
		<div className="hidden max-sm:block">
			{texts.map((text) => (
				<div key={text.id} className="border-b border-bd-1 px-4 py-3.5 last:border-b-0">
					{/* Top row: checkbox + info + actions */}
					<div className="mb-2.5 flex items-start gap-2.5">
						<input
							type="checkbox"
							className="mt-0.5 size-3.5 cursor-pointer rounded border-[1.5px] border-bd-3 accent-acc"
						/>
						<div className="min-w-0 flex-1">
							<div className="mb-1.5 text-[13.5px] font-medium leading-[1.35] text-t-1">
								{text.title}
							</div>
							<div className="flex flex-wrap items-center gap-1.5">
								<TextLevelBadge level={text.level} />
								<TextStatusBadge status={text.status} />
							</div>
						</div>
						<div className="shrink-0 pt-0.5">
							<TextRowActions text={text} mutations={mutations} />
						</div>
					</div>

					{/* Meta row */}
					<div className="ml-[22px] mb-2 flex flex-wrap items-center gap-2.5 text-[11.5px] text-t-3">
						{text.tokenCount > 0 && (
							<Typography tag="span">{t("admin.texts.table.tokens", { count: text.tokenCount })}</Typography>
						)}
						{text.tags.length > 0 && (
							<Typography tag="span">{text.tags.map((tag) => tag.name).join(", ")}</Typography>
						)}
						{text.readCount > 0 && (
							<Typography tag="span">{text.readCount.toLocaleString("ru-RU")} {t("admin.texts.table.readsMobile")}</Typography>
						)}
						<Typography tag="span">{formatDate(text.createdAt)}</Typography>
					</div>

					{/* Processing bar */}
					{text.processingStatus !== "IDLE" || text.processingProgress > 0 ? (
						<div className="ml-[22px] flex items-center gap-2">
							<div className="flex-1">
								<TextProcessingBar
									status={text.processingStatus}
									progress={text.processingProgress}
								/>
							</div>
						</div>
					) : null}
				</div>
			))}
		</div>
	);
};
