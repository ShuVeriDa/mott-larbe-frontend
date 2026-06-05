import Link from "next/link";
import type { Metadata } from "next";
import { DEFAULT_LOCALE } from "@/i18n/locale-list";

export const metadata: Metadata = {
	title: "404 — Страница не найдена",
	description: "Запрошенная страница не существует. Вернитесь на главную или перейдите в библиотеку текстов.",
	robots: { index: false, follow: false },
};

const NotFound = () => (
	<main className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center font-sans">
		<h1 className="text-6xl font-bold">404</h1>
		<p className="text-lg text-muted-foreground">Страница не найдена</p>
		<nav className="flex gap-4 mt-2">
			<Link href={`/${DEFAULT_LOCALE}`} className="text-primary underline underline-offset-4 hover:opacity-80">
				Главная
			</Link>
			<Link href={`/${DEFAULT_LOCALE}/texts`} className="text-primary underline underline-offset-4 hover:opacity-80">
				Библиотека
			</Link>
		</nav>
	</main>
);

export default NotFound;
