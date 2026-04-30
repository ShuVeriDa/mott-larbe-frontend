"use client";

import { useQuery } from "@tanstack/react-query";
import { folderApi, folderKeys } from "../api";

export const useFolders = () =>
	useQuery({
		queryKey: folderKeys.list(),
		queryFn: () => folderApi.list(),
	});
