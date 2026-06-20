"use client";

import { useState } from "react";

export const useCustomTaip = () => {
	const [isCustomMode, setIsCustomMode] = useState(false);
	const [customValue, setCustomValue] = useState("");

	const handleToggleCustomMode = () => {
		setIsCustomMode((prev) => !prev);
		setCustomValue("");
	};

	const handleCustomValueChange = (value: string) => {
		setCustomValue(value.slice(0, 100));
	};

	const handleReset = () => {
		setIsCustomMode(false);
		setCustomValue("");
	};

	return {
		isCustomMode,
		customValue,
		handleToggleCustomMode,
		handleCustomValueChange,
		handleReset,
	};
};
