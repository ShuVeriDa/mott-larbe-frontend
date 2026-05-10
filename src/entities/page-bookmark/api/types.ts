export interface PageBookmark {
  id: string;
  textId: string;
  pageNumber: number;
  snippet: string;
  createdAt: string;
}

export interface TogglePageBookmarkDto {
  textId: string;
  pageNumber: number;
  snippet: string;
}

export interface TogglePageBookmarkResponse {
  bookmarked: boolean;
  pageNumber: number;
}
