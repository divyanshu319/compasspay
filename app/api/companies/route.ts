import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();
  const rawPage = Number(req.nextUrl.searchParams.get("page"));
  const page = Number.isInteger(rawPage) && rawPage > 0 ? Math.min(rawPage, 10_000) : 1;
  const take = 12;
  const where = q ? { name: { contains: q, mode: "insensitive" as const } } : {};
  const [data, total] = await prisma.$transaction([
    prisma.company.findMany({ where, select: { name: true, normalizedName: true, industry: true, _count: { select: { compensations: true } } }, orderBy: { name: "asc" }, skip: (page - 1) * take, take }),
    prisma.company.count({ where }),
  ]);
  return NextResponse.json({ data, meta: { page, take, total, pages: Math.max(1, Math.ceil(total / take)) } });
}
