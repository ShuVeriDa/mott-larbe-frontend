"use client";

import { Button } from "@/shared/ui/button";
import { ComponentProps } from "react";

interface Props {
	labels: {
		goToProfile: string;
		resetSessions: string;
		freezeAccount: string;
	};
	isLogoutPending: boolean;
	isFreezePending: boolean;
	onGoToProfile: () => void;
	onLogoutAll: () => void;
	onFreeze: () => void;
}

export const SubscriptionActionsSection = ({
	labels,
	isLogoutPending,
	isFreezePending,
	onGoToProfile,
	onLogoutAll,
	onFreeze,
}: Props) => {
	const handleGoToProfile: NonNullable<ComponentProps<"button">["onClick"]> = () => onGoToProfile();
	const handleLogoutAll: NonNullable<ComponentProps<"button">["onClick"]> = () => onLogoutAll();
	const handleFreeze: NonNullable<ComponentProps<"button">["onClick"]> = () => onFreeze();

	return (
		<div className="flex flex-col gap-1.5 px-[15px] py-2.5">
			<Button
				onClick={handleGoToProfile}
				className="flex h-[30px] w-full items-center gap-1.5 rounded-base border border-bd-2 bg-transparent px-2.5 text-[12px] text-t-2 transition-colors hover:bg-surf-2 hover:text-t-1"
			>
				<svg className="size-3 shrink-0 text-t-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4">
					<circle cx="6" cy="4.5" r="2.5" />
					<path d="M1.5 10.5c0-2.485 2.015-4.5 4.5-4.5s4.5 2.015 4.5 4.5" strokeLinecap="round" />
				</svg>
				{labels.goToProfile}
			</Button>
			<Button
				onClick={handleLogoutAll}
				disabled={isLogoutPending}
				className="flex h-[30px] w-full items-center gap-1.5 rounded-base border border-bd-2 bg-transparent px-2.5 text-[12px] text-t-2 transition-colors hover:bg-surf-2 hover:text-t-1 disabled:opacity-60"
			>
				<svg className="size-3 shrink-0 text-t-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4">
					<path d="M8 2h2a1 1 0 011 1v6a1 1 0 01-1 1H8" strokeLinecap="round" />
					<path d="M5 8.5L2 6l3-2.5M2 6h6" strokeLinecap="round" strokeLinejoin="round" />
				</svg>
				{labels.resetSessions}
			</Button>
			<Button
				onClick={handleFreeze}
				disabled={isFreezePending}
				className="flex h-[30px] w-full items-center gap-1.5 rounded-base border border-[rgba(220,38,38,0.2)] bg-transparent px-2.5 text-[12px] text-red-t transition-colors hover:border-transparent hover:bg-red-bg disabled:opacity-60"
			>
				<svg className="size-3 shrink-0 text-red-t" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4">
					<path d="M6 1v10M1 6h10M2.5 2.5l7 7M9.5 2.5l-7 7" strokeLinecap="round" />
				</svg>
				{labels.freezeAccount}
			</Button>
		</div>
	);
};
