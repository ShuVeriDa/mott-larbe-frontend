"use client";

import type { GeneratedTextResult } from "@/entities/text-generation";
import type { UserTextLanguage } from "@/entities/user-text";
import { GenerateUserTextPanel, type GenerationApplyMode } from "@/features/generate-user-text";
import { springs } from "@/shared/lib/animations";
import { useI18n } from "@/shared/lib/i18n";
import { AdminTextEditorTitleField } from "@/shared/ui/admin-text-editor";
import { AnimatePresence, motion } from "framer-motion";

interface UserTextGenerateModeProps {
	title: string;
	language: UserTextLanguage;
	isActivePageEmpty: boolean;
	onTitleChange: (value: string) => void;
	onGenerated: (
		result: GeneratedTextResult,
		selectedWordsCount: number,
		applyMode: GenerationApplyMode,
	) => void;
	onNeedsGeminiKey: () => void;
	onGeneratingChange: (isGenerating: boolean) => void;
}

export const UserTextGenerateMode = ({
	title,
	language,
	isActivePageEmpty,
	onTitleChange,
	onGenerated,
	onNeedsGeminiKey,
	onGeneratingChange,
}: UserTextGenerateModeProps) => {
	const { t } = useI18n();

	return (
		<AnimatePresence mode="wait">
			<motion.div
				key="generate"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				transition={springs.gentle}
				className="flex min-h-0 h-full min-w-0 flex-col overflow-hidden border-r border-bd-1 max-[767px]:border-r-0"
			>
				<AdminTextEditorTitleField
					value={title}
					placeholder={t("admin.texts.createPage.titlePlaceholder")}
					onChange={onTitleChange}
				/>
				<div className="flex-1 overflow-y-auto bg-surf px-[42px] py-[22px] pb-10 max-sm:px-4">
					<GenerateUserTextPanel
						language={language}
						isActivePageEmpty={isActivePageEmpty}
						onGenerated={onGenerated}
						onNeedsGeminiKey={onNeedsGeminiKey}
						onGeneratingChange={onGeneratingChange}
					/>
				</div>
			</motion.div>
		</AnimatePresence>
	);
};
