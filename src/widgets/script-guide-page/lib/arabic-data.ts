export interface ConsonantRow {
	cyrillic: string;
	ar1922: string;
	ar20: string;
	ipa: string;
	changed?: boolean;
}

export interface VowelRow {
	cyrillic: string;
	ar1922: string;
	short: string;
	long: string;
	start: string;
	ipa: string;
	changed?: boolean;
}

export interface ArabicExampleRow {
	cyr: string;
	ar1922: string;
	ar20: string;
	meaningKey: string;
}

export const CONSONANTS: ConsonantRow[] = [
	{ cyrillic: "Б", ar1922: "ب", ar20: "ب", ipa: "/b/" },
	{ cyrillic: "В", ar1922: "و", ar20: "و", ipa: "/v/, /w/" },
	{ cyrillic: "Г", ar1922: "گ", ar20: "گ ~ ڠ", ipa: "/g/" },
	{ cyrillic: "ГӀ", ar1922: "غ", ar20: "غ", ipa: "/ɣ/" },
	{ cyrillic: "Д", ar1922: "د", ar20: "د", ipa: "/d/" },
	{ cyrillic: "Ж", ar1922: "ج", ar20: "ج", ipa: "/ʒ/" },
	{ cyrillic: "З", ar1922: "ز", ar20: "ز", ipa: "/z/" },
	{ cyrillic: "Й", ar1922: "ی", ar20: "ي", ipa: "/j/" },
	{ cyrillic: "К", ar1922: "ک", ar20: "ك", ipa: "/k/" },
	{ cyrillic: "Кх", ar1922: "ڤ", ar20: "ڤ", ipa: "/q/" },
	{ cyrillic: "Къ", ar1922: "ق", ar20: "ق", ipa: "/qʼ/" },
	{ cyrillic: "КӀ", ar1922: "ࢰ", ar20: "ࢰ", ipa: "/kʼ/" },
	{ cyrillic: "Л", ar1922: "ل", ar20: "ل", ipa: "/l/" },
	{ cyrillic: "М", ar1922: "م", ar20: "م", ipa: "/m/" },
	{ cyrillic: "Н", ar1922: "ن", ar20: "ن", ipa: "/n/" },
	{ cyrillic: "П", ar1922: "ف", ar20: "پ", ipa: "/p/", changed: true },
	{ cyrillic: "ПӀ", ar1922: "ڥ", ar20: "ڥ", ipa: "/pʼ/" },
	{ cyrillic: "Р", ar1922: "ر", ar20: "ر", ipa: "/r/" },
	{ cyrillic: "С", ar1922: "س", ar20: "س", ipa: "/s/" },
	{ cyrillic: "Т", ar1922: "ت", ar20: "ت", ipa: "/t/" },
	{ cyrillic: "ТӀ", ar1922: "ط", ar20: "ط", ipa: "/tʼ/" },
	{ cyrillic: "Ф", ar1922: "(= П)", ar20: "ف", ipa: "/f/", changed: true },
	{ cyrillic: "Х", ar1922: "خ", ar20: "خ", ipa: "/x/" },
	{ cyrillic: "Хь", ar1922: "ح", ar20: "ح", ipa: "/ħ/" },
	{ cyrillic: "ХӀ", ar1922: "ه", ar20: "ه", ipa: "/h/" },
	{ cyrillic: "Ц", ar1922: "ﮃ", ar20: "ﮃ", ipa: "/ts/" },
	{ cyrillic: "ЦӀ", ar1922: "ڗ", ar20: "ڗ", ipa: "/tsʼ/" },
	{ cyrillic: "Ч", ar1922: "چ", ar20: "چ", ipa: "/tʃ/" },
	{ cyrillic: "ЧӀ", ar1922: "ݗ", ar20: "ݗ", ipa: "/tʃʼ/" },
	{ cyrillic: "Ш", ar1922: "ش", ar20: "ش", ipa: "/ʃ/" },
	{ cyrillic: "Ъ", ar1922: "—", ar20: "ء / أ / ئ / ؤ", ipa: "/ʔ/", changed: true },
	{ cyrillic: "Ӏ", ar1922: "ع", ar20: "ع", ipa: "/ʡ/" },
];

export const VOWELS: VowelRow[] = [
	{ cyrillic: "А", ar1922: "آ", short: "ـَ", long: "ـَا", start: "أَ / آ", ipa: "/ɑ/, /ɑː/" },
	{ cyrillic: "Аь", ar1922: "ا", short: "ـَ۬", long: "ـَا۬", start: "أَ۬ / آ۬", ipa: "/æ/, /æː/", changed: true },
	{ cyrillic: "И", ar1922: "اى", short: "ـِ", long: "ـِي", start: "إِ / إِي", ipa: "/i/, /iː/" },
	{ cyrillic: "Э", ar1922: "اە", short: "ـِ۬", long: "ـِ۬ي", start: "إِ۬ / إِ۬ي", ipa: "/e/, /eː/", changed: true },
	{ cyrillic: "У", ar1922: "او", short: "ـُ", long: "ـُو", start: "أُ / أُو", ipa: "/u/, /uː/" },
	{ cyrillic: "Уь", ar1922: "ۇ", short: "ـُ۬", long: "ـُو۬", start: "أُ۬ / أُو۬", ipa: "/y/, /yː/", changed: true },
	{ cyrillic: "О", ar1922: "او̃", short: "ـٗ", long: "ـٗو", start: "أٗ / أٗو", ipa: "/o/, /oː/", changed: true },
	{ cyrillic: "Оь", ar1922: "يۇ", short: "ـٗ۬", long: "ـٗ۬و", start: "أٗ۬ / أٗ۬و", ipa: "/ø/, /øː/", changed: true },
];

export const ARABIC_EXAMPLES: ArabicExampleRow[] = [
	{ cyr: "нана", ar1922: "نانا", ar20: "نَانَا", meaningKey: "scriptGuide.ex.mother" },
	{ cyr: "дада", ar1922: "دادا", ar20: "دَادَا", meaningKey: "scriptGuide.ex.father" },
	{ cyr: "цо", ar1922: "ﮃاو̃", ar20: "ﮃٗ", meaningKey: "scriptGuide.ex.he" },
	{ cyr: "цуо", ar1922: "ﮃاو̃", ar20: "ﮃُؤٗ", meaningKey: "scriptGuide.ex.heErg" },
	{ cyr: "аьлла", ar1922: "الّا", ar20: "أَ۬لَّا", meaningKey: "scriptGuide.ex.said" },
	{ cyr: "нохчийн", ar1922: "نوچين", ar20: "نٗخچِيٍ", meaningKey: "scriptGuide.ex.chechen" },
	{ cyr: "оьзда", ar1922: "يۇزدا", ar20: "أٗ۬زدَا", meaningKey: "scriptGuide.ex.noble" },
	{ cyr: "гинера", ar1922: "ڠينەرا", ar20: "ڠِينِ۬يرَا", meaningKey: "scriptGuide.ex.saw" },
	{ cyr: "элира", ar1922: "اەليرا", ar20: "إِ۬يلِيرَا", meaningKey: "scriptGuide.ex.said2" },
	{ cyr: "лиэла", ar1922: "—", ar20: "لِئِ۬لَا", meaningKey: "scriptGuide.ex.fly" },
];
