"use client";

import { GoogleIcon } from "@/features/login";
import { getGoogleLoginHref } from "@/entities/auth";
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";

export const LinkGoogleRow = () => {
	const { t, lang } = useI18n();

	return (
		<div className="flex items-center gap-3 border-b-[0.5px] border-bd-1 px-4 py-3 last:border-b-0">
			<Typography
				tag="span"
				className="flex size-8 shrink-0 items-center justify-center rounded-[8px] bg-surf-2"
			>
				<GoogleIcon className="size-4" />
			</Typography>
			<div className="flex-1 min-w-0">
				<Typography tag="p" className="text-[12.5px] font-medium text-t-1 mb-0.5">
					Google
				</Typography>
				<Typography tag="p" className="text-[11px] text-t-3">
					{t("profile.security.connectedAccounts.notLinked")}
				</Typography>
			</div>
			<Button asChild variant="outline" className="h-7 px-2.5 text-[11.5px] shrink-0">
				<a href={getGoogleLoginHref(lang, "link")}>
					{t("profile.security.connectedAccounts.link")}
				</a>
			</Button>
		</div>
	);
};
