"use client";

import { AiRefineBlock } from "@/shared/ui/ai-refine-block";
import type { AiPhraseRefineState } from "../model/use-ai-phrase-translate";

interface PhraseRefineBlockProps {
	refineState: AiPhraseRefineState;
	onOpen: () => void;
	onSubmit: (hint: string) => void;
}

export const PhraseRefineBlock = ({
	refineState,
	onOpen,
	onSubmit,
}: PhraseRefineBlockProps) => (
	<AiRefineBlock
		refineState={refineState}
		onOpen={onOpen}
		onSubmit={onSubmit}
	/>
);
