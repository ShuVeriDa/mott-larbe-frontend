import type { WordLookupExample } from "@/entities/word";

export interface WordExamplesListProps {
	fallback: readonly WordLookupExample[];
	highlight: string;
}

const escapeRegExp = (value: string) =>
	value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const HighlightedText = ({ text, highlight }: { text: string; highlight: string }) => {
	if (!highlight) return <>{text}</>;
	const parts = text.split(new RegExp(`(${escapeRegExp(highlight)})`, "gi"));
	return (
		<>
			{parts.map((part, i) =>
				part.toLowerCase() === highlight.toLowerCase() ? (
					<span key={i} className="text-acc font-medium">{part}</span>
				) : (
					part
				),
			)}
		</>
	);
};

export const WordExamplesList = ({
	fallback,
	highlight,
}: WordExamplesListProps) => {
	if (!fallback.length) return null;

	return (
		<div className="space-y-2.5">
			{fallback.map((example, idx) => (
				<div key={idx}>
					<div className="text-[13px] leading-[1.6] text-t-1">
						<HighlightedText text={example.text} highlight={highlight} />
					</div>
					{example.translation ? (
						<div className="text-[12px] italic text-t-3">
							{example.translation}
						</div>
					) : null}
				</div>
			))}
		</div>
	);
};
