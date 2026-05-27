import { cn } from "@/shared/lib/cn";
import { Button } from "@/shared/ui/button";

export interface AdminTabStripItem<T extends string> {
	key: T;
	label: string;
}

export interface AdminTabStripProps<T extends string> {
	tabs: AdminTabStripItem<T>[];
	activeTab: T;
	onTabChange: (tab: T) => void;
	className?: string;
}

export const AdminTabStrip = <T extends string>({
	tabs,
	activeTab,
	onTabChange,
	className,
}: AdminTabStripProps<T>) => (
	<div
		className={cn(
			"-mb-px flex gap-px overflow-x-auto border-b border-bd-1 px-4",
			className,
		)}
	>
		{tabs.map(tab => {
			const handleClick = () => onTabChange(tab.key);
			return (
				<Button
					key={tab.key}
					onClick={handleClick}
					className={cn(
						"whitespace-nowrap rounded-b-none border-b-2 px-2.5 py-2 text-[12px] font-medium transition-colors",
						tab.key === activeTab
							? "border-acc text-t-1"
							: "border-transparent text-t-3 hover:text-t-2",
					)}
				>
					{tab.label}
				</Button>
			);
		})}
	</div>
);
