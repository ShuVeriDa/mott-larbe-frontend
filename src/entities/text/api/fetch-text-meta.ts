import { API_URL } from "@/shared/config";

export interface TextMeta {
	title: string;
	imageUrl: string | null;
}

export const fetchTextMeta = async (textId: string, pageNumber: number): Promise<TextMeta | null> => {
	try {
		const res = await fetch(`${API_URL}/texts/${textId}/pages/${pageNumber}`, {
			next: { revalidate: 3600 },
		});
		if (!res.ok) return null;
		const data = await res.json();
		return { title: data.title ?? null, imageUrl: data.imageUrl ?? null };
	} catch {
		return null;
	}
};
