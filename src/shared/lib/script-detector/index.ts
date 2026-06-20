export type TextScript = "cyrillic" | "latin" | "arabic" | "mixed" | "empty";

const CYRILLIC_RE = /[Ѐ-ӿ]/;
const LATIN_RE = /[A-Za-z]/;
const ARABIC_RE = /[؀-ۿ]/;

const THRESHOLD = 0.15;

const countScript = (text: string) => {
  let cyrillic = 0;
  let latin = 0;
  let arabic = 0;
  let total = 0;

  for (const ch of text) {
    if (CYRILLIC_RE.test(ch)) { cyrillic++; total++; }
    else if (ARABIC_RE.test(ch)) { arabic++; total++; }
    else if (LATIN_RE.test(ch)) { latin++; total++; }
  }

  return { cyrillic, latin, arabic, total };
};

export const detectScript = (text: string): TextScript => {
  const clean = text.trim();
  if (!clean) return "empty";

  const { cyrillic, latin, arabic, total } = countScript(clean);
  if (total === 0) return "empty";

  const cyrRatio = cyrillic / total;
  const latRatio = latin / total;
  const arRatio = arabic / total;

  const dominant =
    cyrRatio >= 1 - THRESHOLD ? "cyrillic"
    : latRatio >= 1 - THRESHOLD ? "latin"
    : arRatio >= 1 - THRESHOLD ? "arabic"
    : "mixed";

  return dominant;
};

export type UserTextLanguage = "CHE" | "RU" | "AR" | "EN";

// Returns true if the detected script contradicts the declared language.
// Only catches obvious mismatches (e.g. Latin text declared as CHE/RU).
export const isScriptMismatch = (
  script: TextScript,
  language: UserTextLanguage,
): boolean => {
  if (script === "empty" || script === "mixed") return false;

  switch (language) {
    case "CHE":
    case "RU":
      return script === "latin" || script === "arabic";
    case "AR":
      return script === "latin" || script === "cyrillic";
    case "EN":
      return script === "cyrillic" || script === "arabic";
    default:
      return false;
  }
};

// Extract plain text from a TipTap JSON doc for script analysis.
export const extractTextFromDoc = (doc: unknown): string => {
  if (!doc || typeof doc !== "object") return "";
  const node = doc as { text?: string; content?: unknown[] };
  const parts: string[] = [];
  if (typeof node.text === "string") parts.push(node.text);
  if (Array.isArray(node.content)) {
    for (const child of node.content) {
      parts.push(extractTextFromDoc(child));
    }
  }
  return parts.join(" ");
};
