import type { Metadata } from "next";
import { Playfair_Display, Golos_Text, Geist_Mono, Inter } from "next/font/google";
import { headers } from "next/headers";
import { QueryProvider } from "@/shared/ui/query-provider";
import { ThemeProvider } from "@/shared/ui/theme-provider";
import { TooltipProvider } from "@/shared/ui/tooltip";
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

export const metadata: Metadata = {
	title: "Mott & Larbe",
	description: "Mott & Larbe",
};

const RootLayout = async ({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) => {
	const locale = (await headers()).get("x-locale") ?? "ru";

	return (
		<html
			lang={locale}
			className={cn("h-full", "antialiased", golosText.variable, playfairDisplay.variable, geistMono.variable, "font-sans", inter.variable, playfairDisplayHeading.variable)}
			suppressHydrationWarning
		>
			<body className="min-h-full flex flex-col">
				<ThemeProvider>
					<QueryProvider>
						<TooltipProvider>{children}</TooltipProvider>
					</QueryProvider>
				</ThemeProvider>
			</body>
		</html>
	);
};

export default RootLayout;
