import { PwaInstallBanner } from "@/features/pwa-install-prompt";
import { ToastViewport } from "@/shared/ui/toast";
import { type ReactNode, Suspense } from "react";
import { BottomNav } from "./bottom-nav";
import { GlobalKeyboardHandler } from "./global-keyboard-handler";
import { SideNav } from "./side-nav";

export interface AppShellProps {
	children: ReactNode;
}

export const AppShell = ({ children }: AppShellProps) => (
	<>
		<GlobalKeyboardHandler />
		<div className="mx-auto flex h-screen min-h-[600px] w-full border-[0.5px] border-x border-bd-2 bg-panel max-md:h-auto max-md:min-h-dvh max-md:border-x-0">
			<Suspense>
				<SideNav />
			</Suspense>
			<main className="flex min-w-0 flex-1 flex-col overflow-hidden max-md:overflow-visible max-md:pb-[calc(56px+env(safe-area-inset-bottom))]">
				{children}
			</main>
		</div>
		<Suspense>
			<BottomNav />
		</Suspense>
		<ToastViewport />
		<PwaInstallBanner />
	</>
);
