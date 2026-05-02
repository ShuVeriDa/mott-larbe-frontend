"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminTextApi } from "../api/admin-text-api";
import { adminTextKeys } from "../api/admin-text-keys";

export const useAdminTextMutations = () => {
	const qc = useQueryClient();
	const invalidate = () => qc.invalidateQueries({ queryKey: adminTextKeys.root });

	const publish = useMutation({
		mutationFn: adminTextApi.publish,
		onSuccess: invalidate,
	});

	const unpublish = useMutation({
		mutationFn: adminTextApi.unpublish,
		onSuccess: invalidate,
	});

	const tokenize = useMutation({
		mutationFn: adminTextApi.tokenize,
		onSuccess: invalidate,
	});

	const remove = useMutation({
		mutationFn: adminTextApi.remove,
		onSuccess: invalidate,
	});

	const bulkPublish = useMutation({
		mutationFn: adminTextApi.bulkPublish,
		onSuccess: invalidate,
	});

	const bulkUnpublish = useMutation({
		mutationFn: adminTextApi.bulkUnpublish,
		onSuccess: invalidate,
	});

	const bulkTokenize = useMutation({
		mutationFn: adminTextApi.bulkTokenize,
		onSuccess: invalidate,
	});

	const bulkDelete = useMutation({
		mutationFn: adminTextApi.bulkDelete,
		onSuccess: invalidate,
	});

	return {
		publish,
		unpublish,
		tokenize,
		remove,
		bulkPublish,
		bulkUnpublish,
		bulkTokenize,
		bulkDelete,
	};
};
