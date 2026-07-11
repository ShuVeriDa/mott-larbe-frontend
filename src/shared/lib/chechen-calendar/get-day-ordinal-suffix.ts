/** 1-ра, 2-гӀа … 20-гӀа, 21-ра, 22-гӀа … 31-гӀа */
export const getDayOrdinalSuffix = (day: number): string =>
	day === 1 || day === 21 ? "-ра" : "-гӀа";
