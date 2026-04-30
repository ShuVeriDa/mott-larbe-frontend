"use client";

import { useContext } from "react";
import { I18nContext } from "./i18n-context";

const resolvePath = (obj: unknown, path: string): unknown => {
	const parts = path.split(".");
	let current: unknown = obj;
	for (const part of parts) {
		if (current && typeof current === "object" && part in current) {
			current = (current as Record<string, unknown>)[part];
		} else {
			return undefined;
		}
	}
	return current;
};

const interpolate = (
	template: string,
	vars?: Record<string, string | number>,
): string => {
	if (!vars) return template;
	return template.replace(/\{(\w+)\}/g, (_, key: string) =>
		key in vars ? String(vars[key]) : `{${key}}`,
	);
};

export const useI18n = () => {
	const ctx = useContext(I18nContext);
	if (!ctx) {
		throw new Error("useI18n must be used within an I18nProvider");
	}

	const t = (key: string, vars?: Record<string, string | number>): string => {
		const value = resolvePath(ctx.dict, key);
		if (typeof value !== "string") return key;
		return interpolate(value, vars);
	};

	return { t, lang: ctx.lang, dict: ctx.dict };
};
