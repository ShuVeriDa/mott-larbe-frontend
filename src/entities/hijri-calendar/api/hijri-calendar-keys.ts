const toDateKey = (date: Date): string =>
	`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

export const hijriCalendarKeys = {
	all: ["entities", "hijriCalendar"] as const,
	byDate: (date: Date) => [...hijriCalendarKeys.all, toDateKey(date)] as const,
};
