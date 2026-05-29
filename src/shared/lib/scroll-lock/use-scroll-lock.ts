import { useEffect } from "react";

export const useScrollLock = (locked: boolean) => {
	useEffect(() => {
		if (!locked) return;

		const scrollY = window.scrollY;
		const prevPosition = document.body.style.position;
		const prevTop = document.body.style.top;
		const prevWidth = document.body.style.width;

		document.body.style.position = "fixed";
		document.body.style.top = `-${scrollY}px`;
		document.body.style.width = "100%";

		return () => {
			document.body.style.position = prevPosition;
			document.body.style.top = prevTop;
			document.body.style.width = prevWidth;
			window.scrollTo(0, scrollY);
		};
	}, [locked]);
};
