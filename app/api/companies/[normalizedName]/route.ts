import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_: NextRequest, { params }: { params: Promise<{ normalizedName: string }> }) {
  const { normalizedName } = await params;
  const company = await prisma.company.findUnique({ where: { normalizedName }, select: { id: true, name: true, normalizedName: true, industry: true, createdAt: true } });
  if (!company) return NextResponse.json({ error: "Company not found." }, { status: 404 });
  const [summary, byLevel, records] = await prisma.$transaction([
    prisma.compensation.aggregate({ where: { companyId: company.id }, _count: true, _avg: { baseSalary: true, bonus: true, stock: true, totalComp: true }, _min: { totalComp: true }, _max: { totalComp: true } }),
    prisma.compensation.groupBy({ by: ["level"], where: { companyId: company.id }, _count: true, _avg: { baseSalary: true, bonus: true, stock: true, totalComp: true }, orderBy: { _avg: { totalComp: "asc" } } }),
    prisma.compensation.findMany({ where: { companyId: company.id }, select: { id: true, role: true, level: true, location: true, baseSalary: true, bonus: true, stock: true, totalComp: true, yearsExperience: true, createdAt: true }, orderBy: { totalComp: "desc" }, take: 20 }),
  ]);
  return NextResponse.json({ data: { company, summary, byLevel, records } });
}
