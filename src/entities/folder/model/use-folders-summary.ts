"use client";

import { useQuery } from "@tanstack/react-query";
import { folderApi, folderKeys } from "../api";

export const useFoldersSummary = () =>
	useQuery({
		queryKey: folderKeys.summary(),
		queryFn: () => folderApi.summary(),
	});
