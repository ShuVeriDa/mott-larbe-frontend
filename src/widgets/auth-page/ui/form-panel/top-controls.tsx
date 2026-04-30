"use client";

import { AuthLanguageSwitcher } from "@/features/auth-language-switcher";
import { AuthThemeToggle } from "./auth-theme-toggle";

export const TopControls = () => (
	<div className="mb-[60px] flex items-center justify-end gap-2 max-[900px]:mb-8 max-[640px]:mb-6">
		<AuthLanguageSwitcher />
		<AuthThemeToggle />
	</div>
);
