import { useEffect, useRef } from "react";

export const useScrollToBottom = (dep: unknown) => {
	const bottomRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: "instant" });
	}, [dep]);

	return bottomRef;
};
