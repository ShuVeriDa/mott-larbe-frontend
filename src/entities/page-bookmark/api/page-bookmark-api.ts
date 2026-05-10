import { http } from "@/shared/api";
import type { PageBookmark, TogglePageBookmarkDto, TogglePageBookmarkResponse } from "./types";

export const pageBookmarkApi = {
  getAll: async (textId: string): Promise<PageBookmark[]> => {
    const response = await http.get<PageBookmark[]>("/page-bookmarks", {
      params: { textId },
    });
    return response.data;
  },

  toggle: async (dto: TogglePageBookmarkDto): Promise<TogglePageBookmarkResponse> => {
    const response = await http.post<TogglePageBookmarkResponse>("/page-bookmarks/toggle", dto);
    return response.data;
  },

  remove: async (id: string): Promise<void> => {
    await http.delete(`/page-bookmarks/${id}`);
  },
};
