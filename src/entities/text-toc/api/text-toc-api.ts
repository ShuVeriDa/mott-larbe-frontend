import { http } from "@/shared/api";
import type { TocEntry } from "./types";

export const textTocApi = {
  getForText: async (textId: string): Promise<TocEntry[]> => {
    const { data } = await http.get<TocEntry[]>(`/texts/${textId}/toc`);
    return data;
  },
};
