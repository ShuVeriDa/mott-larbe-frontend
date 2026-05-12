"use client";

import { cn } from "@/shared/lib/cn";
import {
	Fragment,
	type CSSProperties,
	type MouseEvent,
	type ReactNode,
	type Ref,
} from "react";
import type { TextToken } from "../../api";
import { renderRichContent, type RichSegment } from "../../lib/render-rich-content";
import { ArticleToken } from "../article-token";

export interface HighlightMark {
	id: string;
	selectedText: string;
	color: string;
}

export interface ArticleRichProps {
	contentRich: unknown;
	tokens: readonly TextToken[];
	activeTokenId?: string | null;
	onSelectToken: (token: TextToken, event: MouseEvent<HTMLSpanElement>) => void;
	className?: string;
	maxWidth?: string;
	letterSpacing?: string;
	ref?: Ref<HTMLDivElement>;
	highlights?: HighlightMark[];
}

type HlRange = { start: number; end: number; color: string; id: string };

const computeHighlightRanges = (paraText: string, highlights: HighlightMark[]): HlRange[] => {
	const ranges: HlRange[] = [];
	for (const h of highlights) {
		if (!h.selectedText) continue;
		let from = 0;
		while (from < paraText.length) {
			const idx = paraText.indexOf(h.selectedText, from);
			if (idx === -1) break;
			ranges.push({ start: idx, end: idx + h.selectedText.length, color: h.color, id: h.id });
			from = idx + h.selectedText.length;
		}
	}
	// Sort by start, then by length descending (longer = lower priority, shorter on top)
	ranges.sort((a, b) => a.start - b.start || (b.end - b.start) - (a.end - a.start));
	// Remove fully-contained duplicates — keep the one that was added later (shorter/newer)
	return ranges.filter((r, i) =>
		!ranges.some((other, j) => j !== i && other.start <= r.start && other.end >= r.end && j > i),
	);
};

const renderSegmentsWithHighlights = (
	segments: RichSegment[],
	hlRanges: HlRange[],
	activeTokenId: string | null | undefined,
	onSelectToken: (token: TextToken, event: MouseEvent<HTMLSpanElement>) => void,
): ReactNode[] => {
	const nodes: ReactNode[] = [];
	let paraOffset = 0;
	let keyCounter = 0;

	const makeMarkProps = (r: HlRange) => ({
		style: {
			backgroundColor: r.color,
			borderRadius: "2px",
			padding: "0 1px",
			color: "var(--reader-hl-fg)",
		} as CSSProperties,
		className: "reader-article-highlight",
	});

	for (const seg of segments) {
		const segText = seg.value;
		const segLen = segText.length;
		const segStart = paraOffset;
		const segEnd = paraOffset + segLen;

		if (seg.kind === "text" && segText === "\n") {
			nodes.push(<br key={keyCounter++} />);
			paraOffset += segLen;
			continue;
		}

		if (seg.kind === "token") {
			const tokenEl = (
				<ArticleToken
					key={seg.token!.id}
					token={seg.token!}
					active={activeTokenId === seg.token!.id}
					onSelect={onSelectToken}
				/>
			);
			const hlForToken = hlRanges.find(r => r.start <= segStart && segEnd <= r.end);
			if (hlForToken) {
				nodes.push(
					<mark key={keyCounter++} {...makeMarkProps(hlForToken)}>
						{hasMarks(seg.marks) ? wrapMarksAround(tokenEl, seg.marks, keyCounter++) : tokenEl}
					</mark>,
				);
			} else {
				nodes.push(hasMarks(seg.marks) ? wrapMarksAround(tokenEl, seg.marks, keyCounter++) : tokenEl);
			}
			paraOffset += segLen;
			continue;
		}

		const overlapping = hlRanges.filter(r => r.start < segEnd && r.end > segStart);

		if (!overlapping.length) {
			nodes.push(
				<Fragment key={keyCounter++}>
					{wrapMarks(segText, seg.marks, keyCounter++)}
				</Fragment>,
			);
			paraOffset += segLen;
			continue;
		}

		let cursor = 0;
		for (const r of overlapping) {
			const relStart = Math.max(0, r.start - segStart);
			const relEnd = Math.min(segLen, r.end - segStart);
			if (cursor < relStart) {
				nodes.push(
					<Fragment key={keyCounter++}>
						{wrapMarks(segText.slice(cursor, relStart), seg.marks, keyCounter++)}
					</Fragment>,
				);
			}
			nodes.push(
				<mark key={keyCounter++} {...makeMarkProps(r)}>
					{wrapMarks(segText.slice(relStart, relEnd), seg.marks, keyCounter++)}
				</mark>,
			);
			cursor = relEnd;
		}
		if (cursor < segLen) {
			nodes.push(
				<Fragment key={keyCounter++}>
					{wrapMarks(segText.slice(cursor), seg.marks, keyCounter++)}
				</Fragment>,
			);
		}

		paraOffset += segLen;
	}

	return nodes;
};

export const ArticleRich = ({
	contentRich,
	tokens,
	activeTokenId,
	onSelectToken,
	className,
	maxWidth = "680px",
	letterSpacing,
	ref,
	highlights = [],
}: ArticleRichProps) => {
	const paragraphs = renderRichContent(contentRich, tokens);

	return (
		<div
			ref={ref}
			className={cn("text-t-1 mx-auto", className)}
			style={{
				maxWidth,
				fontSize: "var(--reader-font-size, 17px)",
				lineHeight: "var(--reader-line-height, 1.85)",
				letterSpacing: letterSpacing ?? "0.01em",
			}}
		>
			{paragraphs.map((para, idx) => {
				const paraText = para.segments.map(s => s.value).join("");
				const hlRanges = highlights.length ? computeHighlightRanges(paraText, highlights) : [];

				return (
					<p
						key={idx}
						className="mb-5 last:mb-0 tracking-[0.01em]"
						style={{ textAlign: para.textAlign }}
					>
						{hlRanges.length
							? renderSegmentsWithHighlights(para.segments, hlRanges, activeTokenId, onSelectToken)
							: para.segments.map((seg, segIdx) => {
								if (seg.kind === "text") {
									if (seg.value === "\n") return <br key={segIdx} />;
									return (
										<Fragment key={segIdx}>
											{wrapMarks(seg.value, seg.marks, segIdx)}
										</Fragment>
									);
								}
								const tokenEl = (
									<ArticleToken
										key={seg.token!.id}
										token={seg.token!}
										active={activeTokenId === seg.token!.id}
										onSelect={onSelectToken}
									/>
								);
								return hasMarks(seg.marks)
									? wrapMarksAround(tokenEl, seg.marks, segIdx)
									: tokenEl;
							})
						}
					</p>
				);
			})}
		</div>
	);
};

const hasMarks = (marks: { bold?: boolean; italic?: boolean; color?: string }) =>
	marks.bold || marks.italic || !!marks.color;

const wrapMarks = (
	text: string,
	marks: { bold?: boolean; italic?: boolean; color?: string },
	key: number,
): ReactNode => {
	const style: CSSProperties = marks.color ? { color: marks.color } : {};
	if (marks.bold && marks.italic) return <strong key={key}><em style={style}>{text}</em></strong>;
	if (marks.bold) return <strong key={key} style={style}>{text}</strong>;
	if (marks.italic) return <em key={key} style={style}>{text}</em>;
	if (marks.color) return <span key={key} style={style}>{text}</span>;
	return text;
};

const wrapMarksAround = (
	child: ReactNode,
	marks: { bold?: boolean; italic?: boolean; color?: string },
	key: number,
): ReactNode => {
	const style: CSSProperties = marks.color ? { color: marks.color } : {};
	if (marks.bold && marks.italic) return <strong key={key}><em style={style}>{child}</em></strong>;
	if (marks.bold) return <strong key={key} style={style}>{child}</strong>;
	if (marks.italic) return <em key={key} style={style}>{child}</em>;
	if (marks.color) return <span key={key} style={style}>{child}</span>;
	return child;
};
