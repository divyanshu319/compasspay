import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function GET(_:NextRequest,{params}:{params:Promise<{id:string}>}) { const {id}=await params; const data=await prisma.compensation.findUnique({where:{id},include:{company:true}}); return data?NextResponse.json({data}):NextResponse.json({error:"Not found"},{status:404}); }
