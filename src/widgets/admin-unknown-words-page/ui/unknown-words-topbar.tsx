"use client";

import { useI18n } from "@/shared/lib/i18n";

interface UnknownWordsTopbarProps {
	onExport: () => void;
	onClearAll: () => void;
}

export const UnknownWordsTopbar = ({
	onExport,
	onClearAll,
}: UnknownWordsTopbarProps) => {
	const { t } = useI18n();

	return (
		<header className=" flex items-center gap-2.5 border-b border-bd-1 bg-surf px-[18px] py-3 transition-colors">
			<div>
				<div className="font-display text-[16px] text-t-1">
					{t("admin.unknownWords.title")}
				</div>
				<div className="mt-px text-[12px] text-t-3">
					{t("admin.unknownWords.subtitle")}
				</div>
			</div>
			<div className="ml-auto flex items-center gap-2">
				<button
					type="button"
					onClick={onExport}
					className="flex h-[30px] cursor-pointer items-center gap-1.5 rounded-[7px] border border-bd-2 bg-transparent px-2.5 text-[12px] font-medium text-t-2 transition-colors hover:border-bd-3 hover:text-t-1"
				>
					<svg width="12" height="12" viewBox="0 0 16 16" fill="none">
						<path
							d="M3 8h10M9 5l3 3-3 3"
							stroke="currentColor"
							strokeWidth="1.4"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
					<span className="max-sm:hidden">
						{t("admin.unknownWords.export")}
					</span>
				</button>
				<button
					type="button"
					onClick={onClearAll}
					className="flex h-[30px] cursor-pointer items-center gap-1.5 rounded-[7px] border border-bd-2 bg-transparent px-2.5 text-[12px] font-medium text-red-t transition-colors hover:border-red/30 hover:bg-red-bg"
				>
					<svg width="12" height="12" viewBox="0 0 16 16" fill="none">
						<path
							d="M3 5h10M5 5V4a1 1 0 011-1h4a1 1 0 011 1v1M6 8v4M10 8v4"
							stroke="currentColor"
							strokeWidth="1.4"
							strokeLinecap="round"
						/>
						<path
							d="M4 5l.7 7.5A1 1 0 005.7 13h4.6a1 1 0 001-.95L12 5"
							stroke="currentColor"
							strokeWidth="1.4"
							strokeLinecap="round"
						/>
					</svg>
					<span className="max-sm:hidden">
						{t("admin.unknownWords.clearAll")}
					</span>
				</button>
			</div>
		</header>
	);
};
