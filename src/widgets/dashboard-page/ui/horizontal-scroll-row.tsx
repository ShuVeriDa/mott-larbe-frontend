"use client";

import { cn } from "@/shared/lib/cn";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";

interface HorizontalScrollRowProps {
	children: ReactNode;
	className?: string;
}

export const HorizontalScrollRow = ({ children, className }: HorizontalScrollRowProps) => {
	const [emblaRef, emblaApi] = useEmblaCarousel({
		align: "start",
		dragFree: true,
		containScroll: "trimSnaps",
	});

	const prevBtnRef = useRef<HTMLButtonElement>(null);
	const nextBtnRef = useRef<HTMLButtonElement>(null);

	// Update button visibility directly via DOM — no setState, no re-renders
	const syncButtons = () => {
		if (!emblaApi) return;
		const prev = prevBtnRef.current;
		const next = nextBtnRef.current;
		if (prev) prev.style.display = emblaApi.canScrollPrev() ? "flex" : "none";
		if (next) next.style.display = emblaApi.canScrollNext() ? "flex" : "none";
	};

	useEffect(() => {
		if (!emblaApi) return;
		emblaApi.on("init", syncButtons);
		emblaApi.on("select", syncButtons);
		emblaApi.on("reInit", syncButtons);
		return () => {
			emblaApi.off("init", syncButtons);
			emblaApi.off("select", syncButtons);
			emblaApi.off("reInit", syncButtons);
		};
	}, [emblaApi, syncButtons]);

	const handleScrollPrev = () => emblaApi?.scrollPrev();
	const handleScrollNext = () => emblaApi?.scrollNext();

	return (
		<div className="relative -mx-5 px-5 overflow-x-clip py-2 -my-2 max-md:-mx-4 max-md:px-4 max-sm:-mx-3.5 max-sm:px-3.5">
			<button
				ref={prevBtnRef}
				type="button"
				onClick={handleScrollPrev}
				aria-label="Прокрутить назад"
				style={{ display: "none" }}
				className="absolute left-1 top-1/2 z-10 size-8 -translate-y-1/2 items-center justify-center rounded-full border border-bd-2 bg-surf shadow-md outline-none duration-150 transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-acc/70 focus-visible:ring-offset-1 max-md:hidden!"
			>
				<ChevronLeftIcon />
			</button>

			<div ref={emblaRef} className={cn(className)}>
				<div className="flex gap-3 touch-pan-y touch-pinch-zoom">
					{children}
				</div>
			</div>

			<button
				ref={nextBtnRef}
				type="button"
				onClick={handleScrollNext}
				aria-label="Прокрутить вперёд"
				style={{ display: "none" }}
				className="absolute right-1 top-1/2 z-10 size-8 -translate-y-1/2 items-center justify-center rounded-full border border-bd-2 bg-surf shadow-md outline-none duration-150 transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-acc/70 focus-visible:ring-offset-1 max-md:hidden!"
			>
				<ChevronRightIcon />
			</button>
		</div>
	);
};

const ChevronLeftIcon = () => (
	<ChevronLeft className="size-3.5 text-t-1" aria-hidden="true" />
);

const ChevronRightIcon = () => (
	<ChevronRight className="size-3.5 text-t-1" aria-hidden="true" />
);
