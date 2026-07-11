import { queryOptions } from "@tanstack/react-query";
import { hijriCalendarApi } from "../api/hijri-calendar-api";
import { hijriCalendarKeys } from "../api/hijri-calendar-keys";

const STALE_TIME = 1000 * 60 * 60 * 12; // 12 hours — Hijri date for a given day never changes

export const hijriDateQueryOptions = (date: Date) =>
	queryOptions({
		queryKey: hijriCalendarKeys.byDate(date),
		queryFn: () => hijriCalendarApi.getHijriDate(date),
		staleTime: STALE_TIME,
	});
