import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { compensationSchema, normalizeCompanyName } from "@/lib/validation";

function boundedInteger(value: string | null, fallback: number, max: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? Math.min(parsed, max) : fallback;
}

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const q = params.get("q")?.trim();
  const level = params.get("level")?.trim();
  const location = params.get("location")?.trim();
  const page = boundedInteger(params.get("page"), 1, 10_000);
  const take = boundedInteger(params.get("take"), 15, 50);
  const sortValue = params.get("sort");
  const orderBy = sortValue === "recent" ? { createdAt: "desc" as const } : sortValue === "baseSalary" ? { baseSalary: "desc" as const } : { totalComp: "desc" as const };
  const where: Prisma.CompensationWhereInput = {
    ...(q ? { OR: [{ role: { contains: q, mode: "insensitive" } }, { company: { name: { contains: q, mode: "insensitive" } } }] } : {}),
    ...(level ? { level } : {}),
    ...(location ? { location: { contains: location, mode: "insensitive" } } : {}),
  };
  const [data, total] = await prisma.$transaction([
    prisma.compensation.findMany({ where, include: { company: { select: { name: true, normalizedName: true } } }, orderBy, skip: (page - 1) * take, take }),
    prisma.compensation.count({ where }),
  ]);
  return NextResponse.json({ data, meta: { page, take, total, pages: Math.max(1, Math.ceil(total / take)) } });
}

export async function POST(req: NextRequest) {
  try {
    const parsed = compensationSchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ error: "Invalid compensation", details: parsed.error.flatten().fieldErrors }, { status: 400 });
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "Please sign in before submitting compensation." }, { status: 401 });
    const value = parsed.data;
    const company = await prisma.company.upsert({ where: { normalizedName: normalizeCompanyName(value.company) }, create: { name: value.company, normalizedName: normalizeCompanyName(value.company) }, update: {} });
    const record = await prisma.compensation.create({ data: { ...value, company: { connect: { id: company.id } }, user: { connect: { id: user.id } } } });
    return NextResponse.json({ data: record }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") return NextResponse.json({ error: "This compensation entry already exists." }, { status: 409 });
    console.error("Compensation submission failed", error);
    return NextResponse.json({ error: "Unable to save compensation. Please try again." }, { status: 500 });
  }
}
