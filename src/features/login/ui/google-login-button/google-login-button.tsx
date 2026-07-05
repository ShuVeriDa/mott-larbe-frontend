import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { getGoogleLoginHref } from "@/entities/auth";
import { useI18n } from "@/shared/lib/i18n";
import { GoogleIcon } from "./google-icon";

export const GoogleLoginButton = () => {
	const { t, lang } = useI18n();

	return (
		<Button
			asChild
			variant="outline"
			className="h-[42px] w-full gap-2 rounded-[9px] text-[13.5px] font-medium max-[640px]:h-11"
		>
			<a href={getGoogleLoginHref(lang)}>
				<GoogleIcon className="size-4 shrink-0" />
				<Typography tag="span">{t("auth.oauth.google")}</Typography>
			</a>
		</Button>
	);
};
