import { useQuery } from "@tanstack/react-query";
import { formatHijriDate, hijriDateQueryOptions } from "@/entities/hijri-calendar";
import { useI18n } from "@/shared/lib/i18n";
import { formatChechenDate } from "@/shared/lib/chechen-calendar";

export const useGreetingIntro = () => {
	const { t } = useI18n();
	const today = new Date();
	const chechenDate = formatChechenDate(today);

	const { data: hijri } = useQuery(hijriDateQueryOptions(today));
	const hijriDate = hijri ? formatHijriDate(hijri, t) : null;

	return { chechenDate, hijriDate };
};
