import { getDictionary, hasLocale } from "@/i18n/locales";
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage({
	params,
}: {
	params: Promise<{ lang: string }>;
}) {
	const { lang } = await params;
	const dict = hasLocale(lang) ? await getDictionary(lang) : null;
	const title = dict?.phrasebook.meta.title ?? "Phrasebook — Mott Larbe";
	const subtitle = dict?.phrasebook.title ?? "Phrasebook";

	const pills =
		lang === "en"
			? ["Phrases", "Chechen", "Categories", "Audio"]
			: lang === "ru"
				? ["Фразы", "Чеченский", "Категории", "Аудио"]
				: ["Йийцарш", "Нохчийн", "Тобанаш", "Аудио"];

	return new ImageResponse(
		(
			<div
				style={{
					width: 1200,
					height: 630,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					background: "linear-gradient(135deg, #1a1a14 0%, #252520 100%)",
					fontFamily: "sans-serif",
					gap: 20,
					padding: "0 80px",
				}}
			>
				{/* Icon */}
				<div
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						width: 72,
						height: 72,
						borderRadius: 18,
						background: "#7c3aed",
						marginBottom: 4,
					}}
				>
					<svg
						width="40"
						height="40"
						viewBox="0 0 24 24"
						fill="none"
						stroke="white"
						strokeWidth="1.6"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path d="M8 9h8M8 13h5" />
						<path d="M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H7l-4 3V6z" />
					</svg>
				</div>

				{/* Breadcrumb */}
				<div
					style={{
						fontSize: 18,
						color: "#6b6960",
						letterSpacing: "0.05em",
						textTransform: "uppercase",
					}}
				>
					Mott Larbe · {subtitle}
				</div>

				{/* Title */}
				<div
					style={{
						fontSize: 56,
						fontWeight: 700,
						color: "#f5f4f0",
						letterSpacing: "-1px",
						textAlign: "center",
						lineHeight: 1.15,
						maxWidth: 900,
					}}
				>
					{title}
				</div>

				{/* Feature pills */}
				<div style={{ display: "flex", gap: 10, marginTop: 8 }}>
					{pills.map((label) => (
						<div
							key={label}
							style={{
								padding: "7px 16px",
								borderRadius: 999,
								background: "rgba(255,255,255,0.08)",
								color: "#d2d0c7",
								fontSize: 17,
								fontWeight: 500,
							}}
						>
							{label}
						</div>
					))}
				</div>

				{/* Domain */}
				<div
					style={{
						position: "absolute",
						bottom: 36,
						right: 48,
						fontSize: 17,
						color: "#6b6960",
					}}
				>
					mottlarbe.com
				</div>
			</div>
		),
		{ ...size },
	);
}
