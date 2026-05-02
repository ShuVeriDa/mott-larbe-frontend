import { useQuery } from "@tanstack/react-query";
import { morphRuleApi, morphRuleKeys } from "../api";
import type { FetchMorphRulesQuery } from "../api";

export const useMorphRules = (query: FetchMorphRulesQuery) =>
  useQuery({
    queryKey: morphRuleKeys.list(query),
    queryFn: () => morphRuleApi.list(query),
    placeholderData: (prev) => prev,
  });
