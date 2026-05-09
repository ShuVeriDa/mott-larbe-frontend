"use client";

import { type ComponentProps, useEffect, useState } from "react";
import type {
	CreateFeatureFlagDto,
	FeatureFlagCategory,
	FeatureFlagEnvironment,
	FeatureFlagItem,
	UpdateFeatureFlagDto,
} from "@/entities/feature-flag";

const categories: FeatureFlagCategory[] = [
	"FUNCTIONAL",
	"EXPERIMENTS",
	"TECHNICAL",
	"MONETIZATION",
];

const environmentsList: FeatureFlagEnvironment[] = ["PROD", "STAGE", "DEV"];
const defaultEnvironments: FeatureFlagEnvironment[] = ["PROD", "STAGE", "DEV"];

interface UseFeatureFlagModalParams {
	open: boolean;
	editFlag?: FeatureFlagItem | null;
	onSubmit: (dto: CreateFeatureFlagDto | UpdateFeatureFlagDto) => void;
	onClose: () => void;
	t: (key: string) => string;
}

export const useFeatureFlagModal = ({
	open,
	editFlag,
	onSubmit,
	onClose,
	t,
}: UseFeatureFlagModalParams) => {
	const isEdit = Boolean(editFlag);

	const [key, setKey] = useState("");
	const [description, setDescription] = useState("");
	const [category, setCategory] = useState<FeatureFlagCategory>("FUNCTIONAL");
	const [environments, setEnvironments] =
		useState<FeatureFlagEnvironment[]>(defaultEnvironments);
	const [rolloutPercent, setRolloutPercent] = useState(100);
	const [isEnabled, setIsEnabled] = useState(false);
	const [keyError, setKeyError] = useState("");

	useEffect(() => {
		if (!open) return;
		if (editFlag) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setKey(editFlag.key);
			setDescription(editFlag.description ?? "");
			setCategory(editFlag.category);
			setEnvironments(editFlag.environments);
			setRolloutPercent(editFlag.rolloutPercent);
			setIsEnabled(editFlag.isEnabled);
		} else {
			setKey("");
			setDescription("");
			setCategory("FUNCTIONAL");
			setEnvironments(defaultEnvironments);
			setRolloutPercent(100);
			setIsEnabled(false);
		}
		setKeyError("");
	}, [open, editFlag]);

	const toggleEnvironment = (environment: FeatureFlagEnvironment) => {
		setEnvironments((prev) =>
			prev.includes(environment)
				? prev.filter((current) => current !== environment)
				: [...prev, environment],
		);
	};

	const handleSubmit = () => {
		const keyPattern = /^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$/;
		if (!keyPattern.test(key)) {
			setKeyError(t("admin.featureFlags.modal.keyHint"));
			return;
		}
		if (environments.length === 0) return;

		const dto: CreateFeatureFlagDto = {
			key,
			description: description.trim() || undefined,
			isEnabled,
			category,
			environments,
			rolloutPercent,
		};
		onSubmit(dto);
	};

	const handleBackdropClick: NonNullable<ComponentProps<"div">["onClick"]> = (
		event,
	) => {
		if (event.target === event.currentTarget) {
			onClose();
		}
	};
	const handleKeyChange: NonNullable<ComponentProps<"input">["onChange"]> = (
		event,
	) => {
		setKey(event.currentTarget.value);
		setKeyError("");
	};
	const handleDescriptionChange: NonNullable<
		ComponentProps<"textarea">["onChange"]
	> = (event) => setDescription(event.currentTarget.value);
	const handleCategoryChange: NonNullable<
		ComponentProps<"select">["onChange"]
	> = (event) => setCategory(event.currentTarget.value as FeatureFlagCategory);
	const handleRolloutPercentChange: NonNullable<
		ComponentProps<"input">["onChange"]
	> = (event) =>
		setRolloutPercent(Math.max(0, Math.min(100, Number(event.currentTarget.value))));
	const handleEnvironmentClick: NonNullable<
		ComponentProps<"button">["onClick"]
	> = (event) => {
		const environment = event.currentTarget.dataset.environment as
			| FeatureFlagEnvironment
			| undefined;
		if (!environment) return;
		toggleEnvironment(environment);
	};

	return {
		categories,
		environmentsList,
		defaultEnvironments,
		isEdit,
		key,
		description,
		category,
		environments,
		rolloutPercent,
		isEnabled,
		keyError,
		setIsEnabled,
		handleSubmit,
		handleBackdropClick,
		handleKeyChange,
		handleDescriptionChange,
		handleCategoryChange,
		handleRolloutPercentChange,
		handleEnvironmentClick,
	};
};
