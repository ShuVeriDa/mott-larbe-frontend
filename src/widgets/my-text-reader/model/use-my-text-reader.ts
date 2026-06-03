"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useI18n } from "@/shared/lib/i18n";
import { userTextDetailQueryOptions } from "@/entities/user-text";

export const useMyTextReader = (id: string) => {
  const { t } = useI18n();

  // useSuspenseQuery: parent must guard id is non-empty before rendering this hook
  const { data: userText } = useSuspenseQuery(userTextDetailQueryOptions(id));

  return { t, userText };
};
