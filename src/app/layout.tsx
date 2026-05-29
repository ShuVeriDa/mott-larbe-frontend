import { ReactNode } from 'react';
import type { Metadata } from "next";
import { Playfair_Display, Golos_Text, Geist_Mono, Inter, Lora, Merriweather, PT_Serif, Source_Serif_4 } from "next/font/google";
import { headers } from "next/headers";
import { QueryProvider } from "@/shared/ui/query-provider";
import { ThemeProvider } from "@/shared/ui/theme-provider";
import { TooltipProvider } from "@/shared/ui/tooltip";
import { PageAnalyticsProvider } from "@/shared/lib/page-analytics";
import "./globals.css";
import { cn } from "@/lib/utils";

const playfairDisplayHeading = Playfair_Display({subsets:['latin'],variable:'--font-heading'});

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const golosText = Golos_Text({
	variable: "--font-golos",
	subsets: ["latin", "cyrillic"],
	weight: ["400", "500", "600", "700"],
});

const playfairDisplay = Playfair_Display({
	variable: "--font-playfair",
	subsets: ["latin", "cyrillic"],
	weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

const lora = Lora({
	variable: "--font-lora",
	subsets: ["latin", "cyrillic"],
	weight: ["400", "500", "600", "700"],
});

const merriweather = Merriweather({
	variable: "--font-merriweather",
	subsets: ["latin", "cyrillic"],
	weight: ["300", "400", "700"],
});

const ptSerif = PT_Serif({
	variable: "--font-pt-serif",
	subsets: ["latin", "cyrillic"],
	weight: ["400", "700"],
});

const sourceSerif4 = Source_Serif_4({
	variable: "--font-source-serif",
	subsets: ["latin"],
	weight: ["300", "400", "600"],
});

export const metadata: Metadata = {
	title: "Mott & Larbe",
	description: "Mott & Larbe",
	manifest: "/manifest.webmanifest",
	appleWebApp: {
		capable: true,
		statusBarStyle: "black-translucent",
		title: "Мотт Ларбе",
		startupImage: "/icons/apple-touch-icon.png",
	},
	formatDetection: {
		telephone: false,
	},
	icons: {
		icon: [
			{ url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
			{ url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
		],
		apple: [
			{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
		],
	},
};

const RootLayout = async ({
	children,
}: Readonly<{
	children: ReactNode;
}>) => {
	const locale = (await headers()).get("x-locale") ?? "ru";

	return (
		<html
			lang={locale}
			className={cn("h-full", "antialiased", golosText.variable, playfairDisplay.variable, geistMono.variable, lora.variable, merriweather.variable, ptSerif.variable, sourceSerif4.variable, "font-sans", inter.variable, playfairDisplayHeading.variable)}
			suppressHydrationWarning
		>
			<head>
				<meta name="theme-color" content="#121210" media="(prefers-color-scheme: dark)" />
				<meta name="theme-color" content="#f5f4f0" media="(prefers-color-scheme: light)" />
			</head>
			<body className="min-h-full flex flex-col md:overflow-hidden" suppressHydrationWarning>
				<ThemeProvider>
					<QueryProvider>
						<PageAnalyticsProvider />
						<TooltipProvider>{children}</TooltipProvider>
					</QueryProvider>
				</ThemeProvider>
			</body>
		</html>
	);
};

export default RootLayout;
