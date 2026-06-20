"use client";

import {
	heritageApi,
	heritageKeys,
	nationsQueryOptions,
	tukhumQueryOptions,
	taipsByNationQueryOptions,
	garasByTaipQueryOptions,
	type Gara,
	type Nation,
	type Taip,
	type Tukhum,
} from "@/entities/heritage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import type { HeritageTab } from "./types";

export const useAdminHeritagePage = () => {
	const queryClient = useQueryClient();
	const [activeTab, setActiveTab] = useState<HeritageTab>("nations");

	const [nationModal, setNationModal] = useState<{ open: boolean; item: Nation | null }>({ open: false, item: null });
	const [tukhumModal, setTukhumModal] = useState<{ open: boolean; item: Tukhum | null }>({ open: false, item: null });
	const [taipModal, setTaipModal] = useState<{ open: boolean; item: Taip | null }>({ open: false, item: null });
	const [garaModal, setGaraModal] = useState<{ open: boolean; item: Gara | null }>({ open: false, item: null });

	const [selectedNationId, setSelectedNationId] = useState<string>("");
	const [selectedTaipId, setSelectedTaipId] = useState<string>("");

	const nationsQuery = useQuery(nationsQueryOptions());
	const tukhumQuery = useQuery({ ...tukhumQueryOptions(selectedNationId), enabled: !!selectedNationId });
	const taipsQuery = useQuery({ ...taipsByNationQueryOptions(selectedNationId), enabled: !!selectedNationId });
	const garasQuery = useQuery({ ...garasByTaipQueryOptions(selectedTaipId), enabled: !!selectedTaipId });

	const nations = nationsQuery.data?.data ?? [];
	const tukhumy = tukhumQuery.data?.data ?? [];
	const taips = taipsQuery.data?.data ?? [];
	const garas = garasQuery.data?.data ?? [];

	const invalidateNations = () => queryClient.invalidateQueries({ queryKey: heritageKeys.nations() });
	const invalidateTukhumy = () => queryClient.invalidateQueries({ queryKey: heritageKeys.tukhumy() });
	const invalidateTaips = () => queryClient.invalidateQueries({ queryKey: heritageKeys.taips() });
	const invalidateGaras = () => queryClient.invalidateQueries({ queryKey: heritageKeys.garas() });

	const createNationMutation = useMutation({
		mutationFn: heritageApi.createNation,
		onSuccess: () => { invalidateNations(); setNationModal({ open: false, item: null }); },
	});

	const updateNationMutation = useMutation({
		mutationFn: ({ id, ...dto }: { id: string } & Parameters<typeof heritageApi.updateNation>[1]) =>
			heritageApi.updateNation(id, dto),
		onSuccess: () => { invalidateNations(); setNationModal({ open: false, item: null }); },
	});

	const deleteNationMutation = useMutation({
		mutationFn: heritageApi.deleteNation,
		onSuccess: invalidateNations,
	});

	const createTukhumMutation = useMutation({
		mutationFn: heritageApi.createTukhum,
		onSuccess: () => { invalidateTukhumy(); setTukhumModal({ open: false, item: null }); },
	});

	const updateTukhumMutation = useMutation({
		mutationFn: ({ id, ...dto }: { id: string } & Parameters<typeof heritageApi.updateTukhum>[1]) =>
			heritageApi.updateTukhum(id, dto),
		onSuccess: () => { invalidateTukhumy(); setTukhumModal({ open: false, item: null }); },
	});

	const deleteTukhumMutation = useMutation({
		mutationFn: heritageApi.deleteTukhum,
		onSuccess: invalidateTukhumy,
	});

	const createTaipMutation = useMutation({
		mutationFn: heritageApi.createTaip,
		onSuccess: () => { invalidateTaips(); setTaipModal({ open: false, item: null }); },
	});

	const updateTaipMutation = useMutation({
		mutationFn: ({ id, ...dto }: { id: string } & Parameters<typeof heritageApi.updateTaip>[1]) =>
			heritageApi.updateTaip(id, dto),
		onSuccess: () => { invalidateTaips(); setTaipModal({ open: false, item: null }); },
	});

	const deleteTaipMutation = useMutation({
		mutationFn: heritageApi.deleteTaip,
		onSuccess: invalidateTaips,
	});

	const createGaraMutation = useMutation({
		mutationFn: heritageApi.createGara,
		onSuccess: () => { invalidateGaras(); setGaraModal({ open: false, item: null }); },
	});

	const updateGaraMutation = useMutation({
		mutationFn: ({ id, ...dto }: { id: string } & Parameters<typeof heritageApi.updateGara>[1]) =>
			heritageApi.updateGara(id, dto),
		onSuccess: () => { invalidateGaras(); setGaraModal({ open: false, item: null }); },
	});

	const deleteGaraMutation = useMutation({
		mutationFn: heritageApi.deleteGara,
		onSuccess: invalidateGaras,
	});

	return {
		activeTab,
		setActiveTab,
		selectedNationId,
		setSelectedNationId,
		selectedTaipId,
		setSelectedTaipId,
		nations,
		tukhumy,
		taips,
		garas,
		nationsQuery,
		tukhumQuery,
		taipsQuery,
		garasQuery,
		nationModal,
		tukhumModal,
		taipModal,
		garaModal,
		setNationModal,
		setTukhumModal,
		setTaipModal,
		setGaraModal,
		createNationMutation,
		updateNationMutation,
		deleteNationMutation,
		createTukhumMutation,
		updateTukhumMutation,
		deleteTukhumMutation,
		createTaipMutation,
		updateTaipMutation,
		deleteTaipMutation,
		createGaraMutation,
		updateGaraMutation,
		deleteGaraMutation,
	};
};
