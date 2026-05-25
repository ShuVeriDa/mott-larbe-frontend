import type { TextPageResponse } from "@/entities/text/api/types";
import type { PagePhraseOccurrence } from "@/entities/admin-text-phrase";
import type { Highlight } from "@/entities/highlight/api/types";
import type { Note } from "@/entities/note/api/types";

export interface ReaderContextResponse {
	page: TextPageResponse;
	phrases: PagePhraseOccurrence[];
	highlights: Highlight[];
	notes: Note[];
}
