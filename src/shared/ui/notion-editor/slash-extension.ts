import { Extension } from "@tiptap/core";
import Suggestion from "@tiptap/suggestion";
import type { SuggestionOptions } from "@tiptap/suggestion";

export const SlashExtension = Extension.create<{ suggestion: Partial<SuggestionOptions> }>({
	name: "slash",

	addOptions() {
		return {
			suggestion: {
				char: "/",
				command({ editor, range, props }: { editor: unknown; range: unknown; props: unknown }) {
					(props as { command: (args: unknown) => void }).command({ editor, range });
				},
			},
		};
	},

	addProseMirrorPlugins() {
		return [
			Suggestion({
				editor: this.editor,
				...this.options.suggestion,
			}),
		];
	},
});
