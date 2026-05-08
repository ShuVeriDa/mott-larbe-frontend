import { useI18n } from "@/shared/lib/i18n";

interface Props {
	onExport: () => void;
	onCreate: () => void;
}

export const CouponsTopbar = ({ onExport, onCreate }: Props) => {
	const { t } = useI18n();

	return (
		<header className=" flex items-center gap-3 border-b border-bd-1 bg-surf px-[22px] py-3.5 transition-colors max-sm:px-3.5">
			<div>
				<div className="font-display text-[16px] text-t-1">
					{t("admin.coupons.title")}
				</div>
				<div className="mt-px text-[12px] text-t-3 max-sm:hidden">
					{t("admin.coupons.subtitle")}
				</div>
			</div>

			<div className="ml-auto flex items-center gap-2">
				<button
					type="button"
					onClick={onExport}
					className="flex h-[30px] items-center gap-1.5 rounded-base border border-bd-2 bg-transparent px-2.5 text-[12px] font-medium text-t-2 transition-colors hover:border-bd-3 hover:text-t-1"
				>
					<svg
						width="12"
						height="12"
						viewBox="0 0 12 12"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.3"
					>
						<path
							d="M6 1v7M3 5l3 3 3-3M1 9v1.5A.5.5 0 001.5 11h9a.5.5 0 00.5-.5V9"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
					{t("admin.coupons.export")}
				</button>

				<button
					type="button"
					onClick={onCreate}
					className="flex h-[30px] items-center gap-1.5 rounded-base bg-acc px-3 text-[12px] font-semibold text-white transition-opacity hover:opacity-90"
				>
					<svg
						width="12"
						height="12"
						viewBox="0 0 12 12"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.3"
					>
						<path d="M6 1v10M1 6h10" strokeLinecap="round" />
					</svg>
					{t("admin.coupons.create")}
				</button>
			</div>
		</header>
	);
};
