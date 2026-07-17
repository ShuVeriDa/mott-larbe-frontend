"use client";

import { useMutation } from "@tanstack/react-query";
import { textGenerationApi } from "../api/text-generation-api";

export const useGenerateText = () =>
	useMutation({
		mutationFn: textGenerationApi.generate,
		retry: 0,
	});
