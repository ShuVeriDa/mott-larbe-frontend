import { useI18n } from "@/shared/lib/i18n";
import type { SlashMenuItem } from "@/shared/ui/notion-editor";
import { Typography } from "@/shared/ui/typography";
import { ImageIcon, List, ListOrdered, Subscript, Superscript } from "lucide-react";

export const getSlashItems = (
	t: ReturnType<typeof useI18n>["t"],
	onImageUpload?: () => void,
): SlashMenuItem[] => [
	{
		title: t("admin.texts.createPage.formatText"),
		description: "Обычный абзац",
		group: "Basic blocks",
		icon: (
			<Typography tag="span" className="text-[11px] font-medium text-t-2">
				T
			</Typography>
		),
		command: editor => editor.chain().focus().setParagraph().run(),
	},
	{
		title: t("admin.texts.createPage.formatH1"),
		description: "Крупный заголовок",
		group: "Basic blocks",
		hint: "#",
		icon: (
			<Typography tag="span" className="text-[11px] font-bold text-t-2">
				H₁
			</Typography>
		),
		command: editor => editor.chain().focus().setHeading({ level: 1 }).run(),
	},
	{
		title: t("admin.texts.createPage.formatH2"),
		description: "Средний заголовок",
		group: "Basic blocks",
		hint: "##",
		icon: (
			<Typography tag="span" className="text-[11px] font-bold text-t-2">
				H₂
			</Typography>
		),
		command: editor => editor.chain().focus().setHeading({ level: 2 }).run(),
	},
	{
		title: t("admin.texts.createPage.formatH3"),
		description: "Небольшой заголовок",
		group: "Basic blocks",
		hint: "###",
		icon: (
			<Typography tag="span" className="text-[10px] font-bold text-t-2">
				H₃
			</Typography>
		),
		command: editor => editor.chain().focus().setHeading({ level: 3 }).run(),
	},
	{
		title: t("admin.texts.createPage.formatH4"),
		description: "Маленький заголовок",
		group: "Basic blocks",
		hint: "####",
		icon: (
			<Typography tag="span" className="text-[10px] font-bold text-t-2">
				H₄
			</Typography>
		),
		command: editor => editor.chain().focus().setHeading({ level: 4 }).run(),
	},
	{
		title: t("admin.texts.createPage.formatQuote"),
		description: "Цитата",
		group: "Basic blocks",
		hint: '"',
		icon: (
			<Typography tag="span" className="text-[13px] text-t-2">
				&quot;
			</Typography>
		),
		command: editor => editor.chain().focus().setBlockquote().run(),
	},
	{
		title: t("admin.texts.createPage.bulletList"),
		description: "Маркированный список",
		group: "Basic blocks",
		hint: "-",
		icon: <List className="size-3" />,
		command: editor => editor.chain().focus().toggleBulletList().run(),
	},
	{
		title: t("admin.texts.createPage.orderedList"),
		description: "Нумерованный список",
		group: "Basic blocks",
		hint: "1.",
		icon: <ListOrdered className="size-3" />,
		command: editor => editor.chain().focus().toggleOrderedList().run(),
	},
	{
		title: t("admin.texts.createPage.superscript"),
		description: t("admin.texts.createPage.superscriptDesc"),
		group: "Basic blocks",
		hint: ".",
		icon: <Superscript className="size-3" />,
		command: editor => editor.chain().focus().toggleSuperscript().run(),
	},
	{
		title: t("admin.texts.createPage.subscript"),
		description: t("admin.texts.createPage.subscriptDesc"),
		group: "Basic blocks",
		hint: ",",
		icon: <Subscript className="size-3" />,
		command: editor => editor.chain().focus().toggleSubscript().run(),
	},
	...(onImageUpload
		? [
				{
					title: t("admin.texts.createPage.insertImage"),
					description: t("admin.texts.createPage.insertImageDesc"),
					group: t("admin.texts.createPage.mediaGroup"),
					icon: <ImageIcon className="size-3" />,
					command: (_editor) => onImageUpload(),
				} satisfies SlashMenuItem,
			]
		: []),
];
