"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { MotionConfig } from "framer-motion";
import type { ComponentProps } from 'react';

export const ThemeProvider = ({
	children,
	...props
}: ComponentProps<typeof NextThemesProvider>) => (
	<NextThemesProvider
		attribute="data-theme"
		defaultTheme="dark"
		enableSystem
		{...props}
	>
		<MotionConfig reducedMotion="never">
			{children}
		</MotionConfig>
	</NextThemesProvider>
);
