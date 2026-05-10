import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { Plus, Download } from "lucide-react";
interface Props {
	onAdd: () => void;
	onExport: () => void;
}

export const AdminSubscriptionsTopbar = ({ onAdd, onExport }: Props) => {
	const { t } = useI18n();

	return (
		<header className=" flex items-center gap-3 border-b border-bd-1 bg-surf px-[22px] py-3.5 transition-colors max-sm:px-3.5 max-sm:py-2.5">
			<div>
				<div className="font-display text-[16px] text-t-1">
					{t("admin.subscriptions.title")}
				</div>
				<div className="mt-px text-[12px] text-t-3 max-sm:hidden">
					{t("admin.subscriptions.subtitle")}
				</div>
			</div>
			<div className="ml-auto flex items-center gap-2">
				<Button
					onClick={onAdd}
					className="flex h-[30px] items-center gap-1.5 rounded-base border border-bd-2 bg-transparent px-2.5 text-[12px] font-medium text-t-2 transition-colors hover:border-bd-3 hover:text-t-1"
				>
					<Plus className="size-3" />
					{t("admin.subscriptions.topbar.add")}
				</Button>
				<Button
					onClick={onExport}
					className="flex h-[30px] items-center gap-1.5 rounded-base border border-bd-2 bg-transparent px-2.5 text-[12px] font-medium text-t-2 transition-colors hover:border-bd-3 hover:text-t-1"
				>
					<Download className="size-3" />
					{t("admin.subscriptions.topbar.export")}
				</Button>
			</div>
		</header>
	);
};
