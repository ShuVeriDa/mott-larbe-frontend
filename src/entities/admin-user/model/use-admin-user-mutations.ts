"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminUserApi } from "../api/admin-user-api";
import { adminUserKeys } from "../api/admin-user-keys";

export const useAdminUserMutations = () => {
	const qc = useQueryClient();
	const invalidate = () =>
		qc.invalidateQueries({ queryKey: adminUserKeys.root });

	const block = useMutation({
		mutationFn: adminUserApi.block,
		onSuccess: invalidate,
	});

	const unblock = useMutation({
		mutationFn: adminUserApi.unblock,
		onSuccess: invalidate,
	});

	const freeze = useMutation({
		mutationFn: adminUserApi.freeze,
		onSuccess: invalidate,
	});

	const unfreeze = useMutation({
		mutationFn: adminUserApi.unfreeze,
		onSuccess: invalidate,
	});

	const remove = useMutation({
		mutationFn: adminUserApi.remove,
		onSuccess: invalidate,
	});

	const bulkFreeze = useMutation({
		mutationFn: adminUserApi.bulkFreeze,
		onSuccess: invalidate,
	});

	const bulkBlock = useMutation({
		mutationFn: adminUserApi.bulkBlock,
		onSuccess: invalidate,
	});

	const bulkResetRoles = useMutation({
		mutationFn: adminUserApi.bulkResetRoles,
		onSuccess: invalidate,
	});

	return {
		block,
		unblock,
		freeze,
		unfreeze,
		remove,
		bulkFreeze,
		bulkBlock,
		bulkResetRoles,
	};
};
