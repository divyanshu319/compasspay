import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function GET(req:NextRequest) { const ids=(req.nextUrl.searchParams.get("ids")??"").split(",").filter(Boolean); if(ids.length<2||ids.length>3)return NextResponse.json({error:"Choose 2 or 3 compensation entries."},{status:400}); const data=await prisma.compensation.findMany({where:{id:{in:ids}},include:{company:{select:{name:true}}}}); return data.length===ids.length?NextResponse.json({data}):NextResponse.json({error:"One or more records no longer exist."},{status:404}); }
