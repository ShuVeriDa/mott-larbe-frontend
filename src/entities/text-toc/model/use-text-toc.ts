"use client";

import { useQuery } from "@tanstack/react-query";
import { textTocApi, textTocKeys } from "../api";

export const useTextToc = (textId: string) =>
  useQuery({
    queryKey: textTocKeys.text(textId),
    queryFn: () => textTocApi.getForText(textId),
  });
