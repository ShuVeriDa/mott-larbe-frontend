"use client";
import { useCallback, useEffect, useRef, useState } from 'react';
interface UseResendTimerOptions {
	durationSeconds?: number;
}

export const useResendTimer = ({
	durationSeconds = 60,
}: UseResendTimerOptions = {}) => {
	const [secondsLeft, setSecondsLeft] = useState(0);
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

	const clear = useCallback(() => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
	}, []);

	const start = useCallback(() => {
		clear();
		setSecondsLeft(durationSeconds);
		intervalRef.current = setInterval(() => {
			setSecondsLeft((prev) => {
				if (prev <= 1) {
					clear();
					return 0;
				}
				return prev - 1;
			});
		}, 1000);
	}, [clear, durationSeconds]);

	useEffect(() => () => clear(), [clear]);

	return {
		secondsLeft,
		isActive: secondsLeft > 0,
		start,
	};
};
