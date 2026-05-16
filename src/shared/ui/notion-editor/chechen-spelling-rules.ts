/**
 * Chechen spelling modernization rules.
 *
 * Confidence levels:
 *   "certain"  — Уверенно: правило всегда применяется
 *   "likely"   — Возможно: применяется в большинстве случаев
 *   "disputed" — Спорно: зависит от контекста
 *
 * Categories:
 *   "ya-yu"    — я/ю/яь/юь → йа/йу/йаь/йуь; е в начале слова → йе
 *   "diphthong"— гласные, которые стали дифтонгами (уо, иэ)
 *
 * All patterns MUST use the `gu` flags (unicode + global).
 * Do NOT use the `m` flag.
 * Use (?<!\p{L}) for "word start" (not preceded by Unicode letter).
 */

export enum RuleConfidence {
	Certain = "certain",
	Likely = "likely",
	Disputed = "disputed",
}

export enum RuleCategory {
	YaYu = "ya-yu",
	Diphthong = "diphthong",
}

export interface SpellingRule {
	name: string;
	description: string;
	/**
	 * Regex that matches the exact characters to highlight.
	 * Must use `gu` flags. Will have lastIndex reset before each use.
	 */
	pattern: RegExp;
	confidence: RuleConfidence;
	category: RuleCategory;
}

/**
 * All active chechen spelling modernization rules.
 * To extend from outside: use registerSpellingRules().
 */
export const CHECHEN_SPELLING_RULES: SpellingRule[] = [
	// ════════════════════════════════════════════════════════════════════════════
	// я / ю / яь / юь  →  йа / йу / йаь / йуь   (УВЕРЕННО — везде в слове)
	// ════════════════════════════════════════════════════════════════════════════
	// яь/юь идут первыми, чтобы я/ю не захватывали первый символ двузначной комбинации
	{
		name: "яь → йаь",
		description: "яь → йаь (везде в слове)",
		pattern: /яь/gu,
		confidence: RuleConfidence.Certain,
		category: RuleCategory.YaYu,
	},
	{
		name: "юь → йуь",
		description: "юь → йуь (везде в слове)",
		pattern: /юь/gu,
		confidence: RuleConfidence.Certain,
		category: RuleCategory.YaYu,
	},
	{
		name: "я → йа",
		description: "я → йа (везде в слове)",
		pattern: /я(?!ь)/gu,
		confidence: RuleConfidence.Certain,
		category: RuleCategory.YaYu,
	},
	{
		name: "ю → йу",
		description: "ю → йу (везде в слове)",
		pattern: /ю(?!ь)/gu,
		confidence: RuleConfidence.Certain,
		category: RuleCategory.YaYu,
	},

	// ════════════════════════════════════════════════════════════════════════════
	// е → йе в начале слова  (УВЕРЕННО)
	// Примеры: еза→йеза, елла→йелла, ерзор→йерзор, ерг→йерг
	// Исключение ъелла → правило ниже перекрывает через ъ+е
	// ════════════════════════════════════════════════════════════════════════════
	{
		name: "е → йе (начало слова)",
		description: "е → йе в начале слова",
		pattern: /(?<!\p{L})е/gu,
		confidence: RuleConfidence.Certain,
		category: RuleCategory.YaYu,
	},

	// ════════════════════════════════════════════════════════════════════════════
	// Дифтонги  о → уо  (УВЕРЕННО)
	// Конкретные слоги, встречающиеся в исконных чеченских словах
	// ════════════════════════════════════════════════════════════════════════════
	{
		name: "ло → луо",
		description: "ло → луо",
		pattern: /ло/gu,
		confidence: RuleConfidence.Certain,
		category: RuleCategory.Diphthong,
	},
	{
		name: "цо → цуо",
		description: "ло → луо",
		pattern: /цо/gu,
		confidence: RuleConfidence.Certain,
		category: RuleCategory.Diphthong,
	},
	{
		name: "жоп → жуоп",
		description: "жоп → жуоп",
		pattern: /жоп/gu,
		confidence: RuleConfidence.Certain,
		category: RuleCategory.Diphthong,
	},
	{
		name: "до → дуо",
		description: "до → дуо",
		pattern: /до/gu,
		confidence: RuleConfidence.Certain,
		category: RuleCategory.Diphthong,
	},
	{
		name: "го → гуо",
		description: "го → гуо",
		pattern: /го/gu,
		confidence: RuleConfidence.Certain,
		category: RuleCategory.Diphthong,
	},
	{
		name: "во → вуо",
		description: "во → вуо",
		pattern: /во/gu,
		confidence: RuleConfidence.Certain,
		category: RuleCategory.Diphthong,
	},
	{
		name: "бо → буо",
		description: "бо → буо",
		pattern: /бо/gu,
		confidence: RuleConfidence.Certain,
		category: RuleCategory.Diphthong,
	},

	// ════════════════════════════════════════════════════════════════════════════
	// Дифтонги  е → иэ  (УВЕРЕННО)
	// Примеры: деша→диэша, лела→лиэла, еша→йиэша, дуьне→дуьниэ
	// ════════════════════════════════════════════════════════════════════════════
	{
		name: "лела → лиэла",
		description: "лела → лиэла (е → иэ в корне лел-)",
		pattern: /лела/gu,
		confidence: RuleConfidence.Certain,
		category: RuleCategory.Diphthong,
	},
	{
		name: "деша → диэша",
		description: "деша → диэша (е → иэ)",
		pattern: /деша/gu,
		confidence: RuleConfidence.Certain,
		category: RuleCategory.Diphthong,
	},
	{
		name: "дуьне → дуьниэ",
		description: "дуьне → дуьниэ (е → иэ в конце)",
		pattern: /дуьне/gu,
		confidence: RuleConfidence.Certain,
		category: RuleCategory.Diphthong,
	},

	// ════════════════════════════════════════════════════════════════════════════
	// Дифтонги  э → иэ  (УВЕРЕННО)
	// Примеры: эца→иэца, эс→иэс, ерзор→йерзор (е уже выше)
	// ════════════════════════════════════════════════════════════════════════════
	{
		name: "эца → иэца",
		description: "эца → иэца (э → иэ)",
		pattern: /эца/gu,
		confidence: RuleConfidence.Certain,
		category: RuleCategory.Diphthong,
	},
	{
		name: "эс → иэс",
		description: "эс → иэс (э → иэ)",
		pattern: /эс/gu,
		confidence: RuleConfidence.Certain,
		category: RuleCategory.Diphthong,
	},
	{
		name: "э → иэ (начало слова)",
		description: "э → иэ в начале слова",
		pattern: /(?<!\p{L})э/gu,
		confidence: RuleConfidence.Certain,
		category: RuleCategory.Diphthong,
	},

	// ════════════════════════════════════════════════════════════════════════════
	// ъ + е/я → ъй + е/я  (УВЕРЕННО)
	// Примеры: ъелла→ъйелла, ъетта→ъйетта, ъя→ъйа, ъян→ъйан
	// ========================= ═══════════════════════════════════════════════════
	{
		name: "ъе → ъйе",
		description: "ъе → ъйе (ъ перед е)",
		pattern: /ъе/gu,
		confidence: RuleConfidence.Certain,
		category: RuleCategory.YaYu,
	},
	{
		name: "ъя → ъйа",
		description: "ъя → ъйа (ъ перед я)",
		pattern: /ъя/gu,
		confidence: RuleConfidence.Certain,
		category: RuleCategory.YaYu,
	},

	// ════════════════════════════════════════════════════════════════════════════
	// чуе → чуйе  (УВЕРЕННО)
	// Пример: чуерз → чуйерз
	// ════════════════════════════════════════════════════════════════════════════
	{
		name: "чуе → чуйе",
		description: "чуе → чуйе",
		pattern: /чуе/gu,
		confidence: RuleConfidence.Certain,
		category: RuleCategory.YaYu,
	},

	// ════════════════════════════════════════════════════════════════════════════
	// Дифтонги  о → уо  (ВОЗМОЖНО)
	// Примеры: дог→дуог, хьало→хьалуо, билгало→билгалуо, агӏо→агӏуо
	// ════════════════════════════════════════════════════════════════════════════
	{
		name: "дог → дуог",
		description: "дог → дуог (о → уо)",
		pattern: /дог/gu,
		confidence: RuleConfidence.Likely,
		category: RuleCategory.Diphthong,
	},
	{
		name: "хьало → хьалуо",
		description: "хьало → хьалуо (о → уо)",
		pattern: /хьало/gu,
		confidence: RuleConfidence.Likely,
		category: RuleCategory.Diphthong,
	},
	{
		name: "билгало → билгалуо",
		description: "билгало → билгалуо (о → уо)",
		pattern: /билгало/gu,
		confidence: RuleConfidence.Likely,
		category: RuleCategory.Diphthong,
	},
	{
		name: "гӏорт → гӏуорт",
		description: "гӏорт(а) → гӏуорт(а) (о → уо)",
		pattern: /гӏорт/gu,
		confidence: RuleConfidence.Likely,
		category: RuleCategory.Diphthong,
	},
	{
		name: "агӏо → агӏуо",
		description: "агӏо → агӏуо (о → уо)",
		pattern: /агӏо/gu,
		confidence: RuleConfidence.Likely,
		category: RuleCategory.Diphthong,
	},
	{
		name: "чӏагӏо → чӏагӏуо",
		description: "чӏагӏо → чӏагӏуо (о → уо)",
		pattern: /чӏагӏо/gu,
		confidence: RuleConfidence.Likely,
		category: RuleCategory.Diphthong,
	},
	{
		name: "дуьхьало → дуьхьалуо",
		description: "дуьхьало → дуьхьалуо (о → уо)",
		pattern: /дуьхьало/gu,
		confidence: RuleConfidence.Likely,
		category: RuleCategory.Diphthong,
	},
	{
		name: "бакъо → бакъуо",
		description: "бакъо → бакъуо (о → уо)",
		pattern: /бакъо/gu,
		confidence: RuleConfidence.Likely,
		category: RuleCategory.Diphthong,
	},
	{
		name: "хьалона → хьалуона",
		description: "хьалона → хьалуона (о → уо)",
		pattern: /хьалона/gu,
		confidence: RuleConfidence.Likely,
		category: RuleCategory.Diphthong,
	},

	// ════════════════════════════════════════════════════════════════════════════
	// Дифтонги  е → йе после гласной  (ВОЗМОЖНО)
	// Примеры: аен→айен, ае→айе
	// (После согласной — Спорно, см. ниже)
	// ════════════════════════════════════════════════════════════════════════════
	{
		name: "аоза → ауоза",
		description: "аоза → ауоза (о → уо после а)",
		pattern: /аоза/gu,
		confidence: RuleConfidence.Likely,
		category: RuleCategory.Diphthong,
	},
	{
		name: "лаоза → луоза",
		description: "лаоза → луоза",
		pattern: /лаоза/gu,
		confidence: RuleConfidence.Likely,
		category: RuleCategory.Diphthong,
	},
	{
		name: "таоза → тауоза",
		description: "таоза → тауоза",
		pattern: /таоза/gu,
		confidence: RuleConfidence.Likely,
		category: RuleCategory.Diphthong,
	},
	{
		name: "хаоза → хауоза",
		description: "хаоза → хауоза",
		pattern: /хаоза/gu,
		confidence: RuleConfidence.Likely,
		category: RuleCategory.Diphthong,
	},
	{
		name: "этта → йетта",
		description: "етта → йетта (е → йе)",
		pattern: /(?<!\p{L})етта/gu,
		confidence: RuleConfidence.Likely,
		category: RuleCategory.YaYu,
	},
	{
		name: "ехка → йехка",
		description: "ехка → йехка (е → йе)",
		pattern: /(?<!\p{L})ехка/gu,
		confidence: RuleConfidence.Likely,
		category: RuleCategory.YaYu,
	},
	{
		name: "бел → биэл",
		description: "бел → биэл (е → иэ)",
		pattern: /бел/gu,
		confidence: RuleConfidence.Likely,
		category: RuleCategory.Diphthong,
	},
	{
		name: "бе → биэ",
		description: "бе → биэ (е → иэ)",
		pattern: /бе/gu,
		confidence: RuleConfidence.Likely,
		category: RuleCategory.Diphthong,
	},
	{
		name: "еша → йиэша",
		description: "еша → йиэша (е → йиэ)",
		pattern: /(?<!\p{L})еша/gu,
		confidence: RuleConfidence.Likely,
		category: RuleCategory.YaYu,
	},

	// ════════════════════════════════════════════════════════════════════════════
	// е → йе после согласной + ъ  (СПОРНО)
	// Примеры: ръеш→рйеш, ъеш→ъйеш, лъен→лйен, жъе→жйе
	// Исключение: ъе уже покрыт правилом Certain выше
	// ════════════════════════════════════════════════════════════════════════════
	{
		name: "согл+ъе → согл+ъйе",
		description: "согласная+ъе → согласная+ъйе",
		pattern: /(?<=\p{L})ъе/gu,
		confidence: RuleConfidence.Disputed,
		category: RuleCategory.YaYu,
	},

	// ════════════════════════════════════════════════════════════════════════════
	// е → йе внутри слова после согласной  (СПОРНО)
	// Примеры: ен→йен, ер→йер, еха→йеха, еш→йеш
	// ════════════════════════════════════════════════════════════════════════════
	{
		name: "ен → йен (внутри)",
		description: "ен → йен после согласной (спорно)",
		pattern: /(?<=\p{L}[^аеёиоуыэюяАЕЁИОУЫЭЮЯ])ен/gu,
		confidence: RuleConfidence.Disputed,
		category: RuleCategory.YaYu,
	},
	{
		name: "ер → йер (внутри)",
		description: "ер → йер после согласной (спорно)",
		pattern: /(?<=\p{L}[^аеёиоуыэюяАЕЁИОУЫЭЮЯ])ер/gu,
		confidence: RuleConfidence.Disputed,
		category: RuleCategory.YaYu,
	},
	{
		name: "еш → йеш (внутри)",
		description: "еш → йеш после согласной (спорно)",
		pattern: /(?<=\p{L}[^аеёиоуыэюяАЕЁИОУЫЭЮЯ])еш/gu,
		confidence: RuleConfidence.Disputed,
		category: RuleCategory.YaYu,
	},
	{
		name: "еха → йеха (внутри)",
		description: "еха → йеха после согласной (спорно)",
		pattern: /(?<=\p{L}[^аеёиоуыэюяАЕЁИОУЫЭЮЯ])еха/gu,
		confidence: RuleConfidence.Disputed,
		category: RuleCategory.YaYu,
	},

	// ════════════════════════════════════════════════════════════════════════════
	// о → уо  общий (СПОРНО)
	// Примеры: оза→уоза, ае→айе, аен→айен
	// ════════════════════════════════════════════════════════════════════════════
	{
		name: "оза → уоза",
		description: "оза → уоза (о → уо)",
		pattern: /оза/gu,
		confidence: RuleConfidence.Disputed,
		category: RuleCategory.Diphthong,
	},
	{
		name: "аен → айен",
		description: "аен → айен (е → йе после гласной)",
		pattern: /аен/gu,
		confidence: RuleConfidence.Disputed,
		category: RuleCategory.YaYu,
	},
	{
		name: "ае → айе",
		description: "ае → айе (е → йе после гласной)",
		pattern: /ае(?!н)/gu,
		confidence: RuleConfidence.Disputed,
		category: RuleCategory.YaYu,
	},
];

/**
 * Register additional spelling rules at runtime.
 * New rules are appended after the built-in ones.
 * The decoration extension re-reads CHECHEN_SPELLING_RULES on every doc change,
 * so rules added before the editor is mounted take effect immediately.
 */
export const registerSpellingRules = (...rules: SpellingRule[]): void => {
	CHECHEN_SPELLING_RULES.push(...rules);
};
