"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminTextApi } from "../api/admin-text-api";
import { adminTextKeys } from "../api/admin-text-keys";

export const useAdminTextBulkImport = () => {
	const qc = useQueryClient();

	return useMutation({
		mutationFn: adminTextApi.bulkImport,
		onSuccess: () => qc.invalidateQueries({ queryKey: adminTextKeys.root }),
	});
};
