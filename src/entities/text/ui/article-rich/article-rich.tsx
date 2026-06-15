"use client";

import { cn } from "@/shared/lib/cn";
import { motion } from "framer-motion";
import { variants } from "@/shared/lib/animation";
import {
	Fragment,
	type CSSProperties,
	type MouseEvent,
	type ReactNode,
	type Ref,
} from "react";
import type { TextToken, TipTapDoc } from "../../api";
import {
	renderRichContent,
	type RichSegment,
} from "../../lib/render-rich-content";
import { ArticleToken } from "../article-token";
import type { PhraseMap } from "@/entities/admin-text-phrase";
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
	contentRich: TipTapDoc;
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
	phraseColorVisible?: boolean;
	pageNumber?: number;
	displayOnly?: boolean;
	isRtl?: boolean;
	cyrillicRaw?: string;
	cyrillicContentRich?: TipTapDoc;
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
		...(r.isNote
			? { cursor: "pointer" }
			: { color: "var(--reader-hl-fg)", animation: "highlightFadeIn 0.15s ease" }),
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
	phraseColorVisible?: boolean;
	tag: "p" | "blockquote" | "h1" | "h2" | "h3" | "h4";
	className?: string;
	style?: CSSProperties;
	displayOnly?: boolean;
	isRtl?: boolean;
	cyrillicParaText?: string;
}

const PHRASE_HIGHLIGHT_COLOR = "rgba(167, 139, 250, 0.18)"; // violet-400/18

const Paragraph = ({
	segments,
	allRanges,
	activeTokenId,
	onSelectToken,
	phraseMap,
	onSelectPhrase,
	phraseColorVisible,
	tag: Tag,
	className,
	style,
	displayOnly,
	isRtl,
	cyrillicParaText,
}: ParagraphProps) => {
	const nodes: ReactNode[] = [];
	// When displaying non-Cyrillic script, allRanges positions are relative to
	// cyrillicParaText. We track a parallel cyrillicOffset alongside paraOffset.
	let paraOffset = 0;
	let cyrillicOffset = 0;
	let keyCounter = 0;
	let lastTokenPosition: number | null = null;
	let lastToken: TextToken | null = null;

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
			<span
				key={keyCounter++}
				data-phrase={phraseId}
				className="cursor-pointer rounded-sm"
				style={phraseColorVisible ? { backgroundColor: PHRASE_HIGHLIGHT_COLOR, borderRadius: "3px", padding: "0 1px" } : undefined}
			>
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

	for (let segIdx = 0; segIdx < segments.length; segIdx++) {
		const seg = segments[segIdx];
		const segText = seg.value;
		const segLen = segText.length;
		const segStart = paraOffset;
		const segEnd = paraOffset + segLen;

		// When non-Cyrillic script, ranges are keyed to cyrillicParaText positions.
		// cyrillicSegLen is the Cyrillic length of this segment for offset tracking.
		const cyrillicSegLen = cyrillicParaText
			? (seg.kind === "token" ? seg.token!.original.length : segLen)
			: segLen;
		const cyrillicSegStart = cyrillicOffset;
		const cyrillicSegEnd = cyrillicOffset + cyrillicSegLen;

		// Use Cyrillic positions for range matching when available
		const rangeStart = cyrillicParaText ? cyrillicSegStart : segStart;
		const rangeEnd = cyrillicParaText ? cyrillicSegEnd : segEnd;

		// Newline
		if (seg.kind === "text" && segText === "\n") {
			flushPhrase();
			nodes.push(<br key={keyCounter++} />);
			paraOffset += segLen;
			cyrillicOffset += cyrillicSegLen;
			continue;
		}

		// Token segment — look ahead to collect any trailing superscript segments
		if (seg.kind === "token") {
			const tok = seg.token!;
			const tokPhrase = phraseMap?.get(tok.position) ?? null;

			// Flush if switching to a different phrase
			if (currentPhrase && tokPhrase?.id !== currentPhrase.id) flushPhrase();

			// Start new phrase
			if (tokPhrase && onSelectPhrase && !currentPhrase) currentPhrase = tokPhrase;

			// Collect trailing superscript segments that belong to this token
			const supParts: RichSegment[] = [];
			let lookahead = segIdx + 1;
			while (lookahead < segments.length && segments[lookahead].kind === "text" && segments[lookahead].marks.superscript) {
				supParts.push(segments[lookahead]);
				lookahead++;
			}

			const hlForToken = allRanges.find(r => r.start <= rangeStart && rangeEnd <= r.end);
			const tokenEl = (
				<ArticleToken
					key={tok.id}
					token={tok}
					displayText={seg.value !== tok.original ? seg.value : undefined}
					active={activeTokenId === tok.id}
					onSelect={onSelectToken}
				>
					{supParts.map((s, i) => <sup key={i}>{s.value}</sup>)}
				</ArticleToken>
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
			lastToken = tok;
			paraOffset += segLen;
			cyrillicOffset += cyrillicSegLen;
			// Skip the superscript segments we already consumed
			for (const s of supParts) paraOffset += s.value.length;
			segIdx += supParts.length;
			continue;
		}

		// Superscript text segment not preceded by token (shouldn't normally occur, skip)
		if (seg.kind === "text" && seg.marks.superscript) {
			paraOffset += segLen;
			cyrillicOffset += cyrillicSegLen;
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
			cyrillicOffset += cyrillicSegLen;
			continue;
		}

		// Not inside phrase — flush any open buffer first
		if (currentPhrase) flushPhrase();

		// Normal text with possible highlights (use Cyrillic positions for range lookup)
		const overlapping = allRanges.filter(r => r.start < rangeEnd && r.end > rangeStart);

		if (!overlapping.length) {
			const inner = wrapMarks(segText, seg.marks, keyCounter++);
			nodes.push(
				displayOnly
					? <bdi key={keyCounter++}>{inner}</bdi>
					: <Fragment key={keyCounter++}>{inner}</Fragment>
			);
			paraOffset += segLen;
			cyrillicOffset += cyrillicSegLen;
			continue;
		}

		// For text segments, slicing uses display text positions (segStart/segEnd).
		// When cyrillicParaText is set, map Cyrillic range positions back to display offsets.
		// Since punctuation is identical across scripts, the lengths match for text segments.
		let cursor = 0;
		for (const r of overlapping) {
			const relStart = Math.max(0, r.start - rangeStart);
			const relEnd = Math.min(cyrillicSegLen, r.end - rangeStart);
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
		cyrillicOffset += cyrillicSegLen;
	}

	flushPhrase();

	return <Tag className={className} style={style}>{nodes}</Tag>;
};

const HEADING_STYLES: Record<number, CSSProperties> = {
	1: { fontSize: "1.75em", fontWeight: 700, lineHeight: 1.25 },
	2: { fontSize: "1.4em", fontWeight: 700, lineHeight: 1.3 },
	3: { fontSize: "1.15em", fontWeight: 600, lineHeight: 1.35 },
	4: { fontSize: "1em", fontWeight: 600, lineHeight: 1.4 },
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
	phraseColorVisible = false,
	pageNumber,
	displayOnly,
	isRtl = false,
	cyrillicRaw,
	cyrillicContentRich,
}: ArticleRichProps) => {
	const paragraphs = renderRichContent(contentRich, tokens, displayOnly, cyrillicRaw, cyrillicContentRich);

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
			<motion.div
				key={pageNumber}
				variants={variants.staggerContainer}
				initial="hidden"
				animate="visible"
			>
				{paragraphs.map((para, idx) => {
					const paraText = para.segments.map(s => s.value).join("");
					// For non-Cyrillic scripts, highlights/notes are stored as Cyrillic text.
					// cyrillicText comes from Cyrillic TipTap nodes — same character positions
					// as what was used when storing the highlight's selectedText.
					const hlSearchText = para.cyrillicText ?? paraText;
					const hlRanges = highlights.length ? computeHighlightRanges(hlSearchText, highlights) : [];
					const nRanges = noteMarks.length ? computeNoteRanges(hlSearchText, noteMarks) : [];
					// When cyrillicText differs from paraText (non-Cyrillic display), ranges are
					// relative to cyrillicText. Pass cyrillicText so Paragraph can do offset mapping.
					const cyrillicParaText = para.cyrillicText !== undefined ? hlSearchText : undefined;
					const allRanges = mergeRanges(hlRanges, nRanges);
					const isLast = idx === paragraphs.length - 1;
					const isBlockquote = para.blockType === "blockquote";
					const headingTag = para.headingLevel ? (`h${para.headingLevel}` as "h1" | "h2" | "h3" | "h4") : null;
					const tag = headingTag ?? (isBlockquote ? "blockquote" : "p");

					return (
						<motion.div key={idx} variants={variants.staggerItem}>
							<Paragraph
								segments={para.segments}
								allRanges={allRanges}
								activeTokenId={activeTokenId}
								onSelectToken={onSelectToken}
								phraseMap={phraseMap}
								onSelectPhrase={onSelectPhrase}
								phraseColorVisible={phraseColorVisible}
								tag={tag}
								className={cn(
									isBlockquote && "border-acc/40 text-t-1",
									isBlockquote && (isRtl ? "border-r-[3px] pr-4" : "border-l-[3px] pl-4"),
								)}
								style={{
									textAlign: isRtl && para.textAlign === "left" ? "right" : para.textAlign,
									marginBottom: isLast ? 0 : (paragraphSpacing ?? "1.25rem"),
									...(para.headingLevel ? HEADING_STYLES[para.headingLevel] : {}),
									...(para.headingFontWeight ? { fontWeight: para.headingFontWeight } : {}),
								}}
								displayOnly={displayOnly}
								isRtl={isRtl}
								cyrillicParaText={cyrillicParaText}
							/>
						</motion.div>
					);
				})}
			</motion.div>
		</div>
	);
};

// ── Helpers ───────────────────────────────────────────────────────────────────

const hasMarks = (marks: { bold?: boolean; italic?: boolean; superscript?: boolean; color?: string }) =>
	marks.bold || marks.italic || marks.superscript || !!marks.color;

const wrapMarks = (
	text: string,
	marks: { bold?: boolean; italic?: boolean; superscript?: boolean; color?: string },
	key: number,
): ReactNode => {
	const style: CSSProperties = marks.color ? { color: marks.color } : {};
	let node: ReactNode = marks.superscript ? <sup key={key}>{text}</sup> : text;
	if (marks.superscript && marks.bold) node = <strong key={key}><sup>{text}</sup></strong>;
	else if (marks.superscript && marks.italic) node = <em key={key}><sup>{text}</sup></em>;
	else if (marks.bold && marks.italic) node = <strong key={key}><em style={style}>{text}</em></strong>;
	else if (marks.bold) node = <strong key={key} style={style}>{text}</strong>;
	else if (marks.italic) node = <em key={key} style={style}>{text}</em>;
	else if (marks.color) node = <span key={key} style={style}>{text}</span>;
	return node;
};

const wrapMarksAround = (
	child: ReactNode,
	marks: { bold?: boolean; italic?: boolean; superscript?: boolean; color?: string },
	key: number,
): ReactNode => {
	const style: CSSProperties = marks.color ? { color: marks.color } : {};
	if (marks.superscript && marks.bold) return <strong key={key}><sup>{child}</sup></strong>;
	if (marks.superscript && marks.italic) return <em key={key}><sup>{child}</sup></em>;
	if (marks.superscript) return <sup key={key}>{child}</sup>;
	if (marks.bold && marks.italic) return <strong key={key}><em style={style}>{child}</em></strong>;
	if (marks.bold) return <strong key={key} style={style}>{child}</strong>;
	if (marks.italic) return <em key={key} style={style}>{child}</em>;
	if (marks.color) return <span key={key} style={style}>{child}</span>;
	return child;
};
