interface TelegramIconProps {
	className?: string;
}

export const TelegramIcon = ({ className }: TelegramIconProps) => (
	<svg
		viewBox="0 0 24 24"
		fill="currentColor"
		aria-hidden="true"
		className={className}
	>
		<path d="M21.94 4.4l-3.04 14.36c-.23 1.02-.83 1.27-1.68.79l-4.65-3.43-2.24 2.16c-.25.25-.46.46-.94.46l.34-4.74L18.4 6.2c.38-.34-.08-.53-.59-.19L7.07 12.7l-4.69-1.47c-1.02-.32-1.04-1.02.21-1.51L20.65 3.13c.85-.32 1.6.2 1.29 1.27z" />
	</svg>
);
