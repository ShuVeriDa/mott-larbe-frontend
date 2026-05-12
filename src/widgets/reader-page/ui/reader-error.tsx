import { useI18n } from "@/shared/lib/i18n";

export const ReaderError = () => {
	const { t } = useI18n();
	return (
		<div className="flex flex-1 items-center justify-center p-10 text-sm text-red">
			{t("reader.states.error")}
		</div>
	);
};
