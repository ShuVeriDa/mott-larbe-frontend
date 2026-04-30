import type {
	HTMLAttributes,
	LabelHTMLAttributes,
	ElementType,
	ReactNode,
} from "react";
import { cn } from "@/shared/lib/cn";

type TypographyTag =
	| "h1"
	| "h2"
	| "h3"
	| "h4"
	| "h5"
	| "h6"
	| "p"
	| "span"
	| "strong"
	| "em"
	| "label"
	| "blockquote"
	| "li"
	| "caption";

type TypographySize =
	| "xs"
	| "sm"
	| "base"
	| "lg"
	| "xl"
	| "2xl"
	| "3xl"
	| "4xl"
	| "5xl"
	| "6xl";

const sizeClasses: Record<TypographySize, string> = {
	xs: "text-xs",
	sm: "text-sm",
	base: "text-base",
	lg: "text-lg",
	xl: "text-xl",
	"2xl": "text-2xl",
	"3xl": "text-3xl",
	"4xl": "text-4xl",
	"5xl": "text-5xl",
	"6xl": "text-6xl",
};

export type TypographyProps = {
	tag?: TypographyTag;
	size?: TypographySize;
	className?: string;
	children?: ReactNode;
} & Omit<HTMLAttributes<HTMLElement>, "tag"> &
	Pick<LabelHTMLAttributes<HTMLLabelElement>, "htmlFor">;

export const Typography = ({
	tag: Tag = "p",
	size,
	className,
	children,
	...props
}: TypographyProps) => {
	const Element = Tag as ElementType;

	return (
		<Element className={cn(size && sizeClasses[size], className)} {...props}>
			{children}
		</Element>
	);
};
