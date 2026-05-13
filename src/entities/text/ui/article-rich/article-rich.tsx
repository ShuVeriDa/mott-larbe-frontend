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
import {
	renderRichContent,
	type RichSegment,
} from "../../lib/render-rich-content";
import { ArticleToken } from "../article-token";

export interface HighlightMark {
	id: string;
	selectedText: string;
	color: string;
}

export interface NoteMark {
	id: string;
	selectedText: string;
	isActive: boolean;
}

export interface ArticleRichProps {
	contentRich: unknown;
	tokens: readonly TextToken[];
	activeTokenId?: string | null;
	onSelectToken: (token: TextToken, event: MouseEvent<HTMLSpanElement>) => void;
	className?: string;
	maxWidth?: string;
	letterSpacing?: string;
	paragraphSpacing?: string;
	ref?: Ref<HTMLDivElement>;
	highlights?: HighlightMark[];
	noteMarks?: NoteMark[];
	onNoteGroupClick?: (noteIds: string[], x: number, y: number) => void;
}

const NOTE_COLOR_INACTIVE = "#fef9c3";
const NOTE_COLOR_ACTIVE = "#fde68a";

type HlRange = {
	start: number;
	end: number;
	color: string;
	id: string;
	isNote?: boolean;
	noteId?: string;
};

const computeHighlightRanges = (
	paraText: string,
	highlights: HighlightMark[],
): HlRange[] => {
	const ranges: HlRange[] = [];
	for (const h of highlights) {
		if (!h.selectedText) continue;
		let from = 0;
		while (from < paraText.length) {
			const idx = paraText.indexOf(h.selectedText, from);
			if (idx === -1) break;
			ranges.push({
				start: idx,
				end: idx + h.selectedText.length,
				color: h.color,
				id: h.id,
			});
			from = idx + h.selectedText.length;
		}
	}
	ranges.sort(
		(a, b) => a.start - b.start || b.end - b.start - (a.end - a.start),
	);
	return ranges.filter(
		(r, i) =>
			!ranges.some(
				(other, j) =>
					j !== i && other.start <= r.start && other.end >= r.end && j > i,
			),
	);
};

const computeNoteRanges = (paraText: string, notes: NoteMark[]): HlRange[] => {
	const ranges: HlRange[] = [];
	for (const n of notes) {
		if (!n.selectedText) continue;
		let from = 0;
		while (from < paraText.length) {
			const idx = paraText.indexOf(n.selectedText, from);
			if (idx === -1) break;
			ranges.push({
				start: idx,
				end: idx + n.selectedText.length,
				color: n.isActive ? NOTE_COLOR_ACTIVE : NOTE_COLOR_INACTIVE,
				id: `note-${n.id}`,
				isNote: true,
				noteId: n.id,
			});
			from = idx + n.selectedText.length;
		}
	}
	return ranges;
};

const mergeRanges = (hlRanges: HlRange[], noteRanges: HlRange[]): HlRange[] =>
	[...hlRanges, ...noteRanges].sort((a, b) => a.start - b.start);

const makeMarkProps = (
	r: HlRange,
): { style: CSSProperties; className: string; "data-note-id"?: string } => ({
	style: {
		backgroundColor: r.color,
		borderRadius: "2px",
		padding: "0 1px",
		...(r.isNote ? { cursor: "pointer" } : { color: "var(--reader-hl-fg)" }),
	},
	className: r.isNote
		? "reader-article-note-highlight"
		: "reader-article-highlight",
	...(r.isNote && r.noteId ? { "data-note-id": r.noteId } : {}),
});

const renderSegmentsWithHighlights = (
	segments: RichSegment[],
	allRanges: HlRange[],
	activeTokenId: string | null | undefined,
	onSelectToken: (token: TextToken, event: MouseEvent<HTMLSpanElement>) => void,
): ReactNode[] => {
	const nodes: ReactNode[] = [];
	let paraOffset = 0;
	let keyCounter = 0;

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
			const hlForToken = allRanges.find(
				r => r.start <= segStart && segEnd <= r.end,
			);
			if (hlForToken) {
				const wrapped = hasMarks(seg.marks)
					? wrapMarksAround(tokenEl, seg.marks, keyCounter++)
					: tokenEl;
				nodes.push(
					<mark key={keyCounter++} {...makeMarkProps(hlForToken)}>
						{wrapped}
					</mark>,
				);
			} else {
				nodes.push(
					hasMarks(seg.marks)
						? wrapMarksAround(tokenEl, seg.marks, keyCounter++)
						: tokenEl,
				);
			}
			paraOffset += segLen;
			continue;
		}

		const overlapping = allRanges.filter(
			r => r.start < segEnd && r.end > segStart,
		);

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
						{wrapMarks(
							segText.slice(cursor, relStart),
							seg.marks,
							keyCounter++,
						)}
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
	paragraphSpacing,
	ref,
	highlights = [],
	noteMarks = [],
	onNoteGroupClick,
}: ArticleRichProps) => {
	const paragraphs = renderRichContent(contentRich, tokens);

	return (
		<div
			ref={ref}
			className={cn("text-t-1 mx-auto", className)}
			data-article-rich="true"
			style={{
				maxWidth,
				fontSize: "var(--reader-font-size, 17px)",
				lineHeight: "var(--reader-line-height, 1.85)",
				letterSpacing: letterSpacing ?? "0.01em",
			}}
		>
			{paragraphs.map((para, idx) => {
				const paraText = para.segments.map(s => s.value).join("");
				const hlRanges = highlights.length
					? computeHighlightRanges(paraText, highlights)
					: [];
				const nRanges = noteMarks.length
					? computeNoteRanges(paraText, noteMarks)
					: [];
				const allRanges = mergeRanges(hlRanges, nRanges);
				const isLast = idx === paragraphs.length - 1;

				const isBlockquote = para.blockType === "blockquote";
				const Tag = isBlockquote ? "blockquote" : "p";

				const content = allRanges.length
					? renderSegmentsWithHighlights(
							para.segments,
							allRanges,
							activeTokenId,
							onSelectToken,
						)
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
						});

				return (
					<Tag
						key={idx}
						className={cn(
							isBlockquote && "border-l-[3px] border-acc/40 pl-4 text-t-1",
						)}
						style={{
							textAlign: para.textAlign,
							marginBottom: isLast ? 0 : (paragraphSpacing ?? "1.25rem"),
						}}
					>
						{content}
					</Tag>
				);
			})}
		</div>
	);
};

const hasMarks = (marks: {
	bold?: boolean;
	italic?: boolean;
	color?: string;
}) => marks.bold || marks.italic || !!marks.color;

const wrapMarks = (
	text: string,
	marks: { bold?: boolean; italic?: boolean; color?: string },
	key: number,
): ReactNode => {
	const style: CSSProperties = marks.color ? { color: marks.color } : {};
	if (marks.bold && marks.italic)
		return (
			<strong key={key}>
				<em style={style}>{text}</em>
			</strong>
		);
	if (marks.bold)
		return (
			<strong key={key} style={style}>
				{text}
			</strong>
		);
	if (marks.italic)
		return (
			<em key={key} style={style}>
				{text}
			</em>
		);
	if (marks.color)
		return (
			<span key={key} style={style}>
				{text}
			</span>
		);
	return text;
};

const wrapMarksAround = (
	child: ReactNode,
	marks: { bold?: boolean; italic?: boolean; color?: string },
	key: number,
): ReactNode => {
	const style: CSSProperties = marks.color ? { color: marks.color } : {};
	if (marks.bold && marks.italic)
		return (
			<strong key={key}>
				<em style={style}>{child}</em>
			</strong>
		);
	if (marks.bold)
		return (
			<strong key={key} style={style}>
				{child}
			</strong>
		);
	if (marks.italic)
		return (
			<em key={key} style={style}>
				{child}
			</em>
		);
	if (marks.color)
		return (
			<span key={key} style={style}>
				{child}
			</span>
		);
	return child;
};
