import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "404 — Страница не найдена",
	description: "Запрошенная страница не существует. Вернитесь на главную или перейдите в библиотеку текстов.",
	robots: { index: false, follow: false },
};

const NotFound = () => (
	<html lang="ru-RU">
		<body>
			<main style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", gap: "16px", fontFamily: "sans-serif", textAlign: "center", padding: "24px" }}>
				<h1 style={{ fontSize: "48px", fontWeight: "700", margin: 0 }}>404</h1>
				<p style={{ fontSize: "18px", color: "#666", margin: 0 }}>Страница не найдена</p>
				<nav style={{ display: "flex", gap: "16px", marginTop: "8px" }}>
					<Link href="/ru" style={{ color: "#2254d3", textDecoration: "underline" }}>
						Главная
					</Link>
					<Link href="/ru/texts" style={{ color: "#2254d3", textDecoration: "underline" }}>
						Библиотека
					</Link>
				</nav>
			</main>
		</body>
	</html>
);

export default NotFound;
