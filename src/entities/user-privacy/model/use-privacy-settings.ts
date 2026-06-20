"use client";

import { useQuery } from "@tanstack/react-query";
import { myPrivacyQueryOptions } from "./queries";

export const usePrivacySettings = () => useQuery(myPrivacyQueryOptions());
