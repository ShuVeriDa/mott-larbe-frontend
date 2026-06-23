import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Mott Larbe — изучай чеченский через чтение";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
	return new ImageResponse(
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
				gap: 24,
				padding: "0 80px",
			}}
		>
			{/* Logo mark */}
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					width: 80,
					height: 80,
					borderRadius: 20,
					background: "#2254d3",
					marginBottom: 8,
				}}
			>
				<svg
					width="44"
					height="44"
					viewBox="0 0 24 24"
					fill="none"
					stroke="white"
					strokeWidth="1.6"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
					<path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
				</svg>
			</div>

			{/* Title */}
			<div
				style={{
					fontSize: 64,
					fontWeight: 700,
					color: "#f5f4f0",
					letterSpacing: "-1px",
					textAlign: "center",
					lineHeight: 1.1,
				}}
			>
				Mott Larbe
			</div>

			{/* Tagline */}
			<div
				style={{
					fontSize: 28,
					color: "#a09e97",
					textAlign: "center",
					lineHeight: 1.4,
					maxWidth: 800,
				}}
			>
				Изучай чеченский язык через реальные тексты
			</div>

			{/* Pills */}
			<div
				style={{
					display: "flex",
					gap: 12,
					marginTop: 8,
				}}
			>
				{["A–C", "Чеченский", "Словарь", "Повторения"].map(label => (
					<div
						key={label}
						style={{
							padding: "8px 18px",
							borderRadius: 999,
							background: "rgba(255,255,255,0.08)",
							color: "#d2d0c7",
							fontSize: 18,
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
					fontSize: 18,
					color: "#6b6960",
				}}
			>
				mottlarbe.com
			</div>
		</div>,
		{ ...size },
	);
}
