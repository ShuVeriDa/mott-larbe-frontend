"use client";

import { useI18n } from "@/shared/lib/i18n";
import { useState } from "react";
import type { AuthMode } from "../model";
import { BrandPanel } from "./brand-panel";
import { FormPanel } from "./form-panel";

interface AuthPageProps {
	initialMode?: AuthMode;
}

export const AuthPage = ({ initialMode = "login" }: AuthPageProps) => {
	const { lang } = useI18n();
	const [mode, setMode] = useState<AuthMode>(initialMode);

	const homeHref = `/${lang}`;
	const forgotHref = `/${lang}/reset-password`;
	const successHref = `/${lang}/dashboard`;
	const termsHref = `/${lang}/terms`;
	const privacyHref = `/${lang}/privacy`;

	return (
		<div className="grid min-h-dvh grid-cols-[1.1fr_1fr] bg-panel max-[900px]:grid-cols-1">
			<BrandPanel
				homeHref={homeHref}
				termsHref={termsHref}
				privacyHref={privacyHref}
			/>
			<FormPanel
				mode={mode}
				onModeChange={setMode}
				forgotHref={forgotHref}
				successHref={successHref}
				termsHref={termsHref}
				privacyHref={privacyHref}
			/>
		</div>
	);
};
