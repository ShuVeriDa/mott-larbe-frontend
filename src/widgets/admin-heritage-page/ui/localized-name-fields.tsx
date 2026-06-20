"use client";

import { Input, InputLabel } from "@/shared/ui/input";
import type { LocalizedName } from "@/entities/heritage";

interface LocalizedNameFieldsProps {
	value: Partial<LocalizedName>;
	onChange: (value: Partial<LocalizedName>) => void;
	idPrefix: string;
}

export const LocalizedNameFields = ({ value, onChange, idPrefix }: LocalizedNameFieldsProps) => {
	const handleChe = (e: React.ChangeEvent<HTMLInputElement>) =>
		onChange({ ...value, che: e.currentTarget.value });

	const handleRu = (e: React.ChangeEvent<HTMLInputElement>) =>
		onChange({ ...value, ru: e.currentTarget.value });

	const handleEn = (e: React.ChangeEvent<HTMLInputElement>) =>
		onChange({ ...value, en: e.currentTarget.value });

	return (
		<div className="flex flex-col gap-3">
			<div>
				<InputLabel htmlFor={`${idPrefix}-che`}>Название (ЧЕ)</InputLabel>
				<Input
					id={`${idPrefix}-che`}
					value={value.che ?? ""}
					onChange={handleChe}
					placeholder="Нохчийн цIе..."
					required
				/>
			</div>
			<div>
				<InputLabel htmlFor={`${idPrefix}-ru`}>Название (РУ)</InputLabel>
				<Input
					id={`${idPrefix}-ru`}
					value={value.ru ?? ""}
					onChange={handleRu}
					placeholder="Русское название..."
					required
				/>
			</div>
			<div>
				<InputLabel htmlFor={`${idPrefix}-en`}>Название (EN)</InputLabel>
				<Input
					id={`${idPrefix}-en`}
					value={value.en ?? ""}
					onChange={handleEn}
					placeholder="English name..."
					required
				/>
			</div>
		</div>
	);
};
