"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { http } from "@/shared/api";

const trackPageview = (path: string, referrer: string) => {
	void http.post("/tracking/track", { type: "pageview", path, referrer }).catch(() => {});
};

export const usePageAnalytics = () => {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const referrerRef = useRef<string>("");

	useEffect(() => {
		const path = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");
		trackPageview(path, referrerRef.current);
		referrerRef.current = path;
	}, [pathname, searchParams]);
};
