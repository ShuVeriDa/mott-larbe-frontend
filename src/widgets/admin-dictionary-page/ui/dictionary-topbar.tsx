import type { ReactNode } from "react";

interface DictionaryTopbarProps {
	title: string;
	subtitle: string;
	actions: ReactNode;
}

export const DictionaryTopbar = ({
	title,
	subtitle,
	actions,
}: DictionaryTopbarProps) => (
	<div className="sticky top-0 z-10 flex items-center gap-3 border-b border-bd-1 bg-surf px-5 py-3.5 transition-colors max-sm:px-3">
		<div>
			<h1 className="font-display text-[16px] font-medium text-t-1">{title}</h1>
			<p className="mt-px text-[12px] text-t-3">{subtitle}</p>
		</div>
		<div className="ml-auto flex items-center gap-2">{actions}</div>
	</div>
);
