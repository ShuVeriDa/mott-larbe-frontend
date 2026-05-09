"use client";

import { useMutation } from "@tanstack/react-query";
import {
	useEffect,
	useRef,
	useState,
	type RefObject,
} from "react";
import {
	landingApi,
	landingKeys,
	type DemoWordEntry,
} from "@/entities/landing";

interface PopupPosition {
	top: number;
	left: number;
	arrowX: number;
	above: boolean;
}

interface UseDemoReaderArgs {
	cardRef: RefObject<HTMLDivElement | null>;
	wordsDict: Record<string, DemoWordEntry>;
}

const POPUP_WIDTH = 240;
const GAP = 12;
const PADDING = 12;
const POPUP_APPROX_HEIGHT = 240;

const isMobile = () =>
	typeof window !== "undefined" && window.innerWidth <= 640;

export const useDemoReader = ({ cardRef, wordsDict }: UseDemoReaderArgs) => {
	const [activeWord, setActiveWord] = useState<string | null>(null);
	const [activeData, setActiveData] = useState<DemoWordEntry | null>(null);
	const [position, setPosition] = useState<PopupPosition | null>(null);
	const [addedWords, setAddedWords] = useState<Set<string>>(new Set());
	const tokenRefs = useRef<Map<string, HTMLElement>>(new Map());

	const lookup = useMutation({
		mutationKey: landingKeys.wordLookup("demo"),
		mutationFn: (word: string) =>
			landingApi.lookupByWord({ normalized: word }),
	});

	const computePosition = (token: HTMLElement): PopupPosition | null => {
		const card = cardRef.current;
		if (!card) return null;
		const cardBox = card.getBoundingClientRect();
		const tokBox = token.getBoundingClientRect();

		let top = tokBox.bottom - cardBox.top + GAP;
		const tokCenterX = tokBox.left - cardBox.left + tokBox.width / 2;
		let left = tokCenterX - POPUP_WIDTH / 2;
		left = Math.max(
			PADDING,
			Math.min(cardBox.width - POPUP_WIDTH - PADDING, left),
		);
		const arrowX = Math.max(
			14,
			Math.min(POPUP_WIDTH - 26, tokCenterX - left - 6),
		);
		let above = false;
		if (top + POPUP_APPROX_HEIGHT > cardBox.height - PADDING) {
			top = tokBox.top - cardBox.top - POPUP_APPROX_HEIGHT - GAP;
			above = true;
		}
		return { top, left, arrowX, above };
	};

	const open = (word: string, token: HTMLElement) => {
		tokenRefs.current.set(word, token);
		const data = wordsDict[word];
		if (!data) return;
		setActiveWord(word);
		setActiveData(data);
		setPosition(computePosition(token));
		lookup.mutate(word);
	};

	const close = () => {
		setActiveWord(null);
		setActiveData(null);
		setPosition(null);
	};

	const toggle = (word: string, token: HTMLElement) => {
		if (activeWord === word) {
			close();
		} else {
			open(word, token);
		}
	};

	const toggleAdded = () => {
		if (!activeWord) return;
		setAddedWords((prev) => {
			const next = new Set(prev);
			if (next.has(activeWord)) {
				next.delete(activeWord);
			} else {
				next.add(activeWord);
			}
			return next;
		});
	};

	useEffect(() => {
		if (!activeWord) return;
		const onDocClick = (e: MouseEvent) => {
			// intentional: delegated event needs the real event target
			const target = e.target as HTMLElement | null;
			if (!target) return;
			if (target.closest("[data-demo-popup]")) return;
			if (target.closest("[data-demo-token]")) return;
			close();
		};
		document.addEventListener("click", onDocClick);
		return () => document.removeEventListener("click", onDocClick);
	}, [activeWord, close]);

	useEffect(() => {
		if (!activeWord) return;
		const reposition = () => {
			const token = tokenRefs.current.get(activeWord);
			if (!token) return;
			setPosition(computePosition(token));
		};
		window.addEventListener("resize", reposition);
		window.addEventListener("scroll", reposition, { passive: true });
		return () => {
			window.removeEventListener("resize", reposition);
			window.removeEventListener("scroll", reposition);
		};
	}, [activeWord, computePosition]);

	return {
		activeWord,
		activeData,
		position,
		isAdded: activeWord ? addedWords.has(activeWord) : false,
		isMobile: isMobile(),
		toggle,
		toggleAdded,
		close,
	};
};
