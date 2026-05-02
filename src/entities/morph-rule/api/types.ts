export type MorphRuleType =
  | "NOUN_CASE"
  | "PLURAL"
  | "VERB_PAST"
  | "SUFFIX"
  | "ENDING"
  | "PREFIX"
  | "REGEX";

export type MorphLanguage = "CHE" | "RU";

export type MorphRuleStatus = "all" | "active" | "inactive" | "regex";

export type MorphRuleSortBy = "suffix" | "priority" | "matchCount";

export type SortOrder = "asc" | "desc";

export interface MorphRule {
  id: string;
  suffix: string;
  add: string | null;
  pos: string | null;
  description: string | null;
  isRegex: boolean;
  type: MorphRuleType;
  language: MorphLanguage;
  priority: number;
  isActive: boolean;
  matchCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface MorphRuleStats {
  total: number;
  active: number;
  inactive: number;
  regexCount: number;
  totalMatches: number;
  coveragePct: number;
}

export interface MorphRuleListResponse {
  items: MorphRule[];
  total: number;
  page: number;
  limit: number;
}

export interface FetchMorphRulesQuery {
  q?: string;
  pos?: string;
  type?: MorphRuleType;
  language?: MorphLanguage;
  status?: MorphRuleStatus;
  page?: number;
  limit?: number;
  sortBy?: MorphRuleSortBy;
  sortOrder?: SortOrder;
}

export interface CreateMorphRuleDto {
  suffix: string;
  add?: string;
  pos?: string;
  description?: string;
  isRegex?: boolean;
  type: MorphRuleType;
  language?: MorphLanguage;
  priority?: number;
  isActive?: boolean;
}

export interface UpdateMorphRuleDto {
  suffix?: string;
  add?: string;
  pos?: string;
  description?: string;
  isRegex?: boolean;
  type?: MorphRuleType;
  language?: MorphLanguage;
  priority?: number;
  isActive?: boolean;
}

export interface BulkMorphRulesDto {
  ids: string[];
}

export interface ImportMorphRulesResult {
  created: number;
  updated: number;
  skipped: number;
  total: number;
  errors: string[];
}

export interface AnalyzeWordResult {
  word: string;
  result: unknown;
}
