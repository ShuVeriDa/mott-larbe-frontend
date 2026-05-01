export const FOLDER_COLORS = [
	"#2254d3",
	"#1a9e52",
	"#d97706",
	"#6d4ed4",
	"#dc2626",
	"#0d9488",
	"#db2777",
	"#525252",
] as const;

export type FolderColor = (typeof FOLDER_COLORS)[number];

export const FOLDER_ICON_KEYS = [
	"book",
	"leaf",
	"users",
	"star",
	"globe",
	"sparkles",
	"compass",
	"flame",
] as const;

export type FolderIconKey = (typeof FOLDER_ICON_KEYS)[number];

export const DEFAULT_FOLDER_COLOR: FolderColor = FOLDER_COLORS[0];
export const DEFAULT_FOLDER_ICON: FolderIconKey = "book";

export const isFolderIconKey = (value: string | null | undefined): value is FolderIconKey =>
	!!value && (FOLDER_ICON_KEYS as readonly string[]).includes(value);
