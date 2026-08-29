export const COMPENSATION_LEVELS = ["Entry", "Mid", "Senior", "Staff", "Principal"] as const;
export type CompensationLevel = (typeof COMPENSATION_LEVELS)[number];
