import { useEffect, useRef } from "react";

const FOCUSABLE =
	'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export const useFocusTrap = (
	containerRef: React.RefObject<HTMLElement | null>,
	active: boolean,
) => {
	const previousFocusRef = useRef<HTMLElement | null>(null);

	useEffect(() => {
		if (!active) return;

		previousFocusRef.current = document.activeElement as HTMLElement | null;

		const container = containerRef.current;
		if (!container) return;

		const getFocusable = () =>
			Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
				el => !el.closest("[aria-hidden='true']"),
			);

		const first = getFocusable()[0];
		first?.focus();

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key !== "Tab") return;
			const nodes = getFocusable();
			if (nodes.length === 0) return;

			const firstEl = nodes[0];
			const lastEl = nodes[nodes.length - 1];

			if (e.shiftKey) {
				if (document.activeElement === firstEl) {
					e.preventDefault();
					lastEl.focus();
				}
			} else {
				if (document.activeElement === lastEl) {
					e.preventDefault();
					firstEl.focus();
				}
			}
		};

		container.addEventListener("keydown", handleKeyDown);

		return () => {
			container.removeEventListener("keydown", handleKeyDown);
			previousFocusRef.current?.focus();
		};
	}, [active, containerRef]);
};
