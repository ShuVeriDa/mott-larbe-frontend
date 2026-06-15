const DATE_OPTIONS_SHORT: Intl.DateTimeFormatOptions = {
	day: "numeric",
	month: "short",
	year: "numeric",
};

const DATE_OPTIONS_LONG: Intl.DateTimeFormatOptions = {
	day: "numeric",
	month: "long",
	year: "numeric",
};

const DATE_OPTIONS_COMPACT: Intl.DateTimeFormatOptions = {
	day: "numeric",
	month: "short",
};

const DATETIME_OPTIONS: Intl.DateTimeFormatOptions = {
	day: "numeric",
	month: "short",
	year: "numeric",
	hour: "2-digit",
	minute: "2-digit",
};

const DATETIME_OPTIONS_COMPACT: Intl.DateTimeFormatOptions = {
	day: "numeric",
	month: "short",
	hour: "2-digit",
	minute: "2-digit",
};

/** "12 янв. 2024" */
export const formatDate = (iso: string | null | undefined, fallback = "—"): string => {
	if (!iso) return fallback;
	return new Date(iso).toLocaleDateString("ru-RU", DATE_OPTIONS_SHORT);
};

/** "12 января 2024" */
export const formatDateLong = (iso: string | null | undefined, fallback = "—"): string => {
	if (!iso) return fallback;
	return new Date(iso).toLocaleDateString("ru-RU", DATE_OPTIONS_LONG);
};

/** "12 янв." (without year — for compact charts/lists) */
export const formatDateCompact = (iso: string | null | undefined, fallback = "—"): string => {
	if (!iso) return fallback;
	return new Date(iso).toLocaleDateString("ru-RU", DATE_OPTIONS_COMPACT);
};

/** "12 янв. 2024, 14:30" */
export const formatDateTime = (iso: string | null | undefined, fallback = "—"): string => {
	if (!iso) return fallback;
	return new Date(iso).toLocaleString("ru-RU", DATETIME_OPTIONS);
};

/** "12 янв., 14:30" (without year — for compact tables) */
export const formatDateTimeCompact = (iso: string | null | undefined, fallback = "—"): string => {
	if (!iso) return fallback;
	return new Date(iso).toLocaleString("ru-RU", DATETIME_OPTIONS_COMPACT);
};
