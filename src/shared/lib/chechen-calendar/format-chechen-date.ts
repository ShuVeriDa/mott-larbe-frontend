import { CHECHEN_MONTHS, CHECHEN_WEEKDAYS } from "./chechen-calendar-data";
import { getDayOrdinalSuffix } from "./get-day-ordinal-suffix";

/** "Кхаари-де ду, 2026-гӀачу шеран Мангалан беттан 1-ра де" */
export const formatChechenDate = (date: Date): string => {
	const weekday = CHECHEN_WEEKDAYS[date.getDay()];
	const month = CHECHEN_MONTHS[date.getMonth()];
	const year = date.getFullYear();
	const day = date.getDate();
	const ordinalSuffix = getDayOrdinalSuffix(day);

	return `${weekday} ду, ${year}-гӀачу шеран ${month} беттан ${day}${ordinalSuffix} де`;
};
