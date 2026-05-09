"use client";
import { useEffect, useRef, useState } from 'react';
interface UseResendTimerOptions {
	durationSeconds?: number;
}

export const useResendTimer = ({
	durationSeconds = 60,
}: UseResendTimerOptions = {}) => {
	const [secondsLeft, setSecondsLeft] = useState(0);
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

	const clear = () => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
	};

	const start = () => {
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
	};

	useEffect(() => () => clear(), [clear]);

	return {
		secondsLeft,
		isActive: secondsLeft > 0,
		start,
	};
};
