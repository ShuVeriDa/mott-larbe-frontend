const E_ROOTS: string[] = [
	"эрчавала",
	"эрмало",
	"эшийна",
	"эккха",
	"эккхо",
	"эдала",
	"эгӀа",
	"эгӀо",
	"эцна",
	"эшна",
	"эдан",
	"элча",
	"эрча",
	"этка",
	"эшо",
	"эша",
	"эца",
	"эхь",
	"эрз",
	"эго",
	"эн",
	"эр",
	"эс",
];

const CHECHEN_VOWELS = "аеёиоуыэюяАЕЁИОУЫЭЮЯ";
const CHECHEN_VOWEL_RE = new RegExp(`[${CHECHEN_VOWELS}]`);

const resolveIe = (charBefore: string, suffix: string): string => {
	const isVowelOrStart = charBefore === "" || CHECHEN_VOWEL_RE.test(charBefore);
	if (!isVowelOrStart) return "е";
	const candidate = "э" + suffix;
	for (const root of E_ROOTS) {
		if (candidate.startsWith(root)) return "э";
	}
	return "е";
};

export const modernToOld = (word: string): string | undefined => {
	const hasModern = /уо|иэ|^й[аеёиоуыэюяАЕЁИОУЫЭЮЯ]|[бвгджзклмнпрстфхцчшщьӀӏ]й[аеуяюАЕУЯЮ]|[аеёиоуыэюяАЕЁИОУЫЭЮЯ]й[аеёиоуыэюяАЕЁИОУЫЭЮЯ]/.test(word);
if (!hasModern) return undefined;

	let w = word;

	// Шаг 1: классный показатель глагола й+уо в начале (й остаётся)
	// й+иэ в начале — всегда йотация (йиэш = йеш = еш), НЕ классный показатель
	const initialYodUo = /^йуо/.test(w);

	// Шаг 2: убрать й перед иэ везде (включая начало — там это йотация)
	w = w.replace(/й(?=иэ)/g, "");

	// Шаг 3: уо → о
	w = w.replace(/уо/g, "о");

	// Шаг 4: иэ → е или э (итеративный обход, не regex — иначе второй иэ поглощается)
	{
		let out = "";
		let i = 0;
		while (i < w.length) {
			const idx = w.indexOf("иэ", i);
			if (idx === -1) {
				out += w.slice(i);
				break;
			}
			out += w.slice(i, idx);
			const charBefore = idx > 0 ? w[idx - 1] : "";
			out += resolveIe(charBefore, w.slice(idx + 2));
			i = idx + 2;
		}
		w = out;
	}

	// Шаг 5: й в начале слова
	if (!initialYodUo) {
		w = w.replace(/^йуь/, "юь");
		w = w.replace(/^йаь/, "яь");
		w = w.replace(/^йу(?!ь)/, "ю");
		w = w.replace(/^йа(?!ь)/, "я");
		w = w.replace(/^йе/, "е");
	}

	// Шаг 6: й после гласной перед гласной в середине слова
	w = w.replace(new RegExp(`(?<=[${CHECHEN_VOWELS}])йаь`, "g"), "яь");
	w = w.replace(new RegExp(`(?<=[${CHECHEN_VOWELS}])йуь`, "g"), "юь");
	w = w.replace(new RegExp(`(?<=[${CHECHEN_VOWELS}])йа(?!ь)`, "g"), "я");
	w = w.replace(new RegExp(`(?<=[${CHECHEN_VOWELS}])йу(?!ь)`, "g"), "ю");
	w = w.replace(new RegExp(`(?<=[${CHECHEN_VOWELS}])й(?=[еёэ])`, "g"), "");

	// Шаг 7: й после согласной → ъ + йотация гласной
	// йа→ъя, йаь→ъяь, йу→ъю, йуь→ъюь, йе→ъе (е уже не йотируется)
	// ь покрывает диграфы хь/чь и т.д. — последний символ диграфа
	w = w.replace(/([бвгджзклмнпрстфхцчшщь])йаь/g, "$1ъяь");
	w = w.replace(/([Ӏӏ])йаь/g, "$1ъяь");
	w = w.replace(/([бвгджзклмнпрстфхцчшщь])йуь/g, "$1ъюь");
	w = w.replace(/([Ӏӏ])йуь/g, "$1ъюь");
	w = w.replace(/([бвгджзклмнпрстфхцчшщь])йа(?!ь)/g, "$1ъя");
	w = w.replace(/([Ӏӏ])йа(?!ь)/g, "$1ъя");
	w = w.replace(/([бвгджзклмнпрстфхцчшщь])йу(?!ь)/g, "$1ъю");
	w = w.replace(/([Ӏӏ])йу(?!ь)/g, "$1ъю");
	w = w.replace(/([бвгджзклмнпрстфхцчшщь])й([еёЕЁ])/g, "$1ъ$2");
	w = w.replace(/([Ӏӏ])й([еёЕЁ])/g, "$1ъ$2");

	return w === word ? undefined : w;
};
