import { cn } from "@/shared/lib/cn";
import type { AdminDictTab } from "@/entities/dictionary";

const TABS: AdminDictTab[] = ["all", "no_senses", "no_examples", "no_forms"];

interface DictionaryTabsProps {
	active: AdminDictTab;
	counts?: Partial<Record<AdminDictTab, number>>;
	onChange: (tab: AdminDictTab) => void;
	t: (key: string) => string;
}

export const DictionaryTabs = ({ active, counts, onChange, t }: DictionaryTabsProps) => (
	<div className="mb-3.5 flex gap-1 border-b border-bd-1">
		{TABS.map((tab) => {
		  const handleClick: NonNullable<React.ComponentProps<"button">["onClick"]> = () => onChange(tab);
		  return (
			<button
				key={tab}
				type="button"
				onClick={handleClick}
				className={cn(
					"flex cursor-pointer items-center gap-1.5 border-b-2 pb-2 pt-1 text-[12.5px] transition-colors",
					active === tab
						? "border-acc text-t-1"
						: "border-transparent text-t-3 hover:text-t-2",
				)}
			>
				{t(`admin.dictionary.tabs.${tab}`)}
				{counts?.[tab] !== undefined && (
					<span
						className={cn(
							"rounded-[4px] px-1.5 py-px text-[10.5px] font-semibold",
							active === tab
								? "bg-acc-bg text-acc-t"
								: "bg-surf-3 text-t-3",
						)}
					>
						{counts[tab]}
					</span>
				)}
			</button>
		);
		})}
	</div>
);
