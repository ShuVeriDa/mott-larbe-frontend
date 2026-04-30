"use client";

import type { ReactNode } from "react";
import { BottomNav } from "./bottom-nav";
import { SideNav } from "./side-nav";

export interface AppShellProps {
	activeHref: string;
	children: ReactNode;
}

export const AppShell = ({ activeHref, children }: AppShellProps) => (
	<>
		<div className="mx-auto flex h-screen min-h-[600px] w-full max-w-[1120px] border-hairline border-x border-bd-2 bg-bg max-md:h-auto max-md:min-h-[100dvh] max-md:flex-col max-md:border-x-0 max-md:pb-[56px]">
			<SideNav activeHref={activeHref} />
			<main className="flex min-w-0 flex-1 flex-col overflow-hidden max-md:overflow-visible">
				{children}
			</main>
		</div>
		<BottomNav activeHref={activeHref} />
	</>
);
