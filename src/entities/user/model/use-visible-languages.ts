"use client";

import { useFeatureFlag } from "@/shared/lib/feature-flags";
import {
	ENABLED_LANGUAGES,
	type AppLanguage,
	type LanguageConfig,
} from "@/shared/lib/languages";
import { useCurrentUser } from "./use-current-user";

// Dot notation required — matches the backend's key format validation
// (CreateFeatureFlagDto.key: @Matches /^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$/).
// This is the single place mapping a gated language to its feature flag key —
// keep entities/user and the backend's GATED_LANGUAGE_FLAGS in sync manually.
const GATED_LANGUAGES: readonly { code: AppLanguage; flagKey: string }[] = [
	{ code: "AR", flagKey: "functional.arabic_language" },
	{ code: "EN", flagKey: "functional.english_language" },
];

/**
 * Statically enabled languages, plus any gated language the current user has
 * been granted access to via its feature flag override. A gated language
 * stays fully absent (not a disabled option) when its flag is off, per the
 * gated-rollout requirement.
 */
export const useVisibleLanguages = (): readonly LanguageConfig[] => {
	const { data: user } = useCurrentUser();
	const isAuthenticated = !!user;
	// Rules of Hooks forbid calling useFeatureFlag inside a .map() over
	// GATED_LANGUAGES — that would vary the number of hook calls across
	// renders if the list ever changed length. GATED_LANGUAGES is a
	// compile-time-fixed array (not sourced from an API/config), so each
	// entry gets its own explicit, unconditional hook call here; only the
	// resulting booleans are combined into a list afterwards.
	const hasArabicAccess = useFeatureFlag(GATED_LANGUAGES[0].flagKey, isAuthenticated);
	const hasEnglishAccess = useFeatureFlag(GATED_LANGUAGES[1].flagKey, isAuthenticated);
	const accessByIndex = [hasArabicAccess, hasEnglishAccess];

	const extra = GATED_LANGUAGES.filter((_, index) => accessByIndex[index]).map(
		(g) => ({ code: g.code, enabled: true }),
	);
	return [...ENABLED_LANGUAGES, ...extra];
};
