"use client";

import { Button } from "@/shared/ui/button";
import { ComponentProps } from "react";
import { User, LogOut, Snowflake } from "lucide-react";

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
				<User className="size-3 shrink-0 text-t-3" />
				{labels.goToProfile}
			</Button>
			<Button
				onClick={handleLogoutAll}
				disabled={isLogoutPending}
				className="flex h-[30px] w-full items-center gap-1.5 rounded-base border border-bd-2 bg-transparent px-2.5 text-[12px] text-t-2 transition-colors hover:bg-surf-2 hover:text-t-1 disabled:opacity-60"
			>
				<LogOut className="size-3 shrink-0 text-t-3" />
				{labels.resetSessions}
			</Button>
			<Button
				onClick={handleFreeze}
				disabled={isFreezePending}
				className="flex h-[30px] w-full items-center gap-1.5 rounded-base border border-[rgba(220,38,38,0.2)] bg-transparent px-2.5 text-[12px] text-red-t transition-colors hover:border-transparent hover:bg-red-bg disabled:opacity-60"
			>
				<Snowflake className="size-3 shrink-0 text-red-t" />
				{labels.freezeAccount}
			</Button>
		</div>
	);
};
