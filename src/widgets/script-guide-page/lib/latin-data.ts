export interface LatinAlphabetRow {
	cyrillic: string;
	latin: string;
	ipa: string;
	trap?: boolean;
}

export interface LatinExampleRow {
	cyr: string;
	latin: string;
	meaningKey: string;
}

export const LATIN_ALPHABET: LatinAlphabetRow[] = [
	{ cyrillic: "А", latin: "A a / Ə ə", ipa: "/ɑ/, /ɑː/" },
	{ cyrillic: "Аь", latin: "Ä ä", ipa: "/æ/, /æː/" },
	{ cyrillic: "Б", latin: "B b", ipa: "/b/" },
	{ cyrillic: "В", latin: "V v", ipa: "/v/" },
	{ cyrillic: "Г", latin: "G g", ipa: "/g/" },
	{ cyrillic: "ГӀ", latin: "Ġ ġ", ipa: "/ɣ/" },
	{ cyrillic: "Д", latin: "D d", ipa: "/d/" },
	{ cyrillic: "Е (краткое)", latin: "E e", ipa: "/e/" },
	{ cyrillic: "Е (дифтонг)", latin: "Ie ie", ipa: "/ie/" },
	{ cyrillic: "Е (йотов.)", latin: "Ye ye", ipa: "/je/" },
	{ cyrillic: "Ж", latin: "Ƶ ƶ", ipa: "/ʒ/" },
	{ cyrillic: "З", latin: "Z z", ipa: "/z/" },
	{ cyrillic: "И", latin: "I i", ipa: "/i/" },
	{ cyrillic: "Й", latin: "Y y", ipa: "/j/", trap: true },
	{ cyrillic: "К", latin: "K k", ipa: "/k/" },
	{ cyrillic: "Кх", latin: "Q q", ipa: "/q/" },
	{ cyrillic: "Къ", latin: "Q̇ q̇", ipa: "/qʼ/" },
	{ cyrillic: "КӀ", latin: "Kh kh", ipa: "/kʼ/" },
	{ cyrillic: "Л", latin: "L l", ipa: "/l/" },
	{ cyrillic: "М", latin: "M m", ipa: "/m/" },
	{ cyrillic: "Н", latin: "N n", ipa: "/n/" },
	{ cyrillic: "Н (назал.)", latin: "Ŋ ŋ", ipa: "/ŋ/" },
	{ cyrillic: "О", latin: "O o", ipa: "/o/" },
	{ cyrillic: "О (дифтонг)", latin: "Uo uo", ipa: "/uo/" },
	{ cyrillic: "Оь", latin: "Ö ö", ipa: "/ø/" },
	{ cyrillic: "П", latin: "P p", ipa: "/p/" },
	{ cyrillic: "ПӀ", latin: "Ph ph", ipa: "/pʼ/" },
	{ cyrillic: "Р", latin: "R r", ipa: "/r/" },
	{ cyrillic: "С", latin: "S s", ipa: "/s/" },
	{ cyrillic: "Т", latin: "T t", ipa: "/t/" },
	{ cyrillic: "ТӀ", latin: "Th th", ipa: "/tʼ/" },
	{ cyrillic: "У", latin: "U u", ipa: "/u/" },
	{ cyrillic: "Уь", latin: "Ü ü", ipa: "/y/" },
	{ cyrillic: "Х", latin: "X x", ipa: "/x/" },
	{ cyrillic: "Хь", latin: "Ẋ ẋ", ipa: "/ħ/" },
	{ cyrillic: "ХӀ", latin: "H h", ipa: "/h/" },
	{ cyrillic: "Ц", latin: "C c", ipa: "/ts/" },
	{ cyrillic: "ЦӀ", latin: "Ċ ċ", ipa: "/tsʼ/" },
	{ cyrillic: "Ч", latin: "Ç ç", ipa: "/tʃ/" },
	{ cyrillic: "ЧӀ", latin: "Ç̇ ç̇", ipa: "/tʃʼ/" },
	{ cyrillic: "Ш", latin: "Ş ş", ipa: "/ʃ/" },
	{ cyrillic: "Ъ", latin: "' / Ə ə", ipa: "/ʔ/" },
	{ cyrillic: "Ю", latin: "Yu yu", ipa: "/ju/" },
	{ cyrillic: "Юь", latin: "Yü yü", ipa: "/jy/" },
	{ cyrillic: "Я", latin: "Ya ya", ipa: "/ja/" },
	{ cyrillic: "Яь", latin: "Yä yä", ipa: "/jæ/" },
	{ cyrillic: "Ӏ", latin: "J j", ipa: "/ʡ/", trap: true },
];

export const LATIN_EXAMPLES: LatinExampleRow[] = [
	{ cyr: "нана", latin: "nana", meaningKey: "scriptGuide.ex.mother" },
	{ cyr: "дада", latin: "dada", meaningKey: "scriptGuide.ex.father" },
	{ cyr: "ваша", latin: "vaşa", meaningKey: "scriptGuide.ex.brother" },
	{ cyr: "йо1", latin: "yoj", meaningKey: "scriptGuide.ex.girl" },
	{ cyr: "Ӏа", latin: "ja", meaningKey: "scriptGuide.ex.winter" },
	{ cyr: "нохчийн", latin: "noxçiyŋ", meaningKey: "scriptGuide.ex.chechen" },
	{ cyr: "сан", latin: "saŋ", meaningKey: "scriptGuide.ex.my" },
	{ cyr: "оьзда", latin: "özda", meaningKey: "scriptGuide.ex.noble" },
];
