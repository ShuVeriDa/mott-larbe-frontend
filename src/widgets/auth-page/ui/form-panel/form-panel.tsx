"use client";

import { Button } from "@/shared/ui/button";

import { ComponentProps } from 'react';
import { LoginForm } from "@/features/login";
import { RegisterForm } from "@/features/register";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import type { AuthMode } from "../../model";
import { AuthTabs } from "./auth-tabs";
import { TopControls } from "./top-controls";

interface FormPanelProps {
	mode: AuthMode;
	onModeChange: (mode: AuthMode) => void;
	forgotHref: string;
	successHref: string;
	termsHref: string;
	privacyHref: string;
}

export const FormPanel = ({
	mode,
	onModeChange,
	forgotHref,
	successHref,
	termsHref,
	privacyHref,
}: FormPanelProps) => {
	const { t } = useI18n();
	const isLogin = mode === "login";

		const handleClick: NonNullable<ComponentProps<"button">["onClick"]> = () => onModeChange("register");
	const handleClick2: NonNullable<ComponentProps<"button">["onClick"]> = () => onModeChange("login");
return (
		<section className="relative flex flex-col bg-panel px-12 py-10 max-[900px]:px-8 max-[900px]:pb-12 max-[900px]:pt-8 max-[640px]:px-5 max-[640px]:pb-9 max-[640px]:pt-[22px]">
			<TopControls />

			<div className="flex flex-1 flex-col items-center justify-center">
				<div className="w-full max-w-[380px] max-[640px]:max-w-none">
					<Typography
						tag="h2"
						className="mb-1.5 font-display text-[28px] font-medium tracking-[-0.4px] text-t-1 max-[640px]:text-[24px]"
					>
						{t(isLogin ? "auth.headings.login" : "auth.headings.register")}
					</Typography>
					<Typography className="mb-7 text-[13px] text-t-2 max-[640px]:mb-[22px] max-[640px]:text-[12.5px]">
						{t(
							isLogin
								? "auth.headings.loginSub"
								: "auth.headings.registerSub",
						)}
					</Typography>

					<AuthTabs mode={mode} onChange={onModeChange} />

					{isLogin ? (
						<LoginForm forgotHref={forgotHref} successHref={successHref} />
					) : (
						<RegisterForm
							successHref={successHref}
							termsHref={termsHref}
							privacyHref={privacyHref}
						/>
					)}

					<Typography className="mt-[18px] text-center text-[12.5px] text-t-2">
						{isLogin ? (
							<>
								{t("auth.crosslink.noAccount")}{" "}
								<Button
									onClick={handleClick}
									className="font-semibold text-acc-t hover:underline"
								>
									{t("auth.crosslink.signup")}
								</Button>
							</>
						) : (
							<>
								{t("auth.crosslink.haveAccount")}{" "}
								<Button
									onClick={handleClick2}
									className="font-semibold text-acc-t hover:underline"
								>
									{t("auth.crosslink.signin")}
								</Button>
							</>
						)}
					</Typography>
				</div>
			</div>
		</section>
	);
};
