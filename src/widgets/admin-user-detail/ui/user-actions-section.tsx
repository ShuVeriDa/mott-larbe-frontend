"use client";
import { ComponentProps, ReactNode, useState } from 'react';
import { useI18n } from "@/shared/lib/i18n";
import { adminUserApi } from "@/entities/admin-user";
import type { AdminUserDetail } from "@/entities/admin-user";
import type { useAdminUserMutations } from "@/entities/admin-user/model/use-admin-user-mutations";
import type { useAdminUserSessions } from "@/entities/admin-user/model/use-admin-user-sessions";

interface UserActionsSectionProps {
	user: AdminUserDetail;
	mutations: ReturnType<typeof useAdminUserMutations>;
	sessions: ReturnType<typeof useAdminUserSessions>;
	onManageSubscription: () => void;
}

export const UserActionsSection = ({ user, mutations, sessions, onManageSubscription }: UserActionsSectionProps) => {
	const { t } = useI18n();
	const [couponInput, setCouponInput] = useState("");
	const [showCoupon, setShowCoupon] = useState(false);
	const [couponPending, setCouponPending] = useState(false);

	const isActive = user.status === "ACTIVE";
	const isFrozen = user.status === "FROZEN";
	const isBlocked = user.status === "BLOCKED";

	const handleCouponSubmit = async () => {
		if (!couponInput.trim()) return;
		setCouponPending(true);
		try {
			await adminUserApi.applyCoupon(user.id, couponInput.trim());
			setCouponInput("");
			setShowCoupon(false);
		} finally {
			setCouponPending(false);
		}
	};

		const handleClick: NonNullable<ComponentProps<typeof ActionButton>["onClick"]> = () => sessions.logoutAll.mutate();
	const handleClick2: NonNullable<ComponentProps<typeof ActionButton>["onClick"]> = () => setShowCoupon((v) => !v);
	const handleChange: NonNullable<ComponentProps<"input">["onChange"]> = (e) => setCouponInput(e.currentTarget.value);
	const handleKeyDown: NonNullable<ComponentProps<"input">["onKeyDown"]> = (e) => e.key === "Enter" && handleCouponSubmit();
	const handleClick3: NonNullable<ComponentProps<typeof ActionButton>["onClick"]> = () =>
						isFrozen
							? mutations.unfreeze.mutate(user.id)
							: mutations.freeze.mutate(user.id);
	const handleClick4: NonNullable<ComponentProps<typeof ActionButton>["onClick"]> = () => mutations.block.mutate(user.id);
	const handleClick5: NonNullable<ComponentProps<typeof ActionButton>["onClick"]> = () => mutations.remove.mutate(user.id);
return (
		<div className="flex flex-col gap-1.5 px-4 py-3">
			<div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.6px] text-t-3">
				{t("admin.userDetail.actions.title")}
			</div>

			<ActionButton icon={<BillingIcon />} label={t("admin.userDetail.actions.manageSubscription")} onClick={onManageSubscription} />

			<ActionButton
				icon={<SessionsIcon />}
				label={t("admin.userDetail.actions.resetSessions")}
				onClick={handleClick}
				disabled={sessions.logoutAll.isPending}
			/>

			<div>
				<ActionButton
					icon={<CouponIcon />}
					label={t("admin.userDetail.actions.applyCoupon")}
					onClick={handleClick2}
				/>
				{showCoupon && (
					<div className="mt-1.5 flex gap-1.5">
						<input
							value={couponInput}
							onChange={handleChange}
							onKeyDown={handleKeyDown}
							placeholder="PROMO_CODE"
							className="h-7 flex-1 rounded-[6px] border border-bd-2 bg-surf-2 px-2 text-[12px] text-t-1 outline-none placeholder:text-t-4 focus:border-acc"
						/>
						<button
							onClick={handleCouponSubmit}
							disabled={couponPending || !couponInput.trim()}
							className="h-7 rounded-[6px] bg-acc-bg px-2.5 text-[12px] font-semibold text-acc-t transition-colors hover:bg-acc-bg/80 disabled:opacity-50"
						>
							OK
						</button>
					</div>
				)}
			</div>

			{(isActive || isBlocked) && (
				<ActionButton
					icon={<FreezeIcon />}
					label={
						isFrozen
							? t("admin.users.actions.unfreeze")
							: t("admin.users.actions.freeze")
					}
					variant="amber"
					onClick={handleClick3
					}
					disabled={mutations.freeze.isPending || mutations.unfreeze.isPending}
				/>
			)}

			{!isBlocked && (
				<ActionButton
					icon={<BlockIcon />}
					label={t("admin.users.actions.block")}
					variant="danger"
					onClick={handleClick4}
					disabled={mutations.block.isPending}
				/>
			)}

			<ActionButton
				icon={<DeleteIcon />}
				label={t("admin.users.actions.delete")}
				variant="danger"
				onClick={handleClick5}
				disabled={mutations.remove.isPending}
			/>
		</div>
	);
};

// ── Sub-components ────────────────────────────────────────────────────────────

interface ActionButtonProps {
	icon: ReactNode;
	label: string;
	variant?: "default" | "amber" | "danger";
	onClick?: () => void;
	disabled?: boolean;
}

const ActionButton = ({
	icon,
	label,
	variant = "default",
	onClick,
	disabled,
}: ActionButtonProps) => {
	const variantClass = {
		default: "text-t-2 border-bd-2 hover:bg-surf-2 hover:text-t-1",
		amber: "text-amb-t border-amb/25 hover:bg-amb-bg",
		danger: "text-red-t border-red/25 hover:bg-red-bg",
	}[variant];

	return (
		<button
			onClick={onClick}
			disabled={disabled}
			className={`flex h-8 w-full items-center gap-2 rounded-base border px-2.5 text-[12.5px] transition-colors disabled:opacity-50 ${variantClass}`}
		>
			<span className="size-[13px] shrink-0 [&>svg]:h-full [&>svg]:w-full">{icon}</span>
			{label}
		</button>
	);
};

const BillingIcon = () => (
	<svg viewBox="0 0 16 16" fill="none">
		<rect x="2" y="4" width="12" height="9" rx="2" stroke="currentColor" strokeWidth="1.3" />
		<path d="M5 4V3.5a.5.5 0 011 0V4M10 4V3.5a.5.5 0 011 0V4" stroke="currentColor" strokeWidth="1.3" />
	</svg>
);

const SessionsIcon = () => (
	<svg viewBox="0 0 16 16" fill="none">
		<path d="M2 10V5a2 2 0 012-2h8a2 2 0 012 2v5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
		<path d="M1 10h14M4 13l1-3h6l1 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
	</svg>
);

const CouponIcon = () => (
	<svg viewBox="0 0 16 16" fill="none">
		<circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3" />
		<path d="M8 5v3l2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
	</svg>
);

const FreezeIcon = () => (
	<svg viewBox="0 0 16 16" fill="none">
		<path d="M8 2v4M8 10v4M2 8h4M10 8h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
	</svg>
);

const BlockIcon = () => (
	<svg viewBox="0 0 16 16" fill="none">
		<circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3" />
		<path d="M10 6L6 10M6 6l4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
	</svg>
);

const DeleteIcon = () => (
	<svg viewBox="0 0 16 16" fill="none">
		<path d="M3 5h10M5 5V4a1 1 0 011-1h4a1 1 0 011 1v1M6 8v4M10 8v4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
		<path d="M4 5l.7 7.5A1 1 0 005.7 13h4.6a1 1 0 001-.95L12 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
	</svg>
);
