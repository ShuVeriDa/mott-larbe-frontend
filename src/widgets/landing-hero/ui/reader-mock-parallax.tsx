"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ReaderMock } from "./reader-mock";

export const ReaderMockParallax = () => {
	const ref = useRef<HTMLDivElement>(null);
	const reduceMotion = useReducedMotion();

	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ["start start", "end start"],
	});

	const y = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [0, 40]);

	return (
		<div ref={ref} className="max-[900px]:mx-auto max-[900px]:w-full max-[900px]:max-w-[540px]">
			<motion.div style={{ y }}>
				<ReaderMock />
			</motion.div>
		</div>
	);
};
