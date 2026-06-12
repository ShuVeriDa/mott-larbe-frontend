"use client";

import { AiRefineBlock } from "@/shared/ui/ai-refine-block";
import type { AiWordRefineState } from "../model/use-ai-word-refine";

interface WordRefineBlockProps {
	refineState: AiWordRefineState;
	size: "sm" | "md";
	onOpen: () => void;
	onSubmit: (hint: string) => void;
}

export const WordRefineBlock = ({
	refineState,
	size,
	onOpen,
	onSubmit,
}: WordRefineBlockProps) => (
	<AiRefineBlock
		refineState={refineState}
		size={size}
		onOpen={onOpen}
		onSubmit={onSubmit}
	/>
);
