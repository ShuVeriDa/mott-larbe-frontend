"use client";

import { useState } from "react";
import {
	useAdminDictionaryDetail,
	useAdminDictionaryNavigation,
	useAdminDictionaryRelatedLemmas,
	useAdminDictionaryFrequencyStats,
	useAdminDictionaryUserStats,
	useAdminDictionaryContexts,
	useAdminDictionaryMutations,
} from "@/entities/dictionary";
import type {
	AdminDictSense,
	AdminDictExample,
	AdminDictMorphForm,
} from "@/entities/dictionary";

export type DictModal =
	| { type: "editMeta" }
	| { type: "addSense" }
	| { type: "editSense"; sense: AdminDictSense }
	| { type: "addExample"; senseId: string }
	| { type: "editExample"; example: AdminDictExample }
	| { type: "addForm" }
	| { type: "editForm"; form: AdminDictMorphForm }
	| { type: "addHeadword" }
	| { type: "addLemma" }
	| null;

export const useAdminDictionaryDetailPage = (lemmaId: string) => {
	const [modal, setModal] = useState<DictModal>(null);
	const [showAllForms, setShowAllForms] = useState(false);

	const detail = useAdminDictionaryDetail(lemmaId);
	const nav = useAdminDictionaryNavigation(lemmaId);
	const relatedLemmas = useAdminDictionaryRelatedLemmas(lemmaId);
	const freqStats = useAdminDictionaryFrequencyStats(lemmaId);
	const userStats = useAdminDictionaryUserStats(lemmaId);
	const contexts = useAdminDictionaryContexts(lemmaId);
	const mutations = useAdminDictionaryMutations(lemmaId);

	const openModal = (m: DictModal) => setModal(m);
	const closeModal = () => setModal(null);
	const toggleForms = () => setShowAllForms((v) => !v);

	return {
		detail,
		nav,
		relatedLemmas,
		freqStats,
		userStats,
		contexts,
		mutations,
		modal,
		openModal,
		closeModal,
		showAllForms,
		toggleForms,
		entryId: detail.data?.entryId ?? "",
	};
};
