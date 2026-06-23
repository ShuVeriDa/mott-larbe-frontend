import {
	type ReviewDueWord,
	getPrimaryTranslation,
} from "@/entities/review";

export const buildSm2Options = (
	words: ReviewDueWord[],
	currentIndex: number,
): { options: string[]; correctIndex: number } => {
	const current = words[currentIndex];
	if (!current) return { options: [], correctIndex: 0 };

	const correct = getPrimaryTranslation(current.lemma);
	if (!correct) return { options: [], correctIndex: 0 };

	const seen = new Set<string>([correct.toLowerCase()]);
	const pool: string[] = [];

	for (let i = 0; i < words.length; i++) {
		if (i === currentIndex) continue;
		const primary = getPrimaryTranslation(words[i].lemma);
		if (primary && !seen.has(primary.toLowerCase())) {
			seen.add(primary.toLowerCase());
			pool.push(primary);
		}
		for (const hw of words[i].lemma.headwords) {
			const t = hw.entry.rawTranslate?.trim();
			if (t && !seen.has(t.toLowerCase())) {
				seen.add(t.toLowerCase());
				pool.push(t);
			}
		}
	}

	const distractors = pool.slice(0, 3);
	const all = [correct, ...distractors].slice(0, 4);
	all.sort();
	return { options: all, correctIndex: all.indexOf(correct) };
};
