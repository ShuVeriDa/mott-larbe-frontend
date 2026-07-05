import { Typography } from "@/shared/ui/typography";
import { useI18n } from "@/shared/lib/i18n";

export const AuthDivider = () => {
	const { t } = useI18n();

	return (
		<div className="my-5 flex items-center gap-3" role="separator">
			<span className="h-px flex-1 bg-bd-2" />
			<Typography tag="span" className="text-[11.5px] font-medium uppercase tracking-wide text-t-3">
				{t("auth.oauth.divider")}
			</Typography>
			<span className="h-px flex-1 bg-bd-2" />
		</div>
	);
};
