"use client";

import { AnimatePresence, motion } from "framer-motion";
import { springs } from "@/shared/lib/animations";
import type { useGenerateUserText } from "../model/use-generate-user-text";
import { ContentTypeField } from "./content-type-field";
import { TopicField } from "./topic-field";
import { ToneField } from "./tone-field";
import { DialogueCharacterCountField } from "./dialogue-character-count-field";
import { GrammarFocusField } from "./grammar-focus-field";
import { TargetLengthField } from "./target-length-field";
import { DifficultyField } from "./difficulty-field";

type GenerateUserTextState = ReturnType<typeof useGenerateUserText>;

interface GenerationSettingsFormProps {
	state: GenerateUserTextState;
	disabled: boolean;
}

export const GenerationSettingsForm = ({ state, disabled }: GenerationSettingsFormProps) => (
	<fieldset disabled={disabled} className="grid gap-4 disabled:opacity-60 sm:grid-cols-2">
		<ContentTypeField value={state.contentType} onChange={state.handleContentTypeChange} />
		<TopicField
			value={state.topic}
			customValue={state.customTopic}
			fieldError={state.fieldErrors.customTopic}
			onChange={state.handleTopicChange}
			onCustomChange={state.handleCustomTopicChange}
		/>
		<ToneField value={state.tone} onChange={state.handleToneChange} />
		<AnimatePresence>
			{state.contentType === "DIALOGUE" && (
				<motion.div
					initial={{ opacity: 0, height: 0 }}
					animate={{ opacity: 1, height: "auto" }}
					exit={{ opacity: 0, height: 0 }}
					transition={springs.snappy}
					className="overflow-hidden"
				>
					<DialogueCharacterCountField
						value={state.dialogueCharacterCount}
						onChange={state.handleDialogueCharacterCountChange}
					/>
				</motion.div>
			)}
		</AnimatePresence>
		<GrammarFocusField
			value={state.grammarFocus}
			customValue={state.customGrammarFocus}
			fieldError={state.fieldErrors.customGrammarFocus}
			onChange={state.handleGrammarFocusChange}
			onCustomChange={state.handleCustomGrammarFocusChange}
		/>
		<TargetLengthField value={state.targetLength} onChange={state.handleTargetLengthChange} />
		<DifficultyField value={state.difficulty} onChange={state.handleDifficultyChange} />
	</fieldset>
);
