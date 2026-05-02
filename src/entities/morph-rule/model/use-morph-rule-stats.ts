import { useQuery } from "@tanstack/react-query";
import { morphRuleApi, morphRuleKeys } from "../api";

export const useMorphRuleStats = () =>
  useQuery({
    queryKey: morphRuleKeys.stats(),
    queryFn: morphRuleApi.stats,
  });
