"use client";

import { useActionState, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
	heritageApi,
	heritageKeys,
	myHeritageQueryOptions,
	nationsQueryOptions,
	taipsByNationQueryOptions,
	taipsByTukhumQueryOptions,
	tukhumQueryOptions,
	useHeritageFormStore,
	type Nation,
} from "@/entities/heritage";
import { useToast } from "@/shared/lib/toast";
import { useI18n } from "@/shared/lib/i18n";
import { useApiErrorToast } from "@/shared/lib/api-error-toast";
import type { HeritageFormState, HeritageFormValues, NationMode } from "./types";

const NAKHCHIY_SLUG = "nakhchiy";

const stripHtml = (value: string): string =>
	value.replace(/<[^>]*>/g, "").trim();

const sanitizeCustomField = (value: string, maxLen: number): string =>
	stripHtml(value).slice(0, maxLen);

export const useHeritageForm = () => {
	const { t } = useI18n();
	const { success: toastSuccess } = useToast();
	const { toastApiError } = useApiErrorToast();
	const queryClient = useQueryClient();

	const {
		selectedNationSlug,
		selectedTukhumId,
		hasTukhum,
		selectedTaipId,
		showAllTaips,
		setSelectedNationSlug,
		setSelectedTukhumId,
		setHasTukhum,
		setSelectedTaipId,
		setShowAllTaips,
	} = useHeritageFormStore();

	const [selectedGaraId, setSelectedGaraId] = useState<string | null>(null);
	const [nekyi, setNekyi] = useState<string>("");
	const [otherNationId, setOtherNationId] = useState<string | null>(null);

	// Queries
	const { data: nationsData } = useQuery(nationsQueryOptions());
	const nations = nationsData?.items ?? [];
	const nakhchiyNation = nations.find((n: Nation) => n.slug === NAKHCHIY_SLUG);
	const otherNations = nations.filter((n: Nation) => n.slug !== NAKHCHIY_SLUG);

	const nationMode: NationMode = selectedNationSlug === NAKHCHIY_SLUG
		? "nakhchiy"
		: selectedNationSlug !== null
		? "other"
		: null;

	const { data: tukhumData } = useQuery({
		...tukhumQueryOptions(nakhchiyNation?.id ?? ""),
		enabled: nationMode === "nakhchiy" && !!nakhchiyNation?.id,
	});
	const tukhumy = tukhumData?.items ?? [];

	const { data: taipsByTukhumData } = useQuery({
		...taipsByTukhumQueryOptions(selectedTukhumId ?? ""),
		enabled: !!selectedTukhumId && !showAllTaips,
	});

	const { data: taipsByNationData } = useQuery({
		...taipsByNationQueryOptions(nakhchiyNation?.id ?? ""),
		enabled: nationMode === "nakhchiy" && (showAllTaips || hasTukhum === false) && !!nakhchiyNation?.id,
	});

	const taips = showAllTaips || hasTukhum === false
		? (taipsByNationData?.items ?? [])
		: (taipsByTukhumData?.items ?? []);

	// Current heritage data (for initial values)
	const { data: currentHeritage } = useQuery(myHeritageQueryOptions());

	// Submit action
	const submitAction = async (
		_prev: HeritageFormState,
		formData: FormData,
	): Promise<HeritageFormState> => {
		const taipCustomRaw = formData.get("taipCustom") as string | null;
		const garaCustomRaw = formData.get("garaCustom") as string | null;
		const nekyiRaw = formData.get("nekyi") as string | null;

		const selectedOtherNation = nationMode === "other"
			? nations.find((n: Nation) => n.id === otherNationId) ?? null
			: null;

		const dto: HeritageFormValues = {
			nationId: nakhchiyNation?.id && nationMode === "nakhchiy"
				? nakhchiyNation.id
				: otherNationId,
			tukhumId: selectedTukhumId,
			hasTukhum,
			taipId: selectedTaipId,
			taipCustom: taipCustomRaw ? sanitizeCustomField(taipCustomRaw, 100) : null,
			garaId: selectedGaraId,
			garaCustom: garaCustomRaw ? sanitizeCustomField(garaCustomRaw, 100) : null,
			nekyi: nekyiRaw ? sanitizeCustomField(nekyiRaw, 200) : null,
			otherNationName: selectedOtherNation?.name?.ru ?? null,
		};

		try {
			await heritageApi.upsertMyHeritage(dto);
			await queryClient.invalidateQueries({ queryKey: heritageKeys.myHeritage() });
			toastSuccess(t("profile.toasts.saved"));
			return { success: true, error: null };
		} catch (err) {
			toastApiError(err);
			return { success: false, error: t("profile.toasts.error") };
		}
	};

	const [state, formAction, isPending] = useActionState<HeritageFormState, FormData>(
		submitAction,
		{ success: false, error: null },
	);

	const handleNationSelect = (slug: string | null) => {
		setSelectedNationSlug(slug);
		setOtherNationId(null);
		setSelectedGaraId(null);
		setNekyi("");
	};

	const handleTukhumSelect = (tukhumId: string | null) => {
		setSelectedTukhumId(tukhumId);
		setSelectedGaraId(null);
	};

	const handleHasTukhumChange = (value: boolean) => {
		setHasTukhum(value);
		setSelectedGaraId(null);
	};

	const handleTaipSelect = (taipId: string | null) => {
		setSelectedTaipId(taipId);
		setSelectedGaraId(null);
	};

	const handleShowAllTaipsToggle = () => {
		setShowAllTaips(!showAllTaips);
		setSelectedTaipId(null);
		setSelectedGaraId(null);
	};

	const handleGaraSelect = (garaId: string | null) => setSelectedGaraId(garaId);
	const handleNekyiChange = (value: string) => setNekyi(value);
	const handleOtherNationSelect = (nationId: string | null) => setOtherNationId(nationId);

	return {
		// State
		nationMode,
		selectedNationSlug,
		selectedTukhumId,
		hasTukhum,
		selectedTaipId,
		selectedGaraId,
		showAllTaips,
		nekyi,
		otherNationId,

		// Data
		nations,
		nakhchiyNation,
		otherNations,
		tukhumy,
		taips,
		currentHeritage,

		// Form
		state,
		formAction,
		isPending,

		// Handlers
		handleNationSelect,
		handleTukhumSelect,
		handleHasTukhumChange,
		handleTaipSelect,
		handleShowAllTaipsToggle,
		handleGaraSelect,
		handleNekyiChange,
		handleOtherNationSelect,
	};
};
