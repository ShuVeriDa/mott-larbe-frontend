import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { Download, Plus } from "lucide-react";
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
				<Button
					onClick={onExport}
					className="flex h-[30px] items-center gap-1.5 rounded-base border border-bd-2 bg-transparent px-2.5 text-[12px] font-medium text-t-2 transition-colors hover:border-bd-3 hover:text-t-1"
				>
					<Download className="size-3" />
					{t("admin.coupons.export")}
				</Button>

				<Button
					onClick={onCreate}
					className="flex h-[30px] items-center gap-1.5 rounded-base bg-acc px-3 text-[12px] font-semibold text-white transition-opacity hover:opacity-90"
				>
					<Plus className="size-3" />
					{t("admin.coupons.create")}
				</Button>
			</div>
		</header>
	);
};
