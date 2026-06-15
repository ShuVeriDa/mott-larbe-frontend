import { cn } from "@/shared/lib/cn";
import { AdminCard } from "@/shared/ui/admin-card";
import type { ReactNode } from "react";

interface AdminEmptyPanelProps {
	icon: ReactNode;
	title: string;
	description?: string;
	className?: string;
}

export const AdminEmptyPanel = ({
	icon,
	title,
	description,
	className,
}: AdminEmptyPanelProps) => (
	<AdminCard>
		<div className={cn("flex flex-col items-center gap-2 px-4 py-9", className)}>
			<div className="flex size-9 items-center justify-center rounded-[10px] bg-surf-2 text-t-4">
				{icon}
			</div>
			<div className="text-[13px] font-semibold text-t-1">{title}</div>
			{description && (
				<div className="text-center text-[11.5px] leading-relaxed text-t-3">
					{description}
				</div>
			)}
		</div>
	</AdminCard>
);
