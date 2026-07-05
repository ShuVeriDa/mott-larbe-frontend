import type { PwaPlatform } from "../types";

export const detectPlatform = (userAgent: string, maxTouchPoints: number): PwaPlatform => {
	const ua = userAgent.toLowerCase();
	const isClassicIos = /iphone|ipad|ipod/.test(ua);
	const isIpadOs13Plus = /macintosh/.test(ua) && maxTouchPoints > 1;
	if (isClassicIos || isIpadOs13Plus) return "ios";
	if (/android/.test(ua)) return "android";
	if (/chrome|edg/.test(ua) && !/firefox/.test(ua)) return "desktop-chromium";
	return "unsupported";
};
