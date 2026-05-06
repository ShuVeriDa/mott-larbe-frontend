"use client";

import { useEffect, useRef, useState } from "react";

export interface TokenTimeLeft {
	hours: number;
	minutes: number;
}

export const useTokenTimer = (
	expiresAt: string | undefined,
	onExpire: () => void,
): TokenTimeLeft | null => {
	const [timeLeft, setTimeLeft] = useState<TokenTimeLeft | null>(null);
	const onExpireRef = useRef(onExpire);
	onExpireRef.current = onExpire;

	useEffect(() => {
		if (!expiresAt) return;

		const tick = (): boolean => {
			const diff = new Date(expiresAt).getTime() - Date.now();
			if (diff <= 0) {
				setTimeLeft(null);
				onExpireRef.current();
				return false;
			}
			setTimeLeft({
				hours: Math.floor(diff / 3_600_000),
				minutes: Math.floor((diff % 3_600_000) / 60_000),
			});
			return true;
		};

		if (!tick()) return;

		const id = setInterval(() => {
			if (!tick()) clearInterval(id);
		}, 60_000);

		return () => clearInterval(id);
	}, [expiresAt]);

	return timeLeft;
};
