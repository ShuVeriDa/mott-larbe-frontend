import type { FetchMorphRulesQuery } from "./types";

export const morphRuleKeys = {
  root: ["admin", "morphology"] as const,
  stats: () => [...morphRuleKeys.root, "stats"] as const,
  list: (query?: FetchMorphRulesQuery) =>
    [...morphRuleKeys.root, "rules", query] as const,
};
