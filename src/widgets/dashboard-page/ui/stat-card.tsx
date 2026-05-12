import type { ReactNode } from "react";

interface StatCardProps {
	value: number;
	label: string;
	iconBgClass: string;
	icon: ReactNode;
}

export const StatCard = ({ value, label, iconBgClass, icon }: StatCardProps) => (
	<div className="cursor-default rounded-card  border border-bd-1 bg-surf p-[13px_14px] transition-all hover:border-bd-2 hover:shadow-sm">
		<div
			className={`mb-2.5 flex size-7 items-center justify-center rounded-base ${iconBgClass}`}
		>
			{icon}
		</div>
		<div className="mb-[3px] font-display text-[24px] font-normal leading-none tracking-[-0.3px] text-t-1 max-sm:text-[22px]">
			{value.toLocaleString()}
		</div>
		<div className="text-[11px] leading-[1.4] text-t-3">{label}</div>
	</div>
);
