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
import type { PhraseMap } from "@/features/phrase-lookup";
import type { PagePhraseOccurrence } from "@/entities/admin-text-phrase";
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
	phraseMap?: PhraseMap;
	onSelectPhrase?: (phrase: PagePhraseOccurrence, anchor: { left: number; top: number; width: number; height: number }) => void;
}

// ── Highlight ranges ──────────────────────────────────────────────────────────

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
			ranges.push({ start: idx, end: idx + h.selectedText.length, color: h.color, id: h.id });
			from = idx + h.selectedText.length;
		}
	}
	ranges.sort((a, b) => a.start - b.start || b.end - b.start - (a.end - a.start));
	return ranges.filter(
		(r, i) => !ranges.some((other, j) => j !== i && other.start <= r.start && other.end >= r.end && j > i),
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

const makeMarkProps = (r: HlRange): { style: CSSProperties; className: string; "data-note-id"?: string } => ({
	style: {
		backgroundColor: r.color,
		borderRadius: "2px",
		padding: "0 1px",
		...(r.isNote ? { cursor: "pointer" } : { color: "var(--reader-hl-fg)" }),
	},
	className: r.isNote ? "reader-article-note-highlight" : "reader-article-highlight",
	...(r.isNote && r.noteId ? { "data-note-id": r.noteId } : {}),
});

// ── Paragraph component ───────────────────────────────────────────────────────
// Stateful so we can group phrase segments and wrap them in a single element.

interface ParagraphProps {
	segments: RichSegment[];
	allRanges: HlRange[];
	activeTokenId: string | null | undefined;
	onSelectToken: (token: TextToken, event: MouseEvent<HTMLSpanElement>) => void;
	phraseMap?: PhraseMap;
	onSelectPhrase?: (phrase: PagePhraseOccurrence, anchor: { left: number; top: number; width: number; height: number }) => void;
	tag: "p" | "blockquote";
	className?: string;
	style?: CSSProperties;
}

const Paragraph = ({
	segments,
	allRanges,
	activeTokenId,
	onSelectToken,
	phraseMap,
	onSelectPhrase,
	tag: Tag,
	className,
	style,
}: ParagraphProps) => {
	const nodes: ReactNode[] = [];
	let paraOffset = 0;
	let keyCounter = 0;
	let lastTokenPosition: number | null = null;

	// Buffer for current phrase group
	type PhraseSegment = { node: ReactNode; kind: "token" | "gap" };
	let phraseBuffer: PhraseSegment[] = [];
	let currentPhrase: PagePhraseOccurrence | null = null;

	const flushPhrase = () => {
		if (!currentPhrase || !phraseBuffer.length || !onSelectPhrase) return;
		const phraseId = currentPhrase.id;
		const phrase = currentPhrase;
		const handleGapClick = (e: MouseEvent<HTMLSpanElement>) => {
			e.stopPropagation();
			const rect = e.currentTarget.closest("[data-phrase]")?.getBoundingClientRect()
				?? e.currentTarget.getBoundingClientRect();
			onSelectPhrase(phrase, { left: rect.left, top: rect.top, width: rect.width, height: rect.height });
		};

		nodes.push(
			<span key={keyCounter++} data-phrase={phraseId} className="cursor-pointer rounded-sm">
				{phraseBuffer.map((seg, i) =>
					seg.kind === "gap" ? (
						<span
							key={i}
							data-phrase-gap={phraseId}
							onClick={handleGapClick}
						>
							{seg.node}
						</span>
					) : (
						<span key={i} data-phrase-token={phraseId}>
							{seg.node}
						</span>
					),
				)}
			</span>,
		);

		phraseBuffer = [];
		currentPhrase = null;
	};

	for (const seg of segments) {
		const segText = seg.value;
		const segLen = segText.length;
		const segStart = paraOffset;
		const segEnd = paraOffset + segLen;

		// Newline
		if (seg.kind === "text" && segText === "\n") {
			flushPhrase();
			nodes.push(<br key={keyCounter++} />);
			paraOffset += segLen;
			continue;
		}

		// Token segment
		if (seg.kind === "token") {
			const tok = seg.token!;
			const tokPhrase = phraseMap?.get(tok.position) ?? null;

			// Flush if switching to a different phrase
			if (currentPhrase && tokPhrase?.id !== currentPhrase.id) flushPhrase();

			// Start new phrase
			if (tokPhrase && onSelectPhrase && !currentPhrase) currentPhrase = tokPhrase;

			const hlForToken = allRanges.find(r => r.start <= segStart && segEnd <= r.end);
			const tokenEl = (
				<ArticleToken
					key={tok.id}
					token={tok}
					active={activeTokenId === tok.id}
					onSelect={onSelectToken}
				/>
			);
			const wrapped = hlForToken
				? <mark key={keyCounter++} {...makeMarkProps(hlForToken)}>{hasMarks(seg.marks) ? wrapMarksAround(tokenEl, seg.marks, keyCounter++) : tokenEl}</mark>
				: (hasMarks(seg.marks) ? wrapMarksAround(tokenEl, seg.marks, keyCounter++) : tokenEl);

			if (currentPhrase) {
				phraseBuffer.push({ node: wrapped, kind: "token" });
			} else {
				nodes.push(wrapped);
			}
			lastTokenPosition = tok.position;
			paraOffset += segLen;
			continue;
		}

		// Text/gap segment — check if inside a phrase
		const gapPhrase = (phraseMap && onSelectPhrase && lastTokenPosition !== null && !segText.includes("\n"))
			? phraseMap.get(lastTokenPosition)
			: null;
		const isInsidePhrase = gapPhrase && gapPhrase.endTokenPosition > lastTokenPosition!;

		if (isInsidePhrase) {
			if (!currentPhrase) currentPhrase = gapPhrase!;
			phraseBuffer.push({ node: segText, kind: "gap" });
			paraOffset += segLen;
			continue;
		}

		// Not inside phrase — flush any open buffer first
		if (currentPhrase) flushPhrase();

		// Normal text with possible highlights
		const overlapping = allRanges.filter(r => r.start < segEnd && r.end > segStart);

		if (!overlapping.length) {
			nodes.push(<Fragment key={keyCounter++}>{wrapMarks(segText, seg.marks, keyCounter++)}</Fragment>);
			paraOffset += segLen;
			continue;
		}

		let cursor = 0;
		for (const r of overlapping) {
			const relStart = Math.max(0, r.start - segStart);
			const relEnd = Math.min(segLen, r.end - segStart);
			if (cursor < relStart) {
				nodes.push(<Fragment key={keyCounter++}>{wrapMarks(segText.slice(cursor, relStart), seg.marks, keyCounter++)}</Fragment>);
			}
			nodes.push(
				<mark key={keyCounter++} {...makeMarkProps(r)}>
					{wrapMarks(segText.slice(relStart, relEnd), seg.marks, keyCounter++)}
				</mark>,
			);
			cursor = relEnd;
		}
		if (cursor < segLen) {
			nodes.push(<Fragment key={keyCounter++}>{wrapMarks(segText.slice(cursor), seg.marks, keyCounter++)}</Fragment>);
		}
		paraOffset += segLen;
	}

	flushPhrase();

	return <Tag className={className} style={style}>{nodes}</Tag>;
};

// ── ArticleRich ───────────────────────────────────────────────────────────────

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
	phraseMap,
	onSelectPhrase,
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
				const hlRanges = highlights.length ? computeHighlightRanges(paraText, highlights) : [];
				const nRanges = noteMarks.length ? computeNoteRanges(paraText, noteMarks) : [];
				const allRanges = mergeRanges(hlRanges, nRanges);
				const isLast = idx === paragraphs.length - 1;
				const isBlockquote = para.blockType === "blockquote";

				return (
					<Paragraph
						key={idx}
						segments={para.segments}
						allRanges={allRanges}
						activeTokenId={activeTokenId}
						onSelectToken={onSelectToken}
						phraseMap={phraseMap}
						onSelectPhrase={onSelectPhrase}
						tag={isBlockquote ? "blockquote" : "p"}
						className={cn(isBlockquote && "border-l-[3px] border-acc/40 pl-4 text-t-1")}
						style={{
							textAlign: para.textAlign,
							marginBottom: isLast ? 0 : (paragraphSpacing ?? "1.25rem"),
						}}
					/>
				);
			})}
		</div>
	);
};

// ── Helpers ───────────────────────────────────────────────────────────────────

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
