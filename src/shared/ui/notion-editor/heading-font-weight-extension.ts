import { Extension } from "@tiptap/core";

declare module "@tiptap/core" {
	interface Commands<ReturnType> {
		headingFontWeight: {
			setHeadingFontWeight: (weight: string | null) => ReturnType;
		};
	}
}

export const HeadingFontWeightExtension = Extension.create({
	name: "headingFontWeight",

	addGlobalAttributes() {
		return [
			{
				types: ["heading"],
				attributes: {
					fontWeight: {
						default: null,
						parseHTML: el => el.style.fontWeight || null,
						renderHTML: attrs => {
							if (!attrs.fontWeight) return {};
							return { style: `font-weight: ${attrs.fontWeight}` };
						},
					},
				},
			},
		];
	},

	addCommands() {
		return {
			setHeadingFontWeight:
				(weight: string | null) =>
				({ commands }) => {
					return commands.updateAttributes("heading", { fontWeight: weight });
				},
		};
	},
});
