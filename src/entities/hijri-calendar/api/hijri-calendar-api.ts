import { http } from "@/shared/api";
import type { HijriDate } from "./types";

const formatGregorianForBackend = (date: Date): string => {
	const day = String(date.getDate()).padStart(2, "0");
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const year = date.getFullYear();
	return `${day}-${month}-${year}`;
};

export const hijriCalendarApi = {
	getHijriDate: (date: Date) =>
		http
			.get<HijriDate>("/hijri-calendar", {
				params: { date: formatGregorianForBackend(date) },
			})
			.then((r) => r.data),
};
