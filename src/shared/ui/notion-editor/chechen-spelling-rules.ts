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
	// о → уо  (УВЕРЕННО)
	// ════════════════════════════════════════════════════════════════════════════
	{
		name: "кӀело → кӀелуо",
		description: "кӀело → кӀелуо (о → уо)",
		pattern: /кӀело/gu,
		confidence: RuleConfidence.Certain,
		category: RuleCategory.Diphthong,
	},
	{
		name: "таро → таруо",
		description: "таро → таруо (о → уо)",
		pattern: /таро/gu,
		confidence: RuleConfidence.Certain,
		category: RuleCategory.Diphthong,
	},
	{
		name: "бакъо → бакъуо",
		description: "бакъо → бакъуо (о → уо)",
		pattern: /бакъо/gu,
		confidence: RuleConfidence.Certain,
		category: RuleCategory.Diphthong,
	},
	{
		name: "харцо → харцуо",
		description: "харцо → харцуо (о → уо)",
		pattern: /харцо/gu,
		confidence: RuleConfidence.Certain,
		category: RuleCategory.Diphthong,
	},
	{
		name: "нийсо → нийсуо",
		description: "нийсо → нийсуо (о → уо)",
		pattern: /нийсо/gu,
		confidence: RuleConfidence.Certain,
		category: RuleCategory.Diphthong,
	},
	{
		name: "тоха → туоха",
		description: "тоха → туоха (о → уо)",
		pattern: /тоха/gu,
		confidence: RuleConfidence.Certain,
		category: RuleCategory.Diphthong,
	},
	{
		name: "тохо → туохуо",
		description: "тохо → туохуо (о → уо)",
		pattern: /тохо/gu,
		confidence: RuleConfidence.Certain,
		category: RuleCategory.Diphthong,
	},
	{
		name: "тохи → туохи",
		description: "тохи → туохи (о → уо)",
		pattern: /тохи/gu,
		confidence: RuleConfidence.Certain,
		category: RuleCategory.Diphthong,
	},
	{
		name: "ловзо → ловзуо",
		description: "ловзо → ловзуо (о → уо)",
		pattern: /ловзо/gu,
		confidence: RuleConfidence.Certain,
		category: RuleCategory.Diphthong,
	},
	{
		name: "дуьхьало → дуьхьалуо",
		description: "дуьхьало → дуьхьалуо (о → уо)",
		pattern: /дуьхьало/gu,
		confidence: RuleConfidence.Certain,
		category: RuleCategory.Diphthong,
	},
	{
		name: "йало → йалуо",
		description: "йало → йалуо (о → уо)",
		pattern: /йало/gu,
		confidence: RuleConfidence.Certain,
		category: RuleCategory.Diphthong,
	},
	{
		name: "хьало → хьалуо",
		description: "хьало → хьалуо (о → уо)",
		pattern: /хьало/gu,
		confidence: RuleConfidence.Certain,
		category: RuleCategory.Diphthong,
	},
	{
		name: "дог → дуог",
		description: "дог → дуог (о → уо)",
		pattern: /дог/gu,
		confidence: RuleConfidence.Certain,
		category: RuleCategory.Diphthong,
	},
	{
		name: "билгало → билгалуо",
		description: "билгало → билгалуо (о → уо)",
		pattern: /билгало/gu,
		confidence: RuleConfidence.Certain,
		category: RuleCategory.Diphthong,
	},
	{
		name: "ког → куог",
		description: "ког → куог (о → уо)",
		pattern: /ког/gu,
		confidence: RuleConfidence.Certain,
		category: RuleCategory.Diphthong,
	},
	{
		name: "корта → куорта",
		description: "корта → куорта (о → уо)",
		pattern: /корта/gu,
		confidence: RuleConfidence.Certain,
		category: RuleCategory.Diphthong,
	},
	{
		name: "ласто → ластуо",
		description: "ласто → ластуо (о → уо)",
		pattern: /ласто/gu,
		confidence: RuleConfidence.Certain,
		category: RuleCategory.Diphthong,
	},
	{
		name: "лело → лиэлуо",
		description: "лело → лиэлуо (о → уо, е → иэ)",
		pattern: /лело/gu,
		confidence: RuleConfidence.Certain,
		category: RuleCategory.Diphthong,
	},
	{
		name: "хало → халуо",
		description: "хало → халуо (о → уо)",
		pattern: /хало/gu,
		confidence: RuleConfidence.Certain,
		category: RuleCategory.Diphthong,
	},
	{
		name: "гӏорта → гӏуорта",
		description: "гӏорта → гӏуорта (о → уо)",
		pattern: /гӏорта/gu,
		confidence: RuleConfidence.Certain,
		category: RuleCategory.Diphthong,
	},
	{
		name: "гӏорто → гӏуортуо",
		description: "гӏорто → гӏуортуо (о → уо)",
		pattern: /гӏорто/gu,
		confidence: RuleConfidence.Certain,
		category: RuleCategory.Diphthong,
	},
	{
		name: "гӏорт → гӏуорт",
		description: "гӏорт → гӏуорт (о → уо)",
		pattern: /гӏорт/gu,
		confidence: RuleConfidence.Certain,
		category: RuleCategory.Diphthong,
	},
	{
		name: "агӏо → агӏуо",
		description: "агӏо → агӏуо (о → уо)",
		pattern: /агӏо(?!н)/gu,
		confidence: RuleConfidence.Certain,
		category: RuleCategory.Diphthong,
	},
	{
		name: "агӏон → агӏуон",
		description: "агӏон → агӏуон (о → уо)",
		pattern: /агӏон/gu,
		confidence: RuleConfidence.Certain,
		category: RuleCategory.Diphthong,
	},
	{
		name: "чӏагӏо → чӏагӏуо",
		description: "чӏагӏо → чӏагӏуо (о → уо)",
		pattern: /чӏагӏо/gu,
		confidence: RuleConfidence.Certain,
		category: RuleCategory.Diphthong,
	},
	{
		name: "охьакхосса → уохьакхуосса",
		description: "охьакхосса → уохьакхуосса (о → уо)",
		pattern: /охьакхосса/gu,
		confidence: RuleConfidence.Certain,
		category: RuleCategory.Diphthong,
	},
	{
		name: "кхосса → кхуосса",
		description: "кхосса → кхуосса (о → уо)",
		pattern: /кхосса/gu,
		confidence: RuleConfidence.Certain,
		category: RuleCategory.Diphthong,
	},
	{
		name: "цо → цуо",
		description: "цо → цуо",
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
	{
		name: "ло → луо",
		description: "ло → луо (о → уо)",
		pattern: /ло/gu,
		confidence: RuleConfidence.Certain,
		category: RuleCategory.Diphthong,
	},
	{
		name: "до → дуо",
		description: "до → дуо (о → уо)",
		pattern: /до/gu,
		confidence: RuleConfidence.Certain,
		category: RuleCategory.Diphthong,
	},
	{
		name: "го → гуо",
		description: "го → гуо (о → уо)",
		pattern: /го/gu,
		confidence: RuleConfidence.Certain,
		category: RuleCategory.Diphthong,
	},
	{
		name: "оза → уоза",
		description: "оза → уоза (о → уо)",
		pattern: /(?<!\p{L})оза/gu,
		confidence: RuleConfidence.Certain,
		category: RuleCategory.Diphthong,
	},

	// ════════════════════════════════════════════════════════════════════════════
	// е → иэ / йиэ  (УВЕРЕННО)
	// ════════════════════════════════════════════════════════════════════════════
	{
		name: "лела → лиэла",
		description: "лела → лиэла (е → иэ)",
		pattern: /лела/gu,
		confidence: RuleConfidence.Certain,
		category: RuleCategory.Diphthong,
	},
	{
		name: "лелла → лиэлла",
		description: "лелла → лиэлла (е → иэ)",
		pattern: /лелла/gu,
		confidence: RuleConfidence.Certain,
		category: RuleCategory.Diphthong,
	},
	{
		name: "лелли → лиэлли",
		description: "лелли → лиэлли (е → иэ)",
		pattern: /лелли/gu,
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
		description: "дуьне → дуьниэ (е → иэ)",
		pattern: /дуьне/gu,
		confidence: RuleConfidence.Certain,
		category: RuleCategory.Diphthong,
	},
	{
		name: "хьекхо → хьиэкхуо",
		description: "хьекхо → хьиэкхуо (е → иэ, о → уо)",
		pattern: /хьекхо/gu,
		confidence: RuleConfidence.Certain,
		category: RuleCategory.Diphthong,
	},
	{
		name: "хьежо → хьиэжуо",
		description: "хьежо → хьиэжуо (е → иэ, о → уо)",
		pattern: /хьежо/gu,
		confidence: RuleConfidence.Certain,
		category: RuleCategory.Diphthong,
	},
	{
		name: "хьежа → хьиэжа",
		description: "хьежа → хьиэжа (е → иэ)",
		pattern: /хьежа/gu,
		confidence: RuleConfidence.Certain,
		category: RuleCategory.Diphthong,
	},
	{
		name: "теIо → тиэIуо",
		description: "теIо → тиэIуо (е → иэ, о → уо)",
		pattern: /теIо/gu,
		confidence: RuleConfidence.Certain,
		category: RuleCategory.Diphthong,
	},
	{
		name: "теIа → тиэIа",
		description: "теIа → тиэIа (е → иэ)",
		pattern: /теIа/gu,
		confidence: RuleConfidence.Certain,
		category: RuleCategory.Diphthong,
	},
	{
		name: "кӀег → кӀиэг",
		description: "кӀег → кӀиэг (е → иэ)",
		pattern: /кӀег/gu,
		confidence: RuleConfidence.Certain,
		category: RuleCategory.Diphthong,
	},
	{
		name: "кӀега → кӀиэга",
		description: "кӀега → кӀиэга (е → иэ)",
		pattern: /кӀега/gu,
		confidence: RuleConfidence.Certain,
		category: RuleCategory.Diphthong,
	},
	{
		name: "къеста → къиэста",
		description: "къеста → къиэста (е → иэ)",
		pattern: /къеста/gu,
		confidence: RuleConfidence.Certain,
		category: RuleCategory.Diphthong,
	},

	// ════════════════════════════════════════════════════════════════════════════
	// е → йе  (УВЕРЕННО — в начале слова)
	// ════════════════════════════════════════════════════════════════════════════
	{
		name: "ерриг → йерриг",
		description: "ерриг → йерриг (е → йе в начале слова)",
		pattern: /(?<!\p{L})ерриг/gu,
		confidence: RuleConfidence.Certain,
		category: RuleCategory.YaYu,
	},
	{
		name: "ерг → йерг",
		description: "ерг → йерг (е → йе в начале слова)",
		pattern: /(?<!\p{L})ерг/gu,
		confidence: RuleConfidence.Certain,
		category: RuleCategory.YaYu,
	},
	{
		name: "еша → йиэша",
		description: "еша → йиэша (е → йиэ в начале слова)",
		pattern: /(?<!\p{L})еша/gu,
		confidence: RuleConfidence.Certain,
		category: RuleCategory.YaYu,
	},
	{
		name: "ерзор → йерзор",
		description: "ерзор → йерзор (е → йе в начале слова)",
		pattern: /(?<!\p{L})ерзор/gu,
		confidence: RuleConfidence.Certain,
		category: RuleCategory.YaYu,
	},

	// ════════════════════════════════════════════════════════════════════════════
	// э → иэ  (УВЕРЕННО)
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
	// Примеры: ъелла→йелла, ъетта→йетта, ъя→йа, ъян→йан
	// ========================= ═══════════════════════════════════════════════════
	{
		name: "ъе → йе",
		description: "ъе → йе (ъ перед е)",
		pattern: /ъе/gu,
		confidence: RuleConfidence.Certain,
		category: RuleCategory.YaYu,
	},
	{
		name: "ъя → йа",
		description: "ъя → йа (ъ перед я)",
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
	// о → уо  (ВОЗМОЖНО)
	// ════════════════════════════════════════════════════════════════════════════
	{
		name: "йолийра → йуолийра",
		description: "йолийра → йуолийра (о → уо)",
		pattern: /йолийра/gu,
		confidence: RuleConfidence.Likely,
		category: RuleCategory.Diphthong,
	},
	{
		name: "мохь → муохь",
		description: "мохь → муохь (о → уо)",
		pattern: /мохь/gu,
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
	{
		name: "лаоза → луоза",
		description: "лаоза → луоза (о → уо)",
		pattern: /лаоза/gu,
		confidence: RuleConfidence.Likely,
		category: RuleCategory.Diphthong,
	},
	{
		name: "таоза → тауоза",
		description: "таоза → тауоза (о → уо)",
		pattern: /таоза/gu,
		confidence: RuleConfidence.Likely,
		category: RuleCategory.Diphthong,
	},
	{
		name: "хаоза → хауоза",
		description: "хаоза → хауоза (о → уо)",
		pattern: /хаоза/gu,
		confidence: RuleConfidence.Likely,
		category: RuleCategory.Diphthong,
	},
	{
		name: "аоза → ауоза",
		description: "аоза → ауоза (о → уо после а)",
		pattern: /аоза/gu,
		confidence: RuleConfidence.Likely,
		category: RuleCategory.Diphthong,
	},
	{
		name: "сто → стуо",
		description: "сто → стуо (о → уо)",
		pattern: /сто/gu,
		confidence: RuleConfidence.Likely,
		category: RuleCategory.Diphthong,
	},
	{
		name: "архо → архуо",
		description: "архо → архуо (о → уо)",
		pattern: /архо/gu,
		confidence: RuleConfidence.Likely,
		category: RuleCategory.Diphthong,
	},

	// ════════════════════════════════════════════════════════════════════════════
	// е → йе / иэ  (ВОЗМОЖНО)
	// ════════════════════════════════════════════════════════════════════════════
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
		name: "еши → йеши",
		description: "еши → йеши (е → йе в начале слова)",
		pattern: /(?<!\p{L})еши/gu,
		confidence: RuleConfidence.Likely,
		category: RuleCategory.YaYu,
	},
	{
		name: "еелла → йейелла",
		description: "еелла → йейелла",
		pattern: /(?<!\p{L})еелла/gu,
		confidence: RuleConfidence.Likely,
		category: RuleCategory.YaYu,
	},
	{
		name: "еелира → йейелира",
		description: "еелира → йейелира",
		pattern: /(?<!\p{L})еелира/gu,
		confidence: RuleConfidence.Likely,
		category: RuleCategory.YaYu,
	},
	{
		name: "ъелла → йелла",
		description: "ъелла → йелла (исключение: къелла не меняется)",
		pattern: /(?<!кь)ъелла/gu,
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
		name: "кхаен → кхайен",
		description: "кхаен → кхайен (е → йе после гласной)",
		pattern: /кхаен/gu,
		confidence: RuleConfidence.Likely,
		category: RuleCategory.YaYu,
	},

	// ════════════════════════════════════════════════════════════════════════════
	// о → уо  (СПОРНО)
	// ════════════════════════════════════════════════════════════════════════════
	{
		name: "нхо → нхуо",
		description: "нхо → нхуо (о → уо)",
		pattern: /нхо/gu,
		confidence: RuleConfidence.Disputed,
		category: RuleCategory.Diphthong,
	},
	{
		name: "лхоч → лхуоч",
		description: "лхоч → лхуоч (о → уо)",
		pattern: /лхоч/gu,
		confidence: RuleConfidence.Disputed,
		category: RuleCategory.Diphthong,
	},
	{
		name: "лхо → лхуо",
		description: "лхо → лхуо (о → уо)",
		pattern: /лхо(?!ч)/gu,
		confidence: RuleConfidence.Disputed,
		category: RuleCategory.Diphthong,
	},
	{
		name: "алхо → алхуо",
		description: "алхо → алхуо (о → уо)",
		pattern: /алхо/gu,
		confidence: RuleConfidence.Disputed,
		category: RuleCategory.Diphthong,
	},
	{
		name: "ато → атуо",
		description: "ато → атуо (о → уо)",
		pattern: /ато/gu,
		confidence: RuleConfidence.Disputed,
		category: RuleCategory.Diphthong,
	},
	{
		name: "тто → ттуо",
		description: "тто → ттуо (о → уо)",
		pattern: /тто/gu,
		confidence: RuleConfidence.Disputed,
		category: RuleCategory.Diphthong,
	},
	{
		name: "хӀот → хӀуот",
		description: "хӀот → хӀуот (о → уо)",
		pattern: /хӀот/gu,
		confidence: RuleConfidence.Disputed,
		category: RuleCategory.Diphthong,
	},

	// ════════════════════════════════════════════════════════════════════════════
	// е → йе  (СПОРНО — начало слова)
	// ════════════════════════════════════════════════════════════════════════════
	{
		name: "ека → йека",
		description: "ека → йека (е → йе в начале слова)",
		pattern: /(?<!\p{L})ека/gu,
		confidence: RuleConfidence.Disputed,
		category: RuleCategory.YaYu,
	},
	{
		name: "ейта → йейта",
		description: "ейта → йейта (е → йе в начале слова)",
		pattern: /(?<!\p{L})ейта/gu,
		confidence: RuleConfidence.Disputed,
		category: RuleCategory.YaYu,
	},
	{
		name: "ега → йега",
		description: "ега → йега (е → йе в начале слова)",
		pattern: /(?<!\p{L})ега/gu,
		confidence: RuleConfidence.Disputed,
		category: RuleCategory.YaYu,
	},
	{
		name: "ерра → йерра",
		description: "ерра → йерра (е → йе в начале слова)",
		pattern: /(?<!\p{L})ерра/gu,
		confidence: RuleConfidence.Disputed,
		category: RuleCategory.YaYu,
	},
	{
		name: "ерри → йерри",
		description: "ерри → йерри (е → йе в начале слова)",
		pattern: /(?<!\p{L})ерри/gu,
		confidence: RuleConfidence.Disputed,
		category: RuleCategory.YaYu,
	},
	{
		name: "ерр → йерр",
		description: "ерр → йерр (е → йе в начале слова)",
		pattern: /(?<!\p{L})ерр(?!а|и)/gu,
		confidence: RuleConfidence.Disputed,
		category: RuleCategory.YaYu,
	},
	{
		name: "ерз → йерз",
		description: "ерз → йерз (е → йе в начале слова)",
		pattern: /(?<!\p{L})ерз/gu,
		confidence: RuleConfidence.Disputed,
		category: RuleCategory.YaYu,
	},
	{
		name: "евл → йевл",
		description: "евл → йевл (е → йе в начале слова)",
		pattern: /(?<!\p{L})евл/gu,
		confidence: RuleConfidence.Disputed,
		category: RuleCategory.YaYu,
	},
	{
		name: "ер → йер",
		description: "ер → йер (е → йе в начале слова)",
		pattern: /(?<!\p{L})ер(?!р|з)/gu,
		confidence: RuleConfidence.Disputed,
		category: RuleCategory.YaYu,
	},

	// ════════════════════════════════════════════════════════════════════════════
	// ае / аел / аех → айе / айел / айех  (СПОРНО)
	// ════════════════════════════════════════════════════════════════════════════
	{
		name: "аелл → айелл",
		description: "аелл → айелл (е → йе после гласной а)",
		pattern: /аелл/gu,
		confidence: RuleConfidence.Disputed,
		category: RuleCategory.YaYu,
	},
	{
		name: "аехира → айехира",
		description: "аехира → айехира (е → йе после гласной а)",
		pattern: /аехира/gu,
		confidence: RuleConfidence.Disputed,
		category: RuleCategory.YaYu,
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
		pattern: /ае(?!н|лл|хира)/gu,
		confidence: RuleConfidence.Disputed,
		category: RuleCategory.YaYu,
	},

	// ════════════════════════════════════════════════════════════════════════════
	// ъеш / ъелл → йеш / йелл  (СПОРНО)
	// ════════════════════════════════════════════════════════════════════════════
	{
		name: "ъеш → йеш",
		description: "ъеш → йеш",
		pattern: /(?<!\p{L})ъеш/gu,
		confidence: RuleConfidence.Disputed,
		category: RuleCategory.YaYu,
	},
	{
		name: "ъелл → йелл",
		description: "ъелл → йелл",
		pattern: /(?<!\p{L})ъелл/gu,
		confidence: RuleConfidence.Disputed,
		category: RuleCategory.YaYu,
	},

	// ════════════════════════════════════════════════════════════════════════════
	// согл+ъ+е → согл+ъ+йе  (СПОРНО)
	// ════════════════════════════════════════════════════════════════════════════
	{
		name: "лъен → лйен",
		description: "лъен → лйен",
		pattern: /лъен/gu,
		confidence: RuleConfidence.Disputed,
		category: RuleCategory.YaYu,
	},
	{
		name: "лъе → лйе",
		description: "лъе → лйе",
		pattern: /лъе(?!н)/gu,
		confidence: RuleConfidence.Disputed,
		category: RuleCategory.YaYu,
	},
	{
		name: "ръеш → рйеш",
		description: "ръеш → рйеш",
		pattern: /ръеш/gu,
		confidence: RuleConfidence.Disputed,
		category: RuleCategory.YaYu,
	},
	{
		name: "ръе → рйе",
		description: "ръе → рйе",
		pattern: /ръе(?!ш)/gu,
		confidence: RuleConfidence.Disputed,
		category: RuleCategory.YaYu,
	},
	{
		name: "жъе → жйе",
		description: "жъе → жйе",
		pattern: /жъе/gu,
		confidence: RuleConfidence.Disputed,
		category: RuleCategory.YaYu,
	},
	{
		name: "шъе → шйе",
		description: "шъе → шйе",
		pattern: /шъе/gu,
		confidence: RuleConfidence.Disputed,
		category: RuleCategory.YaYu,
	},
	{
		name: "зъеш → зйеш",
		description: "зъеш → зйеш",
		pattern: /зъеш/gu,
		confidence: RuleConfidence.Disputed,
		category: RuleCategory.YaYu,
	},
	{
		name: "бъеш → бйеш",
		description: "бъеш → бйеш",
		pattern: /бъеш/gu,
		confidence: RuleConfidence.Disputed,
		category: RuleCategory.YaYu,
	},
	{
		name: "чъеш → чйеш",
		description: "чъеш → чйеш",
		pattern: /чъеш/gu,
		confidence: RuleConfidence.Disputed,
		category: RuleCategory.YaYu,
	},
	{
		name: "лъеш → лйеш",
		description: "лъеш → лйеш",
		pattern: /лъеш/gu,
		confidence: RuleConfidence.Disputed,
		category: RuleCategory.YaYu,
	},
	{
		name: "гӏъеш → гӏйеш",
		description: "гӏъеш → гӏйеш",
		pattern: /гӏъеш/gu,
		confidence: RuleConfidence.Disputed,
		category: RuleCategory.YaYu,
	},
	{
		name: "согл+ъе → согл+ъйе",
		description: "согласная+ъе → согласная+ъйе",
		pattern: /(?<=\p{L})ъе/gu,
		confidence: RuleConfidence.Disputed,
		category: RuleCategory.YaYu,
	},

	// ════════════════════════════════════════════════════════════════════════════
	// е → йе внутри слова после согласной  (СПОРНО)
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
	// ъя → йа  (СПОРНО)
	// ════════════════════════════════════════════════════════════════════════════
	{
		name: "ъя → йа (начало слова)",
		description: "ъя → йа в начале слова",
		pattern: /(?<!\p{L})ъя/gu,
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
