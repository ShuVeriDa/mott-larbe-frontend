"use client";

import { useQuery } from "@tanstack/react-query";
import { spellingDictionaryQueryOptions } from "./queries";

export const useSpellingDictionary = () =>
	useQuery(spellingDictionaryQueryOptions);
