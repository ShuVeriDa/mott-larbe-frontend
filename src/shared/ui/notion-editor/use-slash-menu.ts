"use client";

import {
	useEffect,
	useImperativeHandle,
	useState,
	type ComponentProps,
	type Ref,
} from "react";
import type { SlashMenuHandle, SlashMenuItem } from "./slash-menu";

interface UseSlashMenuParams {
	items: SlashMenuItem[];
	command: (item: SlashMenuItem) => void;
	ref?: Ref<SlashMenuHandle>;
}

export const useSlashMenu = ({ items, command, ref }: UseSlashMenuParams) => {
	const [selectedIndex, setSelectedIndex] = useState(0);

	useEffect(() => {
		// Reset selection when slash suggestions change.
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setSelectedIndex(0);
	}, [items]);

	useImperativeHandle(ref, () => ({
		onKeyDown({ event }) {
			if (event.key === "ArrowUp") {
				setSelectedIndex((index) => (index - 1 + items.length) % items.length);
				return true;
			}
			if (event.key === "ArrowDown") {
				setSelectedIndex((index) => (index + 1) % items.length);
				return true;
			}
			if (event.key === "Enter") {
				if (items[selectedIndex]) {
					command(items[selectedIndex]);
				}
				return true;
			}
			return false;
		},
	}));

	const handleItemMouseDown: NonNullable<
		ComponentProps<"button">["onMouseDown"]
	> = (event) => {
		event.preventDefault();
		const index = Number(event.currentTarget.dataset.index);
		if (Number.isNaN(index) || !items[index]) return;
		command(items[index]);
	};

	return {
		selectedIndex,
		handleItemMouseDown,
	};
};
