"use client";

import Link from "next/link";
import { Typography } from "@/shared/ui/typography";
import { MetaSection } from "@/shared/ui/admin-text-meta-fields";
import type { TextVersionListItem } from "@/entities/admin-text";

const formatVersionDate = (iso: string): string => {
	try {
		return new Date(iso).toLocaleString("ru-RU", {
			day: "numeric",
			month: "short",
			hour: "2-digit",
			minute: "2-digit",
		});
	} catch {
		return iso;
	}
};

interface Props {
	recentVersions: TextVersionListItem[];
	textId: string;
	lang: string;
	sectionTitle: string;
	currentLabel: string;
	allVersionsLabel: string;
}

export const TextEditMetaVersionsSection = ({
	recentVersions,
	textId,
	lang,
	sectionTitle,
	currentLabel,
	allVersionsLabel,
}: Props) => {
	if (recentVersions.length === 0) return null;

	return (
		<MetaSection title={sectionTitle}>
			<div className="flex flex-col">
				{recentVersions.slice(0, 4).map((v, i) => (
					<div
						key={v.id}
						className={`group flex items-start gap-2 ${i < Math.min(recentVersions.length, 4) - 1 ? "pb-3" : ""}`}
					>
						<div className="flex shrink-0 flex-col items-center">
							<div
								className={`mt-[3px] h-2 w-2 rounded-full ${
									v.isCurrent
										? "bg-grn shadow-[0_0_0_2px] shadow-grn-muted"
										: v.trigger === "AUTO_ON_SAVE"
											? "border-[1.5px] border-acc bg-acc-muted"
											: "bg-surf-4"
								}`}
							/>
							{i < Math.min(recentVersions.length, 4) - 1 && (
								<div className="mt-1 w-px flex-1 bg-bd-2" style={{ minHeight: "14px" }} />
							)}
						</div>
						<div className="min-w-0 flex-1">
							<div className="text-xs font-medium text-t-1">
								{v.isCurrent ? currentLabel : (v.label ?? `v${v.version}`)}
							</div>
							<div className="mt-0.5 text-[10.5px] text-t-3">
								{formatVersionDate(v.createdAt)}{v.initiator ? ` · ${v.initiator.name}` : ""}
							</div>
						</div>
					</div>
				))}
			</div>
			<Link
				href={`/${lang}/admin/texts/${textId}/versions`}
				className="mt-2.5 flex items-center justify-center gap-1.5 rounded-[6px] py-1.5 text-[11.5px] font-medium text-acc transition-colors hover:bg-acc-muted"
			>
				<svg width="11" height="11" viewBox="0 0 16 16" fill="none">
					<circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3" />
					<path d="M8 5v3l2 1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
				</svg>
				{allVersionsLabel}
			</Link>
		</MetaSection>
	);
};
