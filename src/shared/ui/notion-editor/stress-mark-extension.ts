import { Mark } from "@tiptap/core";

declare module "@tiptap/core" {
	interface Commands<ReturnType> {
		stress: {
			toggleStress: () => ReturnType;
		};
	}
}

export const StressMarkExtension = Mark.create({
	name: "stress",

	addCommands() {
		return {
			toggleStress:
				() =>
				({ commands }) =>
					commands.toggleMark(this.name),
		};
	},

	renderHTML() {
		return ["span", { class: "stress-mark" }, 0];
	},

	parseHTML() {
		return [{ tag: "span.stress-mark" }];
	},
});
