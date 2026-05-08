"use client";

import type { FeatureFlagItem } from "@/entities/feature-flag";

interface FeatureFlagDeleteModalProps {
	flag: FeatureFlagItem | null;
	isDeleting: boolean;
	onConfirm: () => void;
	onClose: () => void;
	t: (key: string) => string;
}

export const FeatureFlagDeleteModal = ({
	flag,
	isDeleting,
	onConfirm,
	onClose,
	t,
}: FeatureFlagDeleteModalProps) => {
	if (!flag) return null;

	return (
		<div
			className="fixed inset-0 z-[200] flex items-center justify-center bg-black/30 backdrop-blur-[3px]"
			onClick={e => {
				if (e.target === e.currentTarget) onClose();
			}}
		>
			<div className="w-[400px] rounded-[14px] border border-bd-2 bg-surf p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
				<h2 className="font-display text-[16px] text-t-1 mb-1">
					{t("admin.featureFlags.deleteModal.title")}
				</h2>
				<p className="mb-4 text-[12.5px] text-t-3">
					{t("admin.featureFlags.deleteModal.subtitle")}
				</p>
				<div className="mb-4 rounded-[8px] border border-bd-1 bg-surf-2 px-3 py-2">
					<span className="font-mono text-[12px] text-t-1">{flag.key}</span>
				</div>
				<div className="flex justify-end gap-2">
					<button
						type="button"
						onClick={onClose}
						disabled={isDeleting}
						className="h-8 cursor-pointer rounded-base border border-bd-2 bg-transparent px-3.5 text-[12.5px] text-t-2 transition-all hover:border-bd-3 hover:bg-surf-2 disabled:opacity-50"
					>
						{t("admin.featureFlags.deleteModal.cancel")}
					</button>
					<button
						type="button"
						onClick={onConfirm}
						disabled={isDeleting}
						className="h-8 cursor-pointer rounded-base bg-red-500 px-3.5 text-[12.5px] font-semibold text-white transition-opacity hover:opacity-[.88] disabled:opacity-50"
					>
						{isDeleting
							? t("admin.featureFlags.deleteModal.deleting")
							: t("admin.featureFlags.deleteModal.confirm")}
					</button>
				</div>
			</div>
		</div>
	);
};
