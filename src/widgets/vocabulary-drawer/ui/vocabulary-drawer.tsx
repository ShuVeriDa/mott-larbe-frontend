"use client";
import { useDictionaryStats } from "@/entities/dictionary";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { useMounted } from "@/shared/lib/mounted";
import { Typography } from "@/shared/ui/typography";
import { FoldersList, StatsList } from "@/widgets/vocabulary-sidebar";
import { useEffect } from "react";
import { createPortal } from "react-dom";

export interface VocabularyDrawerProps {
	open: boolean;
	onClose: () => void;
	onCreateFolder: () => void;
}

export const VocabularyDrawer = ({
	open,
	onClose,
	onCreateFolder,
}: VocabularyDrawerProps) => {
	const { t } = useI18n();
	const { data: stats } = useDictionaryStats();
	const mounted = useMounted();

	useEffect(() => {
		if (!open) return;
		const prev = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = prev;
		};
	}, [open]);

	if (!mounted) return null;

	return createPortal(
		<>
			<div
				aria-hidden="true"
				onClick={onClose}
				className={cn(
					"fixed inset-0 z-150 bg-black/30 backdrop-blur-[1px] transition-opacity",
					open ? "opacity-100" : "pointer-events-none opacity-0",
				)}
			/>
			<div
				role="dialog"
				aria-modal="true"
				aria-label={t("vocabulary.filtersAndFolders")}
				className={cn(
					"fixed inset-x-0 bottom-0 z-160 flex max-h-[80vh] flex-col rounded-t-2xl bg-surf",
					"transition-transform duration-300 ease-[cubic-bezier(.32,.72,0,1)]",
					"pb-[env(safe-area-inset-bottom)]",
					open ? "translate-y-0" : "translate-y-full",
				)}
			>
				<div className="mx-auto mt-2.5 h-1 w-9 rounded-[2px] bg-surf-4" />
				<Typography
					tag="h2"
					className="border-b border-hairline border-bd-1 px-[18px] py-3 pb-3 text-sm font-semibold text-t-1"
				>
					{t("vocabulary.filtersAndFolders")}
				</Typography>
				<div className="flex flex-col gap-5 overflow-y-auto px-[18px] py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
					{stats ? (
						<div>
							<Typography
								tag="h3"
								className="mb-2 text-[10px] font-semibold uppercase tracking-[0.7px] text-t-3"
							>
								{t("vocabulary.stats")}
							</Typography>
							<StatsList stats={stats} />
						</div>
					) : null}
					<div>
						<Typography
							tag="h3"
							className="mb-2 text-[10px] font-semibold uppercase tracking-[0.7px] text-t-3"
						>
							{t("vocabulary.folders")}
						</Typography>
						<FoldersList
							totalAllWords={stats?.total ?? 0}
							onCreateFolder={onCreateFolder}
							onSelect={onClose}
						/>
					</div>
				</div>
			</div>
		</>,
		document.body,
	);
};
