"use client";
import type { ReviewQuality } from "@/entities/review";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Typography } from "@/shared/ui/typography";
import { useEffect, useRef, useState } from "react";

export interface TypingCardSm2Props {
	word: string;
	pos: string | null;
	cardNumber: number;
	correctAnswer: string;
	onRate: (quality: ReviewQuality) => void;
}

const levenshtein = (a: string, b: string): number => {
	const m = a.length;
	const n = b.length;
	const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
		Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)),
	);
	for (let i = 1; i <= m; i++) {
		for (let j = 1; j <= n; j++) {
			dp[i][j] =
				a[i - 1] === b[j - 1]
					? dp[i - 1][j - 1]
					: 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
		}
	}
	return dp[m][n];
};

type Result = "exact" | "typo" | "wrong" | null;

const getResult = (input: string, correct: string): Exclude<Result, null> => {
	const norm = (s: string) => s.trim().toLowerCase();
	const a = norm(input);
	const b = norm(correct);
	if (a === b) return "exact";
	if (levenshtein(a, b) <= 1) return "typo";
	return "wrong";
};

const qualityForResult: Record<Exclude<Result, null>, ReviewQuality> = {
	exact: 5,
	typo: 4,
	wrong: 0,
};

export const TypingCardSm2 = ({
	word,
	pos,
	cardNumber,
	correctAnswer,
	onRate,
}: TypingCardSm2Props) => {
	const { t } = useI18n();
	const [value, setValue] = useState("");
	const [result, setResult] = useState<Result>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		inputRef.current?.focus();
	}, []);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (result !== null) return;
		setValue(e.currentTarget.value);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (result !== null || value.trim() === "") return;
		const r = getResult(value, correctAnswer);
		setResult(r);
		setTimeout(() => onRate(qualityForResult[r]), r === "wrong" ? 1800 : 900);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			e.preventDefault();
			handleSubmit(e as unknown as React.FormEvent);
		}
	};

	const revealed = result !== null;

	return (
		<div className="w-full max-w-[520px] mb-3.5">
			<div className="relative w-full min-h-[205px] flex flex-col items-center justify-center rounded-hero border-[0.5px] border-bd-2 bg-surf p-7 shadow-md max-md:p-5 max-md:min-h-[185px]">
				<Typography
					tag="span"
					className="absolute right-3.5 top-3 text-[10.5px] text-t-3"
				>
					#{cardNumber}
				</Typography>
				<Typography
					tag="span"
					className="absolute left-3.5 top-3 text-[10px] font-semibold uppercase tracking-[0.5px] text-t-3"
				>
					{t("review.mode.typing.label")}
				</Typography>

				<Typography
					tag="h2"
					className="mb-1 text-center font-display text-[34px] font-normal leading-[1.2] tracking-[-0.3px] text-t-1 max-md:text-[30px] max-[375px]:text-[26px]"
				>
					{word}
				</Typography>
				{pos ? (
					<Typography className="text-center text-[11.5px] text-t-3 mb-4">
						{pos}
					</Typography>
				) : (
					<div className="mb-4" />
				)}

				<form
					onSubmit={handleSubmit}
					className="w-full max-w-[300px] flex flex-col items-center gap-2"
				>
					<Input
						ref={inputRef}
						value={value}
						onChange={handleChange}
						onKeyDown={handleKeyDown}
						placeholder={t("review.mode.typing.placeholder")}
						autoComplete="off"
						spellCheck={false}
						className={cn(
							"text-center",
							revealed && result === "exact" && "border-grn text-grn-t",
							revealed && result === "typo" && "border-acc text-acc",
							revealed && result === "wrong" && "border-red text-red-t",
						)}
					/>
					{!revealed ? (
						<Button
							type="submit"
							variant="ghost"
							size="default"
							disabled={value.trim() === ""}
						>
							{t("review.mode.typing.check")}
						</Button>
					) : null}
				</form>

				{revealed ? (
					<div className="mt-3 flex flex-col items-center gap-0.5">
						<Typography
							className={cn(
								"text-[13px] font-semibold",
								result === "exact" && "text-grn-t",
								result === "typo" && "text-acc",
								result === "wrong" && "text-red-t",
							)}
						>
							{result === "exact"
								? t("review.mode.typing.exact")
								: result === "typo"
									? t("review.mode.typing.typo")
									: t("review.mode.typing.wrong")}
						</Typography>
						{result !== "exact" ? (
							<Typography className="text-[12px] text-t-3">
								{t("review.mode.typing.answer")}:{" "}
								<span className="font-medium text-t-1">{correctAnswer}</span>
							</Typography>
						) : null}
					</div>
				) : null}
			</div>
		</div>
	);
};
