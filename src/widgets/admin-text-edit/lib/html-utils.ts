type TipTapMark = { type: string };
type TipTapNode = {
	type: string;
	text?: string;
	marks?: TipTapMark[];
	attrs?: Record<string, unknown>;
	content?: TipTapNode[];
};

// ── TipTap → HTML (for loading existing content into editor) ──

const escapeHtml = (str: string): string =>
	str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const inlinesToHtml = (nodes: TipTapNode[] = []): string =>
	nodes
		.map((node) => {
			if (node.type === "text") {
				let text = escapeHtml(node.text ?? "");
				const marks = node.marks ?? [];
				if (marks.some((m) => m.type === "bold")) text = `<strong>${text}</strong>`;
				if (marks.some((m) => m.type === "italic")) text = `<em>${text}</em>`;
				if (marks.some((m) => m.type === "underline")) text = `<u>${text}</u>`;
				return text;
			}
			return inlinesToHtml(node.content);
		})
		.join("");

const blocksToHtml = (nodes: TipTapNode[] = []): string =>
	nodes
		.map((node) => {
			switch (node.type) {
				case "paragraph":
					return `<p>${inlinesToHtml(node.content)}</p>`;
				case "heading": {
					const lvl = (node.attrs?.level as number) ?? 2;
					return `<h${lvl}>${inlinesToHtml(node.content)}</h${lvl}>`;
				}
				case "blockquote":
					return `<blockquote>${blocksToHtml(node.content)}</blockquote>`;
				case "bulletList": {
					const items = (node.content ?? [])
						.map((li) => `<li>${inlinesToHtml(li.content?.[0]?.content)}</li>`)
						.join("");
					return `<ul>${items}</ul>`;
				}
				case "orderedList": {
					const items = (node.content ?? [])
						.map((li) => `<li>${inlinesToHtml(li.content?.[0]?.content)}</li>`)
						.join("");
					return `<ol>${items}</ol>`;
				}
				default:
					return "";
			}
		})
		.join("");

export const tiptapToHtml = (doc: { type: string; content?: unknown[] }): string => {
	if (!doc?.content?.length) return "";
	return blocksToHtml(doc.content as TipTapNode[]);
};

// ── HTML → TipTap (for saving edited content) ──

const inlineToNodes = (el: Element): TipTapNode[] => {
	const nodes: TipTapNode[] = [];
	el.childNodes.forEach((child) => {
		if (child.nodeType === Node.TEXT_NODE) {
			const text = child.textContent ?? "";
			if (text) nodes.push({ type: "text", text });
		} else if (child.nodeType === Node.ELEMENT_NODE) {
			const tag = (child as Element).tagName.toLowerCase();
			const inner = inlineToNodes(child as Element);
			const marks: TipTapMark[] = [];
			if (tag === "b" || tag === "strong") marks.push({ type: "bold" });
			if (tag === "i" || tag === "em") marks.push({ type: "italic" });
			if (tag === "u") marks.push({ type: "underline" });

			if (marks.length > 0) {
				inner.forEach((n) => {
					if (n.type === "text") {
						const tn = n as typeof n & { marks?: TipTapMark[] };
						nodes.push({ ...tn, marks: [...(tn.marks ?? []), ...marks] });
					} else {
						nodes.push(n);
					}
				});
			} else {
				nodes.push(...inner);
			}
		}
	});
	return nodes;
};

const blockToNodes = (container: Element): TipTapNode[] => {
	const nodes: TipTapNode[] = [];
	container.childNodes.forEach((child) => {
		if (child.nodeType === Node.TEXT_NODE) {
			const text = (child.textContent ?? "").trim();
			if (text) nodes.push({ type: "paragraph", content: [{ type: "text", text }] });
			return;
		}
		if (child.nodeType !== Node.ELEMENT_NODE) return;
		const el = child as Element;
		const tag = el.tagName.toLowerCase();

		switch (tag) {
			case "p": {
				const content = inlineToNodes(el);
				nodes.push({ type: "paragraph", content: content.length ? content : undefined });
				break;
			}
			case "h2":
				nodes.push({ type: "heading", attrs: { level: 2 }, content: inlineToNodes(el) });
				break;
			case "h3":
				nodes.push({ type: "heading", attrs: { level: 3 }, content: inlineToNodes(el) });
				break;
			case "blockquote":
				nodes.push({ type: "blockquote", content: blockToNodes(el) });
				break;
			case "ul": {
				const items = Array.from(el.children).map((li) => ({
					type: "listItem",
					content: [{ type: "paragraph", content: inlineToNodes(li) }],
				}));
				nodes.push({ type: "bulletList", content: items });
				break;
			}
			case "ol": {
				const items = Array.from(el.children).map((li) => ({
					type: "listItem",
					content: [{ type: "paragraph", content: inlineToNodes(li) }],
				}));
				nodes.push({ type: "orderedList", content: items });
				break;
			}
			case "div":
			case "section":
				nodes.push(...blockToNodes(el));
				break;
			default:
				nodes.push({ type: "paragraph", content: inlineToNodes(el) });
				break;
		}
	});
	return nodes;
};

export const htmlToTipTap = (html: string): { type: string; content?: TipTapNode[] } => {
	if (!html || html === "<br>" || html === "<p><br></p>") {
		return { type: "doc", content: [{ type: "paragraph" }] };
	}
	const tmp = document.createElement("div");
	tmp.innerHTML = html;
	const content = blockToNodes(tmp);
	return { type: "doc", content: content.length ? content : [{ type: "paragraph" }] };
};

// ── Text stats ──

export const countWordsInHtml = (html: string): number => {
	if (!html) return 0;
	const tmp = document.createElement("div");
	tmp.innerHTML = html;
	const text = (tmp.innerText || tmp.textContent || "").trim();
	return text ? text.split(/\s+/).length : 0;
};

export const countCharsInHtml = (html: string): number => {
	if (!html) return 0;
	const tmp = document.createElement("div");
	tmp.innerHTML = html;
	return (tmp.innerText || tmp.textContent || "").length;
};

export const countParagraphsInHtml = (html: string): number => {
	if (!html) return 0;
	const tmp = document.createElement("div");
	tmp.innerHTML = html;
	return tmp.querySelectorAll("p, h2, h3, li").length || 1;
};

export const countWordsInRaw = (raw: string): number => {
	if (!raw) return 0;
	return raw.trim().split(/\s+/).filter(Boolean).length;
};
