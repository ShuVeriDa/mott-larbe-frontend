import { getDayOrdinalSuffix } from "@/shared/lib/chechen-calendar";
import type { HijriDate } from "../api/types";

type TranslateFn = (key: string, vars?: Record<string, string | number>) => string;

/**
 * RU/EN: "26 Мухаррам 1448 года хиджры"
 * CHE:   "1448-гӀачу шеран Мухьаррам беттан 26-гӀа де" (daySuffix only used by che.json's template)
 */
export const formatHijriDate = (hijri: HijriDate, t: TranslateFn): string => {
	const day = Number(hijri.day);
	const month = t(`dashboard.greeting.hijriMonths.${hijri.month.number}`);

	return t("dashboard.greeting.hijriDate", {
		day,
		daySuffix: getDayOrdinalSuffix(day),
		month,
		year: hijri.year,
	});
};
