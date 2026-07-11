import { ImageResponse } from "next/og";
import { SERVER_API_URL } from "@/shared/config";
import type { LibraryTextDetail } from "@/entities/library-text";

export const runtime = "edge";
export const alt = "Mott Larbe";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const fetchText = async (id: string): Promise<LibraryTextDetail | null> => {
	try {
		const res = await fetch(`${SERVER_API_URL}/texts/${encodeURIComponent(id)}`, {
			next: { revalidate: 3600 },
		});
		if (!res.ok) return null;
		return res.json() as Promise<LibraryTextDetail>;
	} catch {
		return null;
	}
};

const OpengraphImage = async ({
	params,
}: {
	params: Promise<{ lang: string; id: string }>;
}) => {
	const { id } = await params;
	const text = await fetchText(id);

	const title = text?.title ?? "Mott Larbe";
	const author = text?.author ?? null;
	const lang = text?.language ?? "";

	return new ImageResponse(
		(
			<div
				style={{
					width: "100%",
					height: "100%",
					display: "flex",
					flexDirection: "column",
					justifyContent: "flex-end",
					background: "linear-gradient(135deg, #1a1a18 0%, #2a2a22 100%)",
					padding: "64px",
					fontFamily: "sans-serif",
					position: "relative",
				}}
			>
				{/* Decorative lines */}
				<div
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						right: 0,
						height: "4px",
						background: "linear-gradient(90deg, #c9a96e, #e8c98a)",
					}}
				/>

				{/* Language badge */}
				{lang && (
					<div
						style={{
							position: "absolute",
							top: "48px",
							right: "64px",
							background: "rgba(201,169,110,0.15)",
							border: "1px solid rgba(201,169,110,0.4)",
							borderRadius: "6px",
							padding: "6px 14px",
							color: "#c9a96e",
							fontSize: "14px",
							fontWeight: 600,
							letterSpacing: "0.08em",
						}}
					>
						{lang}
					</div>
				)}

				{/* Site name */}
				<div
					style={{
						color: "rgba(255,255,255,0.35)",
						fontSize: "16px",
						fontWeight: 500,
						marginBottom: "20px",
						letterSpacing: "0.06em",
						textTransform: "uppercase",
					}}
				>
					Mott Larbe
				</div>

				{/* Title */}
				<div
					style={{
						color: "#f5f2eb",
						fontSize: title.length > 60 ? "36px" : "48px",
						fontWeight: 700,
						lineHeight: 1.2,
						maxWidth: "900px",
						marginBottom: author ? "24px" : "0",
					}}
				>
					{title}
				</div>

				{/* Author */}
				{author && (
					<div
						style={{
							color: "rgba(255,255,255,0.5)",
							fontSize: "22px",
							fontWeight: 400,
						}}
					>
						{author}
					</div>
				)}
			</div>
		),
		{
			...size,
		},
	);
};

export default OpengraphImage;
