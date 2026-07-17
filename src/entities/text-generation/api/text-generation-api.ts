import { http } from "@/shared/api";
import type { GenerateTextDto, GeneratedTextResult } from "../model/types";

export const textGenerationApi = {
	async generate(dto: GenerateTextDto): Promise<GeneratedTextResult> {
		const { data } = await http.post<GeneratedTextResult>("/user-texts/generate", dto);
		return data;
	},
};
