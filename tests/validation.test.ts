import assert from "node:assert/strict";
import test from "node:test";
import { compensationSchema, normalizeCompanyName, normalizeLevel } from "../lib/validation";

const payload = { company: "  Acme,   Inc. ", role: "  Software   Engineer ", location: " New   York, USA ", baseSalary: 100_000, bonus: 0, stock: 0, currency: "USD" as const };

test("canonicalizes all supported level casing variants", () => {
  for (const level of ["Senior", "senior", "SENIOR", " Senior "]) assert.equal(normalizeLevel(level), "Senior");
  assert.equal(normalizeLevel("staff"), "Staff");
  assert.equal(normalizeLevel("ENTRY"), "Entry");
});

test("normalizes structured display text and computes total compensation", () => {
  const result = compensationSchema.parse({ ...payload, level: " senior " });
  assert.deepEqual(result, { ...payload, company: "Acme, Inc.", role: "Software Engineer", location: "New York, USA", level: "Senior", totalComp: 100_000 });
  assert.equal(normalizeCompanyName(" Acme,   Inc. "), "acmeinc");
});

test("rejects unsupported levels", () => {
  assert.equal(compensationSchema.safeParse({ ...payload, level: "Lead" }).success, false);
});
