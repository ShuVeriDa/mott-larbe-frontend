import { ToastViewport } from "@/shared/ui/toast";
import type { ReactNode } from "react";
import { BottomNav } from "./bottom-nav";
import { SideNav } from "./side-nav";

export interface AppShellProps {
	children: ReactNode;
}

export const AppShell = ({ children }: AppShellProps) => (
	<>
		<div className="mx-auto flex h-screen min-h-[600px] w-full  border-hairline border-x border-bd-2 bg-panel max-md:h-auto max-md:min-h-dvh max-md:flex-col max-md:border-x-0 max-md:pb-[56px]">
			<SideNav />
			<main className="flex min-w-0 flex-1 flex-col overflow-hidden max-md:overflow-visible">
				{children}
			</main>
		</div>
		<BottomNav />
		<ToastViewport />
	</>
);
