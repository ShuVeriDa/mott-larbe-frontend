"use client";

import { Typography } from "@/shared/ui/typography";

import { Button } from "@/shared/ui/button";
import { ComponentProps, ReactNode, useState } from 'react';
import { useI18n } from "@/shared/lib/i18n";
import { adminUserApi } from "@/entities/admin-user";
import { CreditCard, Monitor, Clock, Snowflake, Ban, Trash2 } from "lucide-react";
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

		const handleResetSessionsClick: NonNullable<ComponentProps<typeof ActionButton>["onClick"]> = () => sessions.logoutAll.mutate();
	const handleCouponToggleClick: NonNullable<ComponentProps<typeof ActionButton>["onClick"]> = () => setShowCoupon((v) => !v);
	const handleCouponInputChange: NonNullable<ComponentProps<"input">["onChange"]> = (e) => setCouponInput(e.currentTarget.value);
	const handleKeyDown: NonNullable<ComponentProps<"input">["onKeyDown"]> = (e) => e.key === "Enter" && handleCouponSubmit();
	const handleFreezeToggleClick: NonNullable<ComponentProps<typeof ActionButton>["onClick"]> = () =>
						isFrozen
							? mutations.unfreeze.mutate(user.id)
							: mutations.freeze.mutate(user.id);
	const handleBlockClick: NonNullable<ComponentProps<typeof ActionButton>["onClick"]> = () => mutations.block.mutate(user.id);
	const handleDeleteClick: NonNullable<ComponentProps<typeof ActionButton>["onClick"]> = () => mutations.remove.mutate(user.id);
return (
		<div className="flex flex-col gap-1.5 px-4 py-3">
			<div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.6px] text-t-3">
				{t("admin.userDetail.actions.title")}
			</div>

			<ActionButton icon={<CreditCard className="size-full" />} label={t("admin.userDetail.actions.manageSubscription")} onClick={onManageSubscription} />

			<ActionButton
				icon={<Monitor className="size-full" />}
				label={t("admin.userDetail.actions.resetSessions")}
				onClick={handleResetSessionsClick}
				disabled={sessions.logoutAll.isPending}
			/>

			<div>
				<ActionButton
					icon={<Clock className="size-full" />}
					label={t("admin.userDetail.actions.applyCoupon")}
					onClick={handleCouponToggleClick}
				/>
				{showCoupon && (
					<div className="mt-1.5 flex gap-1.5">
						<input
							value={couponInput}
							onChange={handleCouponInputChange}
							onKeyDown={handleKeyDown}
							placeholder="PROMO_CODE"
							className="h-7 flex-1 rounded-[6px] border border-bd-2 bg-surf-2 px-2 text-[12px] text-t-1 outline-none placeholder:text-t-4 focus:border-acc"
						/>
						<Button
							onClick={handleCouponSubmit}
							disabled={couponPending || !couponInput.trim()}
							className="h-7 rounded-[6px] bg-acc-bg px-2.5 text-[12px] font-semibold text-acc-t transition-colors hover:bg-acc-bg/80 disabled:opacity-50"
						>
							OK
						</Button>
					</div>
				)}
			</div>

			{(isActive || isBlocked) && (
				<ActionButton
					icon={<Snowflake className="size-full" />}
					label={
						isFrozen
							? t("admin.users.actions.unfreeze")
							: t("admin.users.actions.freeze")
					}
					variant="amber"
					onClick={handleFreezeToggleClick}
					disabled={mutations.freeze.isPending || mutations.unfreeze.isPending}
				/>
			)}

			{!isBlocked && (
				<ActionButton
					icon={<Ban className="size-full" />}
					label={t("admin.users.actions.block")}
					variant="danger"
					onClick={handleBlockClick}
					disabled={mutations.block.isPending}
				/>
			)}

			<ActionButton
				icon={<Trash2 className="size-full" />}
				label={t("admin.users.actions.delete")}
				variant="danger"
				onClick={handleDeleteClick}
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
		<Button
			onClick={onClick}
			disabled={disabled}
			className={`flex h-8 w-full items-center gap-2 rounded-base border px-2.5 text-[12.5px] transition-colors disabled:opacity-50 ${variantClass}`}
		>
			<Typography tag="span" className="size-[13px] shrink-0 [&>svg]:h-full [&>svg]:w-full">{icon}</Typography>
			{label}
		</Button>
	);
};

