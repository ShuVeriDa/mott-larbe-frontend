"use client";

import type { ReactNode } from "react";

interface AdminTextPageShellProps {
	topbar: ReactNode;
	editor: ReactNode;
	metaPanel: ReactNode;
	isMetaPanelVisible: boolean;
	bottomSlot?: ReactNode;
}

export const AdminTextPageShell = ({
	topbar,
	editor,
	metaPanel,
	isMetaPanelVisible,
	bottomSlot,
}: AdminTextPageShellProps) => {
	const gridColumnsClassName = isMetaPanelVisible
		? "min-[768px]:grid-cols-[1fr_248px]"
		: "min-[768px]:grid-cols-[1fr_0px]";
	const metaPanelClassName = isMetaPanelVisible
		? "min-[768px]:translate-x-0 min-[768px]:opacity-100"
		: "min-[768px]:pointer-events-none min-[768px]:translate-x-3 min-[768px]:opacity-0";

	return (
		<div className="flex h-screen min-h-0 flex-col overflow-hidden text-t-1 transition-colors">
			{topbar}

			<div
				className={`grid min-h-0 flex-1 overflow-hidden transition-[grid-template-columns] duration-300 ease-out max-[767px]:grid-cols-1 ${gridColumnsClassName}`}
			>
				{editor}

				<div
					className={`min-h-0 overflow-hidden transition-[opacity,transform] duration-200 ease-out max-[767px]:contents ${metaPanelClassName}`}
				>
					{metaPanel}
				</div>
			</div>

			{bottomSlot}
		</div>
	);
};
