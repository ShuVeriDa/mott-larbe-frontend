"use client";

import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useI18n } from "@/shared/lib/i18n";
import { spring, variants } from "@/shared/lib/animation";
import { Button } from "@/shared/ui/button";
import { InputLabel } from "@/shared/ui/input";
import { useLocationForm } from "../model/use-location-form";
import { RegionSelector } from "./region-selector";
import { DistrictSelector } from "./district-selector";
import { SettlementSelector } from "./settlement-selector";

interface SubmitButtonProps {
	isPending: boolean;
}

const SubmitButton = ({ isPending }: SubmitButtonProps) => {
	const { pending } = useFormStatus();
	const { t } = useI18n();
	const isLoading = pending || isPending;

	return (
		<Button
			type="submit"
			variant="action"
			disabled={isLoading}
			className="max-sm:w-full max-sm:h-10 max-sm:text-[13px] max-sm:rounded-[8px]"
		>
			{isLoading ? t("profile.toasts.saving") : t("profile.common.save")}
		</Button>
	);
};

interface FormSectionProps {
	label: string;
	children: ReactNode;
}

const FormSection = ({ label, children }: FormSectionProps) => (
	<motion.div
		key={label}
		variants={variants.fadeUp}
		initial="hidden"
		animate="visible"
		exit="exit"
		transition={spring.default}
		className="flex flex-col gap-1.5"
	>
		<InputLabel>{label}</InputLabel>
		{children}
	</motion.div>
);

interface LocationFormProps {
	lang: string;
}

export const LocationForm = ({ lang }: LocationFormProps) => {
	const { t } = useI18n();

	const {
		selectedRegionId,
		selectedDistrictId,
		selectedSettlementId,
		regions,
		districts,
		settlements,
		isRegionsPending,
		isDistrictsPending,
		isSettlementsPending,
		formAction,
		isPending,
		handleRegionSelect,
		handleDistrictSelect,
		handleSettlementSelect,
	} = useLocationForm();

	const showDistrictSection = !!selectedRegionId;
	const showSettlementSection = !!selectedDistrictId;

	return (
		<form action={formAction} className="flex flex-col gap-4">
			{/* Region */}
			<FormSection label={t("location.region")}>
				<RegionSelector
					regions={regions}
					selectedRegionId={selectedRegionId}
					isLoading={isRegionsPending}
					onRegionSelect={handleRegionSelect}
					lang={lang}
				/>
			</FormSection>

			<AnimatePresence mode="sync">
				{/* District */}
				{showDistrictSection && (
					<FormSection key="district" label={t("location.district")}>
						<DistrictSelector
							districts={districts}
							selectedDistrictId={selectedDistrictId}
							isLoading={isDistrictsPending}
							isDisabled={!selectedRegionId}
							onDistrictSelect={handleDistrictSelect}
							lang={lang}
						/>
					</FormSection>
				)}

				{/* Settlement */}
				{showSettlementSection && (
					<FormSection key="settlement" label={t("location.settlement")}>
						<SettlementSelector
							settlements={settlements}
							selectedSettlementId={selectedSettlementId}
							isLoading={isSettlementsPending}
							isDisabled={!selectedDistrictId}
							onSettlementSelect={handleSettlementSelect}
							lang={lang}
						/>
					</FormSection>
				)}
			</AnimatePresence>

			{/* Submit */}
			<div className="flex justify-end pt-1 max-sm:justify-stretch">
				<SubmitButton isPending={isPending} />
			</div>
		</form>
	);
};
