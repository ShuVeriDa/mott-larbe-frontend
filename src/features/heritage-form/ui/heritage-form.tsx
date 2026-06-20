"use client";

import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useI18n } from "@/shared/lib/i18n";
import { spring, variants } from "@/shared/lib/animation";
import { Button } from "@/shared/ui/button";
import { InputLabel } from "@/shared/ui/input";
import { useHeritageForm } from "../model/use-heritage-form";
import { useCustomTaip } from "../model/use-custom-taip";
import { useCustomGara } from "../model/use-custom-gara";
import { NationSelector } from "./nation-selector";
import { TukhumSelector } from "./tukhum-selector";
import { TaipSelector } from "./taip-selector";
import { TaipCustomInput } from "./taip-custom-input";
import { GaraSelector } from "./gara-selector";
import { GaraCustomInput } from "./gara-custom-input";
import { NekyiInput } from "./nekyi-input";

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

interface HeritageFormProps {
	lang: string;
}

export const HeritageForm = ({ lang }: HeritageFormProps) => {
	const { t } = useI18n();

	const {
		nationMode,
		selectedTukhumId,
		hasTukhum,
		selectedTaipId,
		selectedGaraId,
		showAllTaips,
		nekyi,
		otherNationId,
		nakhchiyNation,
		otherNations,
		nations,
		tukhumy,
		taips,
		formAction,
		isPending,
		handleNationSelect,
		handleTukhumSelect,
		handleHasTukhumChange,
		handleTaipSelect,
		handleShowAllTaipsToggle,
		handleGaraSelect,
		handleNekyiChange,
		handleOtherNationSelect,
	} = useHeritageForm();

	const customTaip = useCustomTaip();
	const customGara = useCustomGara();

	const showTukhumSection = nationMode === "nakhchiy";
	const showTaipSection =
		nationMode === "nakhchiy" &&
		(hasTukhum !== null || !!selectedTukhumId);
	const showGaraSection = nationMode === "nakhchiy" && !!selectedTaipId && !customTaip.isCustomMode;
	const showNekyiSection = nationMode === "nakhchiy";

	return (
		<form action={formAction} className="flex flex-col gap-4">
			{/* Nation */}
			<FormSection label={t("heritage.nation")}>
				<NationSelector
					nations={nations}
					nakhchiyNation={nakhchiyNation}
					otherNations={otherNations}
					nationMode={nationMode}
					otherNationId={otherNationId}
					onNationSelect={handleNationSelect}
					onOtherNationSelect={handleOtherNationSelect}
					lang={lang}
				/>
			</FormSection>

			<AnimatePresence mode="sync">
				{/* Tukhum */}
				{showTukhumSection && (
					<FormSection key="tukhum" label={t("heritage.tukhum")}>
						<TukhumSelector
							tukhumy={tukhumy}
							selectedTukhumId={selectedTukhumId}
							hasTukhum={hasTukhum}
							onTukhumSelect={handleTukhumSelect}
							onHasTukhumChange={handleHasTukhumChange}
							lang={lang}
						/>
					</FormSection>
				)}

				{/* Taip */}
				{showTaipSection && (
					<FormSection key="taip" label={t("heritage.taip")}>
						<TaipSelector
							taips={taips}
							selectedTaipId={customTaip.isCustomMode ? null : selectedTaipId}
							showAllTaips={showAllTaips}
							isCustomMode={customTaip.isCustomMode}
							hasTukhum={hasTukhum}
							onTaipSelect={handleTaipSelect}
							onShowAllTaipsToggle={handleShowAllTaipsToggle}
							onToggleCustomMode={customTaip.handleToggleCustomMode}
							lang={lang}
						/>
						<AnimatePresence>
							{customTaip.isCustomMode && (
								<TaipCustomInput
									value={customTaip.customValue}
									onChange={customTaip.handleCustomValueChange}
								/>
							)}
						</AnimatePresence>
					</FormSection>
				)}

				{/* Gara */}
				{showGaraSection && (
					<FormSection key="gara" label={t("heritage.gara")}>
						<GaraSelector
							selectedTaipId={selectedTaipId}
							selectedGaraId={customGara.isCustomMode ? null : selectedGaraId}
							isCustomMode={customGara.isCustomMode}
							onGaraSelect={handleGaraSelect}
							onToggleCustomMode={customGara.handleToggleCustomMode}
							lang={lang}
						/>
						<AnimatePresence>
							{customGara.isCustomMode && (
								<GaraCustomInput
									value={customGara.customValue}
									onChange={customGara.handleCustomValueChange}
								/>
							)}
						</AnimatePresence>
					</FormSection>
				)}

				{/* Nekyi */}
				{showNekyiSection && (
					<motion.div
						key="nekyi"
						variants={variants.fadeUp}
						initial="hidden"
						animate="visible"
						exit="exit"
						transition={spring.default}
					>
						<NekyiInput value={nekyi} onChange={handleNekyiChange} />
					</motion.div>
				)}
			</AnimatePresence>

			{/* Submit */}
			{nationMode !== null && (
				<div className="flex justify-end pt-1 max-sm:justify-stretch">
					<SubmitButton isPending={isPending} />
				</div>
			)}
		</form>
	);
};
