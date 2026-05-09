"use client";

import { Button } from "@/shared/ui/button";

import { Eye, EyeOff } from "lucide-react";
import { type ChangeEvent, ComponentProps, useState } from 'react';
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";

interface PasswordFieldProps {
	id: string;
	label: string;
	value: string;
	onChange: (value: string) => void;
	hasError?: boolean;
	autoComplete?: string;
}

export const PasswordField = ({
	id,
	label,
	value,
	onChange,
	hasError,
	autoComplete = "new-password",
}: PasswordFieldProps) => {
	const { t } = useI18n();
	const [visible, setVisible] = useState(false);

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		onChange(e.currentTarget.value);
	};

		const handleClick: NonNullable<ComponentProps<"button">["onClick"]> = () => setVisible((prev) => !prev);
return (
		<>
			<Typography
				tag="label"
				htmlFor={id}
				className="mb-1.5 block text-[11.5px] font-medium text-t-2"
			>
				{label}
			</Typography>
			<div className="relative flex items-center">
				<input
					id={id}
					type={visible ? "text" : "password"}
					value={value}
					onChange={handleChange}
					placeholder={t("auth.resetPassword.step3.placeholder")}
					autoComplete={autoComplete}
					required
					aria-invalid={hasError ? true : undefined}
					className={cn(
						"h-[42px] w-full rounded-[9px] border border-bd-2 bg-panel px-[14px] pr-[42px] text-[14px] text-t-1 outline-none transition-colors",
						"placeholder:text-t-3 hover:border-bd-3 focus:border-acc",
						hasError && "border-red focus:border-red",
					)}
				/>
				<Button
					tabIndex={-1}
					onClick={handleClick}
					aria-label={t(
						visible
							? "auth.resetPassword.step3.hidePassword"
							: "auth.resetPassword.step3.showPassword",
					)}
					className="absolute right-1 top-1 bottom-1 inline-flex w-[34px] items-center justify-center rounded-[6px] bg-transparent text-t-3 transition-colors hover:bg-surf-2 hover:text-t-1"
				>
					{visible ? (
						<EyeOff size={16} strokeWidth={1.8} />
					) : (
						<Eye size={16} strokeWidth={1.8} />
					)}
				</Button>
			</div>
		</>
	);
};
