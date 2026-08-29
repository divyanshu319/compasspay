import { z } from "zod";
const optionalNumber = z.preprocess((value) => value === "" || value === null ? undefined : value, z.coerce.number().finite().min(0).max(60).optional());
export const compensationSchema = z.object({
  company: z.string().trim().min(2).max(80), role: z.string().trim().min(2).max(80), level: z.string().trim().min(1).max(30),
  location: z.string().trim().min(2).max(80), currency: z.literal("USD").default("USD"),
  baseSalary: z.coerce.number().finite().int().min(0).max(2_000_000), bonus: z.coerce.number().finite().int().min(0).max(2_000_000).default(0),
  stock: z.coerce.number().finite().int().min(0).max(5_000_000).default(0), yearsExperience: optionalNumber
}).transform((v) => ({ ...v, totalComp: v.baseSalary + v.bonus + v.stock }));
export const authSchema = z.object({ name: z.string().trim().min(2).max(60), email: z.string().trim().email().transform((email) => email.toLowerCase()), password: z.string().min(8).max(100) });
export const loginSchema = authSchema.pick({ email: true, password: true });
const COMPANY_ALIASES: Record<string, string> = { googlellc: "google", alphabet: "google", metaplatforms: "meta", microsoftcorporation: "microsoft", amazoncom: "amazon", amazoninc: "amazon" };
export function normalizeCompanyName(name: string) { const normalized = name.toLowerCase().replace(/[^a-z0-9]/g, ""); return COMPANY_ALIASES[normalized] ?? normalized; }
