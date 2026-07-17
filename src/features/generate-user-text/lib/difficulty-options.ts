import type { GenerationDifficulty } from "@/entities/text-generation";

// Значения должны точно совпадать с GENERATION_DIFFICULTIES в backend generate-user-text.dto.ts.
// Коды CEFR (A1..C2) международны и не локализуются — в отличие от других опций этой фичи,
// здесь нет отдельного labelKey.
export const DIFFICULTY_OPTIONS: GenerationDifficulty[] = ["A1", "A2", "B1", "B2", "C1", "C2"];
