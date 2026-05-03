import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminDictionaryApi, adminDictionaryKeys } from "../api";
import type {
	CreateAdminExampleDto,
	CreateAdminHeadwordDto,
	CreateAdminMorphFormDto,
	CreateAdminSenseDto,
	PatchAdminEntryDto,
	UpdateAdminExampleDto,
	UpdateAdminMorphFormDto,
	UpdateAdminSenseDto,
} from "../api";

export const useAdminDictionaryMutations = (lemmaId: string) => {
	const qc = useQueryClient();

	const invalidateDetail = () => qc.invalidateQueries({ queryKey: adminDictionaryKeys.detail(lemmaId) });
	const invalidateRelated = () => qc.invalidateQueries({ queryKey: adminDictionaryKeys.relatedLemmas(lemmaId) });

	const updateEntry = useMutation({
		mutationFn: (body: PatchAdminEntryDto) => adminDictionaryApi.update(lemmaId, body),
		onSuccess: invalidateDetail,
	});

	const deleteEntry = useMutation({
		mutationFn: () => adminDictionaryApi.remove(lemmaId),
	});

	const addSense = useMutation({
		mutationFn: (body: CreateAdminSenseDto) => adminDictionaryApi.addSense(lemmaId, body),
		onSuccess: invalidateDetail,
	});

	const updateSense = useMutation({
		mutationFn: ({ senseId, body }: { senseId: string; body: UpdateAdminSenseDto }) =>
			adminDictionaryApi.updateSense(senseId, body),
		onSuccess: invalidateDetail,
	});

	const deleteSense = useMutation({
		mutationFn: (senseId: string) => adminDictionaryApi.deleteSense(senseId),
		onSuccess: invalidateDetail,
	});

	const addExample = useMutation({
		mutationFn: ({ senseId, body }: { senseId: string; body: CreateAdminExampleDto }) =>
			adminDictionaryApi.addExample(senseId, body),
		onSuccess: invalidateDetail,
	});

	const updateExample = useMutation({
		mutationFn: ({ exampleId, body }: { exampleId: string; body: UpdateAdminExampleDto }) =>
			adminDictionaryApi.updateExample(exampleId, body),
		onSuccess: invalidateDetail,
	});

	const deleteExample = useMutation({
		mutationFn: (exampleId: string) => adminDictionaryApi.deleteExample(exampleId),
		onSuccess: invalidateDetail,
	});

	const addHeadword = useMutation({
		mutationFn: (body: CreateAdminHeadwordDto) => adminDictionaryApi.addHeadword(lemmaId, body),
		onSuccess: () => {
			invalidateDetail();
			invalidateRelated();
		},
	});

	const deleteHeadword = useMutation({
		mutationFn: (hwId: string) => adminDictionaryApi.deleteHeadword(hwId),
		onSuccess: invalidateDetail,
	});

	const addForm = useMutation({
		mutationFn: (body: CreateAdminMorphFormDto) => adminDictionaryApi.addForm(lemmaId, body),
		onSuccess: invalidateDetail,
	});

	const updateForm = useMutation({
		mutationFn: ({ formId, body }: { formId: string; body: UpdateAdminMorphFormDto }) =>
			adminDictionaryApi.updateForm(formId, body),
		onSuccess: invalidateDetail,
	});

	const deleteForm = useMutation({
		mutationFn: (formId: string) => adminDictionaryApi.deleteForm(formId),
		onSuccess: invalidateDetail,
	});

	return {
		updateEntry,
		deleteEntry,
		addSense,
		updateSense,
		deleteSense,
		addExample,
		updateExample,
		deleteExample,
		addHeadword,
		deleteHeadword,
		addForm,
		updateForm,
		deleteForm,
	};
};
