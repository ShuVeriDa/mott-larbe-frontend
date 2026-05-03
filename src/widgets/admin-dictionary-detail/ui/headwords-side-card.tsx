"use client";

import { useI18n } from "@/shared/lib/i18n";
import type { AdminDictHeadword } from "@/entities/dictionary";
import type { DictModal } from "../model/use-admin-dictionary-detail-page";

const IconTrash = () => (
	<svg viewBox="0 0 16 16" fill="none" className="size-[13px]">
		<path d="M3 5h10M5 5V4a1 1 0 011-1h4a1 1 0 011 1v1M6 8v4M10 8v4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
		<path d="M4 5l.7 7.5A1 1 0 005.7 13h4.6a1 1 0 001-.95L12 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
	</svg>
);

interface HeadwordsSideCardProps {
	headwords: AdminDictHeadword[] | undefined;
	isLoading: boolean;
	onOpenModal: (m: DictModal) => void;
	onDeleteHeadword: (hwId: string) => void;
}

export const HeadwordsSideCard = ({
	headwords = [],
	isLoading,
	onOpenModal,
	onDeleteHeadword,
}: HeadwordsSideCardProps) => {
	const { t } = useI18n();

	return (
		<div className="overflow-hidden rounded-xl border border-bd-1 bg-surf transition-colors">
			<div className="flex items-center justify-between border-b border-bd-1 px-4 py-3">
				<span className="text-[11.5px] font-semibold uppercase tracking-[0.5px] text-t-2">
					{t("admin.dictionaryDetail.headwords")}
				</span>
				<button
					className="flex h-[26px] items-center gap-1.5 rounded-md border border-bd-2 bg-transparent px-2.5 text-[11.5px] text-t-2 transition-colors hover:border-bd-3 hover:bg-surf-2 hover:text-t-1"
					onClick={() => onOpenModal({ type: "addHeadword" })}
				>
					<svg width="11" height="11" viewBox="0 0 16 16" fill="none">
						<path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
					</svg>
					{t("admin.dictionaryDetail.add")}
				</button>
			</div>

			{isLoading ? (
				<div className="px-4 py-3">
					<div className="h-4 w-24 animate-pulse rounded bg-surf-3" />
				</div>
			) : headwords.length === 0 ? (
				<div className="px-4 py-4 text-center text-[12.5px] text-t-3">
					{t("admin.dictionaryDetail.noHeadwords")}
				</div>
			) : (
				<div>
					{headwords.map((hw) => (
						<div
							key={hw.id}
							className="group flex items-center gap-2.5 border-b border-bd-1 px-4 py-2.5 transition-colors hover:bg-surf-2 last:border-b-0"
						>
							<span className="flex-1 font-display text-[15px] font-medium text-t-1">
								{hw.text}
							</span>
							{hw.isPrimary && (
								<span className="rounded bg-acc-bg px-[7px] py-0.5 text-[10.5px] font-semibold text-acc-t">
									{t("admin.dictionaryDetail.primary")}
								</span>
							)}
							<div className="flex gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 max-sm:opacity-100">
								<button
									className="flex size-[26px] items-center justify-center rounded-md bg-transparent text-t-3 transition-colors hover:bg-red-bg hover:text-red-t"
									onClick={() => onDeleteHeadword(hw.id)}
								>
									<IconTrash />
								</button>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
};
