"use client";

import { useMediaQuery } from "@/shared/lib/media-query";
import type { MotionProps } from "framer-motion";

/**
 * Returns whileHover/whileTap motion props only on pointer devices.
 * On touch screens (hover: none) whileHover is omitted — hover state
 * gets stuck after tap since browsers fire a synthetic hover on touch.
 * whileTap is always included: it works correctly on both touch and mouse.
 */
export const useHoverProps = (
	whileHover: MotionProps["whileHover"],
	whileTap: MotionProps["whileTap"],
	transition: MotionProps["transition"],
): Pick<MotionProps, "whileHover" | "whileTap" | "transition"> => {
	const isTouch = useMediaQuery("(hover: none)");

	return {
		whileHover: isTouch ? undefined : whileHover,
		whileTap,
		transition,
	};
};
