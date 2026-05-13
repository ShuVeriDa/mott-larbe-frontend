import type { Subscription } from "@/entities/subscription";
import { cn } from "@/shared/lib/cn";
import type { useI18n } from "@/shared/lib/i18n";
import { Avatar } from "@/shared/ui/avatar";
import type { UserRole } from "../lib/user-helpers";

const ROLE_STYLES: Record<UserRole, string> = {
	superadmin: "bg-purple-600/25 text-purple-950 dark:text-purple-100 border-purple-500/40",
	admin: "bg-red-500/15 text-red-400 border-red-500/30",
	linguist: "bg-blue-500/15 text-blue-400 border-blue-500/30",
	content: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
	support: "bg-amber-500/15 text-amber-400 border-amber-500/30",
	learner: "bg-surf-2 text-t-3 border-bd-1",
};

const PLAN_STYLES: Record<string, string> = {
	LIFETIME: "bg-amber-500/15 text-amber-300 border-amber-500/30",
	PRO: "bg-violet-500/15 text-violet-300 border-violet-500/30",
	PREMIUM: "bg-linear-to-r from-amber-400/30 to-yellow-300/20 text-amber-950 dark:text-amber-100 border-amber-400/50 shadow-[0_0_8px_rgb(251_191_36_/_0.15)]",
	BASIC: "bg-teal-500/15 text-teal-300 border-teal-500/30",
	FREE: "bg-surf-2 text-t-3 border-bd-1",
};

interface UserMenuHeaderProps {
	initials: string;
	displayName: string;
	email: string;
	avatarUrl?: string | null;
	role: UserRole;
	subscription: Subscription | null | undefined;
	t: ReturnType<typeof useI18n>["t"];
}

export const UserMenuHeader = ({
	initials,
	displayName,
	email,
	avatarUrl,
	role,
	subscription,
	t,
}: UserMenuHeaderProps) => {
	const planType = subscription?.plan.type ?? "FREE";
	const planName = subscription?.plan.name ?? t("nav.userMenu.freePlan");
	const planStyle = PLAN_STYLES[planType] ?? PLAN_STYLES.FREE;
	const roleStyle = ROLE_STYLES[role];
	const roleLabel = t(`nav.userMenu.roles.${role}`);
	const isLearner = role === "learner";

	return (
		<div className="relative px-3.5 pt-3.5 pb-3 border-b border-bd-1">
			{/* <span
				aria-hidden="true"
				className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-acc/60 via-acc/20 to-transparent"
			/> */}
			<div className="flex items-center gap-3">
				<Avatar
					size="lg"
					src={avatarUrl ?? undefined}
					className="shrink-0 ring-2 ring-acc/20"
				>
					{initials}
				</Avatar>
				<div className="min-w-0 flex-1">
					<div className="truncate text-[13px] font-semibold text-t-1 leading-tight">
						{displayName}
					</div>
					<div className="mt-0.5 truncate text-[11px] text-t-3 leading-tight">
						{email}
					</div>
					<div className="mt-2 flex items-center gap-1 flex-wrap">
						{!isLearner && (
							<span
								className={cn(
									"inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium leading-none",
									roleStyle,
								)}
							>
								{roleLabel}
							</span>
						)}
						<span
							className={cn(
								"inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium leading-none",
								planStyle,
							)}
						>
							{planName}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};
