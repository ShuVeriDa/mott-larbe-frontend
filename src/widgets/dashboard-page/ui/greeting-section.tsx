"use client";

import type { UserProfile } from "@/entities/user";
import { GreetingIntro } from "./greeting-intro";

interface GreetingSectionProps {
	user: UserProfile | undefined;
	lang: string;
}

export const GreetingSection = ({ user, lang }: GreetingSectionProps) => (
	<GreetingIntro user={user} lang={lang} />
);
