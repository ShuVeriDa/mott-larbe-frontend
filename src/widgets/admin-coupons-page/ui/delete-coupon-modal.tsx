import { ComponentProps } from 'react';
import type { useCouponMutations } from "@/entities/admin-coupon";
import { useI18n } from "@/shared/lib/i18n";

interface Props {
	couponId: string | null;
	hasError: boolean;
	mutations: ReturnType<typeof useCouponMutations>;
	onDelete: (id: string) => Promise<void>;
	onDeactivate: (id: string) => Promise<void>;
	onClose: () => void;
}

export const DeleteCouponModal = ({
	couponId,
	hasError,
	mutations,
	onDelete,
	onDeactivate,
	onClose,
}: Props) => {
	const { t } = useI18n();
	const isPending =
		mutations.remove.isPending || mutations.deactivate.isPending;

	if (!couponId) return null;

		const handleClick: NonNullable<ComponentProps<"button">["onClick"]> = () => onDeactivate(couponId);
	const handleClick2: NonNullable<ComponentProps<"button">["onClick"]> = () => onDelete(couponId);
return (
		<>
			{/* Header */}
			<div className="flex items-center justify-between border-b border-bd-1 px-4 py-3.5">
				<h2 className="font-display text-[14px] font-semibold text-t-1">
					{hasError
						? t("admin.coupons.deleteModal.errorTitle")
						: t("admin.coupons.deleteModal.title")}
				</h2>
				<button
					type="button"
					onClick={onClose}
					className="flex size-[26px] items-center justify-center rounded-base bg-surf-2 text-t-2 transition-colors hover:bg-surf-3"
				>
					<svg
						width="12"
						height="12"
						viewBox="0 0 12 12"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.5"
					>
						<path d="M2 2l8 8M10 2l-8 8" strokeLinecap="round" />
					</svg>
				</button>
			</div>

			{/* Body */}
			<div className="px-4 py-4">
				<p className="text-[13px] leading-relaxed text-t-2">
					{hasError
						? t("admin.coupons.deleteModal.errorText")
						: t("admin.coupons.deleteModal.text")}
				</p>
			</div>

			{/* Footer */}
			<div className="flex items-center justify-end gap-2 border-t border-bd-1 px-4 py-3">
				<button
					type="button"
					onClick={onClose}
					className="h-8 rounded-[8px] border border-bd-2 bg-surf-2 px-3.5 text-[12.5px] font-medium text-t-2 transition-colors hover:bg-surf-3"
				>
					{t("admin.coupons.deleteModal.cancel")}
				</button>

				{hasError ? (
					<button
						type="button"
						disabled={isPending}
						onClick={handleClick}
						className="h-8 rounded-[8px] bg-acc px-4 text-[12.5px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
					>
						{t("admin.coupons.deleteModal.deactivate")}
					</button>
				) : (
					<button
						type="button"
						disabled={isPending}
						onClick={handleClick2}
						className="h-8 rounded-[8px] bg-red px-4 text-[12.5px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
					>
						{t("admin.coupons.deleteModal.confirm")}
					</button>
				)}
			</div>
		</>
	);
};
