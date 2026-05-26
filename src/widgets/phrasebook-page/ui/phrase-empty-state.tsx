import { useI18n } from "@/shared/lib/i18n";

export const PhraseEmptyState = () => {
	const { t } = useI18n();

	return (
		<div className="flex-1 flex flex-col items-center justify-center py-10 text-center px-5">
			<div className="w-11 h-11 rounded-[12px] bg-surf-2 flex items-center justify-center mb-3">
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.5"
					className="w-5 h-5 text-t-3"
				>
					<path
						d="M8 9h8M8 13h5"
						strokeLinecap="round"
					/>
					<path d="M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H7l-4 3V6z" />
				</svg>
			</div>
			<div className="text-[14px] font-semibold text-t-1 mb-1">
				{t("phrasebook.empty.title")}
			</div>
			<div className="text-[12.5px] text-t-3 max-w-[280px] leading-[1.5]">
				{t("phrasebook.empty.sub")}
			</div>
		</div>
	);
};
