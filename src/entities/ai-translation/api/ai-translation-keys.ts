export const aiTranslationKeys = {
  root: ["ai-translation"] as const,
  keyStatus: () => ["ai-translation", "key-status"] as const,
  word: (word: string, context?: string) => ["ai-translation", "word", word, context ?? ""] as const,
  phrase: (phrase: string) => ["ai-translation", "phrase", phrase] as const,
  adminCache: () => ["ai-translation", "admin-cache"] as const,
  adminCacheList: (status?: string, q?: string, page?: number) =>
    ["ai-translation", "admin-cache", "list", status ?? "", q ?? "", page ?? 1] as const,
  adminCacheStats: () => ["ai-translation", "admin-cache", "stats"] as const,
};
