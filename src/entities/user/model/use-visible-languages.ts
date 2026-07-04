"use client";

import { useFeatureFlag } from "@/shared/lib/feature-flags";
import { ENABLED_LANGUAGES, type LanguageConfig } from "@/shared/lib/languages";
import { useCurrentUser } from "./use-current-user";

// Dot notation required — matches the backend's key format validation
// (CreateFeatureFlagDto.key: @Matches /^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$/).
const ARABIC_LANGUAGE_FLAG_KEY = "functional.arabic_language";

/**
 * Statically enabled languages, plus AR if the current user has been granted
 * the "functional.arabic_language" feature flag override. AR stays fully absent
 * (not a disabled option) when the flag is off, per the gated-rollout requirement.
 */
export const useVisibleLanguages = (): readonly LanguageConfig[] => {
	const { data: user } = useCurrentUser();
	const isAuthenticated = !!user;
	const hasArabicAccess = useFeatureFlag(ARABIC_LANGUAGE_FLAG_KEY, isAuthenticated);

	if (!hasArabicAccess) return ENABLED_LANGUAGES;
	return [...ENABLED_LANGUAGES, { code: "AR", enabled: true }];
};
