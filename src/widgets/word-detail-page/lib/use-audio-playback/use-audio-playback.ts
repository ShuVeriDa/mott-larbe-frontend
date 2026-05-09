"use client";
import { useEffect, useRef, useState } from 'react';
export const useAudioPlayback = (url: string | null | undefined) => {
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const [isPlaying, setIsPlaying] = useState(false);

	useEffect(() => {
		if (!url) {
			audioRef.current = null;
			return;
		}
		const audio = new Audio(url);
		audioRef.current = audio;
		const onEnd = () => setIsPlaying(false);
		audio.addEventListener("ended", onEnd);
		audio.addEventListener("pause", onEnd);
		return () => {
			audio.removeEventListener("ended", onEnd);
			audio.removeEventListener("pause", onEnd);
			audio.pause();
			audioRef.current = null;
		};
	}, [url]);

	const play = () => {
		const audio = audioRef.current;
		if (!audio) return;
		audio.currentTime = 0;
		const result = audio.play();
		if (result && typeof result.then === "function") {
			result.then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
		} else {
			setIsPlaying(true);
		}
	};

	return { play, isPlaying, isAvailable: Boolean(url) };
};
