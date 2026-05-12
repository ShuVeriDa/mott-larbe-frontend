"use client";

import { useDashboard } from "@/entities/dashboard";
import { useCurrentUser } from "@/entities/user";
import { useI18n } from "@/shared/lib/i18n";
import { useRouter } from "next/navigation";
import { type ComponentProps, type SyntheticEvent, useState } from "react";

export const useDashboardPage = () => {
	const { t, lang } = useI18n();
	const router = useRouter();
	const [searchQuery, setSearchQuery] = useState("");

	const { data, isLoading, isError, refetch } = useDashboard();
	const { data: user } = useCurrentUser();

	const handleSearchSubmit = (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
		e.preventDefault();
		const q = searchQuery.trim();
		if (q) {
			router.push(`/${lang}/texts?search=${encodeURIComponent(q)}`);
		} else {
			router.push(`/${lang}/texts`);
		}
	};

	const handleSearchChange: NonNullable<ComponentProps<"input">["onChange"]> = e =>
		setSearchQuery(e.currentTarget.value);

	const handleRetry: NonNullable<ComponentProps<"button">["onClick"]> = () => refetch();

	return {
		t,
		lang,
		searchQuery,
		data,
		isLoading,
		isError,
		user,
		handleSearchSubmit,
		handleSearchChange,
		handleRetry,
	};
};
