import type { TextPageResponse } from "@/entities/text";
import type { PagePhraseOccurrence } from "@/entities/admin-text-phrase";
import type { Highlight } from "@/entities/highlight";
import type { Note } from "@/entities/note";

export interface ReaderContextResponse {
	page: TextPageResponse;
	phrases: PagePhraseOccurrence[];
	highlights: Highlight[];
	notes: Note[];
}
