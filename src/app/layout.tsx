import { ReactNode } from 'react';
import type { Metadata, Viewport } from "next";
import { Playfair_Display, Golos_Text, Geist_Mono, Inter, Lora, Merriweather, PT_Serif, Source_Serif_4 } from "next/font/google";
import { QueryProvider } from "@/shared/ui/query-provider";
import { ThemeProvider } from "@/shared/ui/theme-provider";
import { TooltipProvider } from "@/shared/ui/tooltip";
import { PageAnalyticsProvider } from "@/shared/lib/page-analytics";
import { SwRegister } from "@/shared/lib/sw-register";
import "./globals.css";
import { cn } from "@/lib/utils";

const playfairDisplayHeading = Playfair_Display({ subsets: ["latin"], variable: "--font-heading" });

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

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

export const viewport: Viewport = {
	themeColor: [
		{ media: "(prefers-color-scheme: dark)", color: "#121210" },
		{ media: "(prefers-color-scheme: light)", color: "#f5f4f0" },
	],
	width: "device-width",
	initialScale: 1,
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mottlarbe.com";

const ROOT_JSON_LD = {
	"@context": "https://schema.org",
	"@graph": [
		{
			"@type": "WebSite",
			"@id": `${SITE_URL}/#website`,
			url: SITE_URL,
			name: "Mott Larbe",
			description: "Языковая платформа для изучения чеченского языка через реальные тексты",
			inLanguage: ["ce", "ru", "en"],
			potentialAction: {
				"@type": "SearchAction",
				target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/ru/texts?q={search_term_string}` },
				"query-input": "required name=search_term_string",
			},
		},
		{
			"@type": "Organization",
			"@id": `${SITE_URL}/#organization`,
			name: "Mott Larbe",
			url: SITE_URL,
			logo: {
				"@type": "ImageObject",
				url: `${SITE_URL}/icons/icon-512x512.png`,
				width: 512,
				height: 512,
			},
			sameAs: [],
		},
	],
};

export const metadata: Metadata = {
	metadataBase: new URL(SITE_URL),
	title: {
		template: "%s | Mott Larbe",
		default: "Mott Larbe — изучай чеченский через чтение",
	},
	description: "Языковая платформа для изучения чеченского: тексты с переводом по клику, морфологический разбор, личный словарь и интервальные повторения. Уровни A1–C2.",
	keywords: ["чеченский язык", "изучение чеченского", "нохчийн мотт", "Mott Larbe", "чтение на чеченском"],
	authors: [{ name: "Mott Larbe" }],
	creator: "Mott Larbe",
	openGraph: {
		siteName: "Mott Larbe",
		type: "website",
		locale: "ru_RU",
		images: [{ url: "/opengraph-image.png", width: 1200, height: 630 }],
	},
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
	...(process.env.NEXT_PUBLIC_GSC_VERIFICATION && {
		verification: {
			google: process.env.NEXT_PUBLIC_GSC_VERIFICATION,
		},
	}),
};

const fontVars = cn(
	"h-full antialiased",
	golosText.variable,
	playfairDisplay.variable,
	geistMono.variable,
	lora.variable,
	merriweather.variable,
	ptSerif.variable,
	sourceSerif4.variable,
	"font-sans",
	inter.variable,
	playfairDisplayHeading.variable,
);

const RootLayout = ({ children }: Readonly<{ children: ReactNode }>) => (
	<html lang="ru" className={fontVars} suppressHydrationWarning>
		<body className="min-h-full flex flex-col md:overflow-hidden" suppressHydrationWarning>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(ROOT_JSON_LD).replace(/</g, "\\u003c") }}
			/>
			<ThemeProvider>
				<QueryProvider>
					<PageAnalyticsProvider />
					<SwRegister />
					<TooltipProvider>{children}</TooltipProvider>
				</QueryProvider>
			</ThemeProvider>
		</body>
	</html>
);

export default RootLayout;
