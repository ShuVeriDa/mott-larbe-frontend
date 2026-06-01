export interface Genre {
	id: string;
	name: string;
	slug: string;
	sortOrder: number;
}

export interface AdminGenre extends Genre {
	_count: { texts: number };
}
