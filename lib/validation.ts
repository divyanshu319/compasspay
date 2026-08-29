import { z } from "zod";
import { COMPENSATION_LEVELS, type CompensationLevel } from "@/lib/compensation";
export { COMPENSATION_LEVELS } from "@/lib/compensation";
const LEVEL_BY_KEY: Record<string, CompensationLevel> = { entry: "Entry", mid: "Mid", senior: "Senior", staff: "Staff", principal: "Principal" };
export function normalizeDisplayText(value: string) { return value.trim().replace(/\s+/g, " "); }
export function normalizeLevel(value: string): CompensationLevel | undefined { return LEVEL_BY_KEY[normalizeDisplayText(value).toLowerCase()]; }
const displayText = (min: number, max: number) => z.string().transform(normalizeDisplayText).pipe(z.string().min(min).max(max));
const levelSchema = z.string().transform(normalizeDisplayText).transform((value, context) => { const level = normalizeLevel(value); if (level) return level; context.addIssue({ code: z.ZodIssueCode.custom, message: `Level must be one of: ${COMPENSATION_LEVELS.join(", ")}.` }); return z.NEVER; });
const optionalNumber = z.preprocess((value) => value === "" || value === null ? undefined : value, z.coerce.number().finite().min(0).max(60).optional());
export const compensationSchema = z.object({
  company: displayText(2, 80), role: displayText(2, 80), level: levelSchema,
  location: displayText(2, 80), currency: z.literal("USD").default("USD"),
  baseSalary: z.coerce.number().finite().int().min(0).max(2_000_000), bonus: z.coerce.number().finite().int().min(0).max(2_000_000).default(0),
  stock: z.coerce.number().finite().int().min(0).max(5_000_000).default(0), yearsExperience: optionalNumber
}).transform((v) => ({ ...v, totalComp: v.baseSalary + v.bonus + v.stock }));
export const authSchema = z.object({ name: z.string().trim().min(2).max(60), email: z.string().trim().email().transform((email) => email.toLowerCase()), password: z.string().min(8).max(100) });
export const loginSchema = authSchema.pick({ email: true, password: true });
const COMPANY_ALIASES: Record<string, string> = { googlellc: "google", alphabet: "google", metaplatforms: "meta", microsoftcorporation: "microsoft", amazoncom: "amazon", amazoninc: "amazon" };
export function normalizeCompanyName(name: string) { const normalized = normalizeDisplayText(name).toLowerCase().replace(/[^a-z0-9]/g, ""); return COMPANY_ALIASES[normalized] ?? normalized; }
