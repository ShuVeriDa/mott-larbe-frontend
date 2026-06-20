import type { Gara, Nation, Taip, Tukhum } from "@/entities/heritage";

export type HeritageTab = "nations" | "tukhumy" | "taips" | "garas";

export interface LocalizedNameForm {
	che: string;
	ru: string;
	en: string;
}

export interface NationModalState {
	open: boolean;
	item: Nation | null;
}

export interface TukhumModalState {
	open: boolean;
	item: Tukhum | null;
}

export interface TaipModalState {
	open: boolean;
	item: Taip | null;
}

export interface GaraModalState {
	open: boolean;
	item: Gara | null;
}
