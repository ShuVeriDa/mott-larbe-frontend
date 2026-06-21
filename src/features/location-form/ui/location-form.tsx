"use client";

import type { ChangeEvent, ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { PenLine } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useI18n } from "@/shared/lib/i18n";
import { spring, variants } from "@/shared/lib/animation";
import { Button } from "@/shared/ui/button";
import { Input, InputLabel } from "@/shared/ui/input";
import { useLocationForm } from "../model/use-location-form";
import { CountrySelector } from "./country-selector";
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
	sectionKey: string;
}

const FormSection = ({ label, children, sectionKey }: FormSectionProps) => (
	<motion.div
		key={sectionKey}
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
		selectedCountryId,
		selectedRegionId,
		selectedDistrictId,
		selectedSettlementId,
		settlementCustom,
		isCustomSettlement,
		ancestralVillage,
		countries,
		regions,
		districts,
		settlements,
		isCountriesPending,
		isRegionsPending,
		isDistrictsPending,
		isSettlementsPending,
		formAction,
		isPending,
		handleCountrySelect,
		handleRegionSelect,
		handleDistrictSelect,
		handleSettlementSelect,
		handleToggleCustomSettlement,
		handleSettlementCustomChange,
		handleAncestralVillageChange,
	} = useLocationForm();

	const showRegionSection = !!selectedCountryId;
	const showDistrictSection = !!selectedRegionId;
	const showSettlementSection = !!selectedDistrictId;

	const handleAncestralVillageInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		handleAncestralVillageChange(e.currentTarget.value);
	};

	const handleSettlementCustomInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		handleSettlementCustomChange(e.currentTarget.value);
	};

	return (
		<form action={formAction} className="flex flex-col gap-4">
			{/* Country */}
			<FormSection label={t("location.country")} sectionKey="country">
				<CountrySelector
					countries={countries}
					selectedCountryId={selectedCountryId}
					isLoading={isCountriesPending}
					onCountrySelect={handleCountrySelect}
					lang={lang}
				/>
			</FormSection>

			<AnimatePresence mode="sync">
				{/* Region */}
				{showRegionSection && (
					<FormSection key="region" label={t("location.region")} sectionKey="region">
						<RegionSelector
							regions={regions}
							selectedRegionId={selectedRegionId}
							isLoading={isRegionsPending}
							isDisabled={!selectedCountryId}
							onRegionSelect={handleRegionSelect}
							lang={lang}
						/>
					</FormSection>
				)}

				{/* District */}
				{showDistrictSection && (
					<FormSection key="district" label={t("location.district")} sectionKey="district">
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

				{/* Settlement — with custom input toggle */}
				{showSettlementSection && (
					<FormSection key="settlement" label={t("location.settlement")} sectionKey="settlement">
						<AnimatePresence mode="wait" initial={false}>
							{isCustomSettlement ? (
								<motion.div
									key="custom"
									variants={variants.fadeUp}
									initial="hidden"
									animate="visible"
									exit="exit"
									transition={spring.snappy}
								>
									<Input
										name="settlementCustom"
										value={settlementCustom}
										onChange={handleSettlementCustomInputChange}
										placeholder={t("location.settlement_custom_placeholder")}
										maxLength={100}
										autoComplete="off"
										autoFocus
									/>
								</motion.div>
							) : (
								<motion.div
									key="select"
									variants={variants.fadeUp}
									initial="hidden"
									animate="visible"
									exit="exit"
									transition={spring.snappy}
								>
									<SettlementSelector
										settlements={settlements}
										selectedSettlementId={selectedSettlementId}
										isLoading={isSettlementsPending}
										isDisabled={!selectedDistrictId}
										onSettlementSelect={handleSettlementSelect}
										lang={lang}
									/>
								</motion.div>
							)}
						</AnimatePresence>
						<button
							type="button"
							onClick={handleToggleCustomSettlement}
							className="flex items-center gap-1 mt-1 text-[11px] text-t-3 hover:text-accent transition-colors duration-150 ease-out self-start"
						>
							<PenLine className="h-3 w-3" aria-hidden />
							{isCustomSettlement
								? t("location.settlement_pick_from_list")
								: t("location.settlement_not_in_list")}
						</button>
					</FormSection>
				)}
			</AnimatePresence>

			{/* Ancestral village — always visible, independent text field */}
			<FormSection label={t("location.ancestral_village")} sectionKey="ancestral">
				<Input
					name="ancestralVillage"
					value={ancestralVillage}
					onChange={handleAncestralVillageInputChange}
					placeholder={t("location.ancestral_village_placeholder")}
					maxLength={100}
					autoComplete="off"
				/>
				<p className="text-[11px] text-t-3 leading-tight mt-0.5">
					{t("location.ancestral_village_hint")}
				</p>
			</FormSection>

			{/* Submit */}
			<div className="flex justify-end pt-1 max-sm:justify-stretch">
				<SubmitButton isPending={isPending} />
			</div>
		</form>
	);
};
