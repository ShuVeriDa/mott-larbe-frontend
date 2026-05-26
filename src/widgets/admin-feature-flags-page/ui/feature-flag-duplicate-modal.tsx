"use client";

import { Typography } from "@/shared/ui/typography";
import { Button } from "@/shared/ui/button";
import type { FeatureFlagItem } from "@/entities/feature-flag";
import { cn } from "@/shared/lib/cn";
import { Input } from "@/shared/ui/input";
import { Modal, ModalActions } from "@/shared/ui/modal";
import { ComponentProps, useEffect, useState } from 'react';

interface FeatureFlagDuplicateModalProps {
	flag: FeatureFlagItem | null;
	isDuplicating: boolean;
	onConfirm: (newKey: string) => void;
	onClose: () => void;
	t: (key: string) => string;
}

export const FeatureFlagDuplicateModal = ({
	flag,
	isDuplicating,
	onConfirm,
	onClose,
	t,
}: FeatureFlagDuplicateModalProps) => {
	const [key, setKey] = useState("");
	const [keyError, setKeyError] = useState("");

	useEffect(() => {
		if (!flag) return;
		// eslint-disable-next-line react-hooks/set-state-in-effect -- prefill duplicate key from selected flag
		setKey(`${flag.key}_copy`);
		setKeyError("");
	}, [flag]);

	const handleSubmit = () => {
		const keyPattern = /^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$/;
		if (!keyPattern.test(key)) {
			setKeyError(t("admin.featureFlags.modal.keyHint"));
			return;
		}
		onConfirm(key);
	};

	const handleChange: NonNullable<ComponentProps<"input">["onChange"]> = e => {
		setKey(e.currentTarget.value);
		setKeyError("");
	};

	return (
		<Modal
			open={!!flag}
			onClose={onClose}
			title={t("admin.featureFlags.duplicateModal.title")}
			className="max-w-[400px]"
		>
			<Typography tag="p" className="mb-4 text-[12.5px] text-t-3">
				{t("admin.featureFlags.duplicateModal.subtitle")}
			</Typography>
			<div className="mb-2">
				<Typography tag="label" className="mb-1.5 block text-[11.5px] font-semibold text-t-2">
					{t("admin.featureFlags.modal.keyLabel")} *
				</Typography>
				<Input
					className={cn("rounded-[8px]", keyError && "border-red-400")}
					value={key}
					onChange={handleChange}
					aria-label={t("admin.featureFlags.modal.keyLabel")}
					aria-invalid={Boolean(keyError)}
					aria-describedby="dup-key-hint"
				/>
				{keyError ? (
					<Typography id="dup-key-hint" tag="p" className="mt-1 text-[11px] text-red-t">{keyError}</Typography>
				) : (
					<Typography id="dup-key-hint" tag="p" className="mt-1 text-[11px] text-t-3">
						{t("admin.featureFlags.modal.keyHint")}
					</Typography>
				)}
			</div>
			<ModalActions>
				<Button
					variant="ghost"
					onClick={onClose}
					disabled={isDuplicating}
					className="h-[34px] px-4 rounded-lg text-[13px]"
				>
					{t("admin.featureFlags.modal.cancel")}
				</Button>
				<Button
					variant="action"
					onClick={handleSubmit}
					disabled={isDuplicating || !key}
					className="h-[34px] flex-1 px-4 rounded-lg text-[13px]"
				>
					{isDuplicating
						? t("admin.featureFlags.duplicateModal.duplicating")
						: t("admin.featureFlags.duplicateModal.confirm")}
				</Button>
			</ModalActions>
		</Modal>
	);
};
