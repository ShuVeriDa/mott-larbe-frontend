"use client";

import { type ComponentProps } from "react";
import {
	FOLDER_COLORS,
	FOLDER_ICON_KEYS,
	type FolderColor,
	type FolderIconKey,
} from "../lib/folder-presets";
import type { FolderFormValue } from "../ui/folder-form";

interface UseFolderFormParams {
	value: FolderFormValue;
	onChange: (next: FolderFormValue) => void;
}

export const useFolderForm = ({ value, onChange }: UseFolderFormParams) => {
	const update = (patch: Partial<FolderFormValue>) => {
		const next = { ...value, ...patch };
		onChange(next);
	};

	const handleNameChange: NonNullable<ComponentProps<"input">["onChange"]> = (
		event,
	) => {
		update({ name: event.currentTarget.value });
	};

	const handleDescriptionChange: NonNullable<
		ComponentProps<"textarea">["onChange"]
	> = (event) => {
		update({ description: event.currentTarget.value });
	};

	const handleIconClick: NonNullable<ComponentProps<"button">["onClick"]> = (
		event,
	) => {
		const icon = event.currentTarget.dataset.icon;
		if (!icon || !FOLDER_ICON_KEYS.includes(icon as FolderIconKey)) return;
		update({ icon: icon as FolderIconKey });
	};

	const handleColorClick: NonNullable<ComponentProps<"button">["onClick"]> = (
		event,
	) => {
		const color = event.currentTarget.dataset.color;
		if (!color || !(FOLDER_COLORS as readonly string[]).includes(color)) return;
		update({ color: color as FolderColor });
	};

	return {
		internal: value,
		handleNameChange,
		handleDescriptionChange,
		handleIconClick,
		handleColorClick,
	};
};
