"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/shared/ui/button";
import { useI18n } from "@/shared/lib/i18n";
import { springs } from "@/shared/lib/animations";
import { usePickGenerationWords, PickGenerationWords } from "@/features/pick-generation-words";
import { useGenerateUserText } from "../model/use-generate-user-text";
import type { UseGenerateUserTextProps } from "../model/types";
import { GenerationSettingsForm } from "./generation-settings-form";
import { GeneratedTextPreview } from "./generated-text-preview";
import { GenerationApplyModePicker } from "./generation-apply-mode-picker";

export const GenerateUserTextPanel = (props: UseGenerateUserTextProps) => {
	const { t } = useI18n();
	const words = usePickGenerationWords();
	const generation = useGenerateUserText(props, words);

	return (
		<div className="space-y-6">
			<PickGenerationWords state={words} />

			<AnimatePresence mode="wait">
				{generation.pendingResult ? (
					<motion.div
						key="preview"
						initial={{ opacity: 0, y: 8 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 8 }}
						transition={springs.gentle}
						className="space-y-4"
					>
						<GeneratedTextPreview content={generation.pendingResult.content} />
						<GenerationApplyModePicker
							isActivePageEmpty={generation.isActivePageEmpty}
							onApply={generation.handleApplyGenerated}
							onCancel={generation.handleDiscardGenerated}
						/>
					</motion.div>
				) : (
					<motion.div
						key="form"
						initial={{ opacity: 0, y: 8 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 8 }}
						transition={springs.gentle}
						className="space-y-6"
					>
						<GenerationSettingsForm state={generation} disabled={generation.isGenerating} />
						<Button
							variant="action"
							size="lg"
							onClick={generation.handleGenerate}
							disabled={generation.isGenerating}
							className="w-full"
						>
							{generation.isGenerating ? t("myTexts.generate.generating") : t("myTexts.generate.submit")}
						</Button>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};
