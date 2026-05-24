"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import type {
	AnalyticsRange,
	AnalyticsRangeError,
	AnalyticsRangePreset,
	AnalyticsRangeState,
} from "../../types";

const DAY_MS = 24 * 60 * 60 * 1000;

const toIso = (date: Date): string => date.toISOString().slice(0, 10);

const isoNow = (): string => toIso(new Date());

const isoDaysAgo = (days: number): string =>
	toIso(new Date(Date.now() - days * DAY_MS));

const computeRange = (preset: AnalyticsRangePreset): AnalyticsRange => {
	switch (preset) {
		case "today":
			return { from: isoNow(), to: isoNow() };
		case "7d":
			return { from: isoDaysAgo(6), to: isoNow() };
		case "30d":
			return { from: isoDaysAgo(29), to: isoNow() };
		case "90d":
			return { from: isoDaysAgo(89), to: isoNow() };
		case "custom":
			return { from: isoDaysAgo(29), to: isoNow() };
	}
};

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const isValidIsoDate = (value: string | null): value is string =>
	!!value && ISO_DATE_RE.test(value);

const detectPreset = (
	from: string | null,
	to: string | null,
): AnalyticsRangePreset | null => {
	if (!isValidIsoDate(from) || !isValidIsoDate(to)) return null;
	if (from === isoNow() && to === isoNow()) return "today";
	if (from === isoDaysAgo(6) && to === isoNow()) return "7d";
	if (from === isoDaysAgo(29) && to === isoNow()) return "30d";
	if (from === isoDaysAgo(89) && to === isoNow()) return "90d";
	return "custom";
};

const validate = (range: AnalyticsRange): AnalyticsRangeError => {
	if (!isValidIsoDate(range.from) || !isValidIsoDate(range.to)) return null;
	if (range.from > range.to) return "fromAfterTo";
	return null;
};

interface UseAnalyticsRangeOptions {
	defaultPreset?: AnalyticsRangePreset;
	syncWithUrl?: boolean;
}

export const useAnalyticsRange = (
	options: UseAnalyticsRangeOptions = {},
): AnalyticsRangeState => {
	const { defaultPreset = "30d", syncWithUrl = true } = options;
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const urlFrom = searchParams.get("from");
	const urlTo = searchParams.get("to");
	const urlPreset = detectPreset(urlFrom, urlTo);

	const initial = useMemo<{ preset: AnalyticsRangePreset; range: AnalyticsRange }>(
		() => {
			if (syncWithUrl && urlPreset) {
				return {
					preset: urlPreset,
					range: { from: urlFrom as string, to: urlTo as string },
				};
			}
			return { preset: defaultPreset, range: computeRange(defaultPreset) };
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[],
	);

	const [preset, setPresetState] = useState<AnalyticsRangePreset>(initial.preset);
	const [range, setRange] = useState<AnalyticsRange>(initial.range);

	const writeUrl = useCallback(
		(next: AnalyticsRange) => {
			if (!syncWithUrl) return;
			const params = new URLSearchParams(searchParams.toString());
			params.set("from", next.from);
			params.set("to", next.to);
			router.replace(`${pathname}?${params.toString()}`, { scroll: false });
		},
		[pathname, router, searchParams, syncWithUrl],
	);

	const setPreset = useCallback(
		(next: AnalyticsRangePreset) => {
			setPresetState(next);
			if (next !== "custom") {
				const r = computeRange(next);
				setRange(r);
				writeUrl(r);
			}
		},
		[writeUrl],
	);

	const setCustomRange = useCallback(
		(patch: Partial<AnalyticsRange>) => {
			setPresetState("custom");
			setRange((prev) => {
				const next = { ...prev, ...patch };
				if (validate(next) === null) writeUrl(next);
				return next;
			});
		},
		[writeUrl],
	);

	const error = validate(range);

	return {
		range,
		preset,
		setPreset,
		setCustomRange,
		error,
	};
};
