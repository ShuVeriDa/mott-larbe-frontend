import type { ReactNode } from "react";
import { AdminGuard } from "./admin-guard";
import { AdminSideNav } from "./admin-side-nav";

interface AdminShellProps {
	children: ReactNode;
}

export const AdminShell = ({ children }: AdminShellProps) => (
	<AdminGuard>
		<div className="mx-auto flex min-h-screen w-full  border-x border-bd-2 bg-panel max-md:border-x-0">
			<AdminSideNav />
			<main className="flex min-w-0 flex-1 flex-col overflow-hidden max-md:overflow-visible">
				{children}
			</main>
		</div>
	</AdminGuard>
);
