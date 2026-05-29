import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Нет подключения — Мотт Ларбе",
};

const OfflinePage = () => (
	<main className="min-h-screen flex flex-col items-center justify-center gap-4 p-8 text-center">
		<svg
			viewBox="0 0 52 64"
			width="52"
			height="64"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
		>
			<rect x="2" y="4" width="48" height="56" rx="3.5" stroke="var(--t3, #a5a39a)" strokeWidth="1.5" opacity="0.5" />
			<rect x="2" y="4" width="11" height="56" rx="3.5" fill="var(--acc, #2254d3)" fillOpacity="0.12" stroke="var(--acc, #2254d3)" strokeOpacity="0.25" strokeWidth="0.8" />
			<rect x="19" y="35" width="16" height="7" rx="1.5" fill="var(--acc, #2254d3)" fillOpacity="0.12" stroke="var(--acc, #2254d3)" strokeOpacity="0.4" strokeWidth="0.6" />
			<line x1="21" y1="38.5" x2="33" y2="38.5" stroke="var(--acc, #2254d3)" strokeWidth="1.3" strokeLinecap="round" />
			<path d="M38 0 L38 12 L41 9.5 L44 12 L44 0" fill="var(--acc, #2254d3)" opacity="0.75" />
		</svg>
		<h1 className="text-xl font-semibold">Нет подключения к интернету</h1>
		<p className="text-sm text-muted-foreground max-w-xs">
			Эта страница недоступна офлайн. Подключитесь к интернету и попробуйте снова.
		</p>
		<a
			href="/"
			className="mt-2 text-sm underline underline-offset-4 text-muted-foreground hover:text-foreground transition-colors"
		>
			На главную
		</a>
	</main>
);

export default OfflinePage;
