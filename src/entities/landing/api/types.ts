export interface WordLookupRequest {
	normalized: string;
}

export interface WordLookupResponse {
	translation?: string | null;
	grammar?: string | null;
	baseForm?: string | null;
}

export interface DemoWordEntry {
	base: string;
	pos: string;
	trans: string;
	extra: string;
	tags: string[];
}
