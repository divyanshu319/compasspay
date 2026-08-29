import { PrismaClient } from "@prisma/client";
const prisma=new PrismaClient();
const rows=[
 ["Google","Software Engineer","Senior","Bengaluru, India",95000,18000,42000,6],["Microsoft","Software Engineer","Senior","Bengaluru, India",78000,12000,26000,5],
 ["Amazon","Software Engineer","Senior","Bengaluru, India",82000,14000,31000,6],["Atlassian","Software Engineer","Senior","Bengaluru, India",88000,12000,36000,5],
 ["Google","Software Engineer","Mid","Hyderabad, India",62000,10000,24000,3],["Microsoft","Product Manager","Senior","Hyderabad, India",72000,14000,21000,7],
 ["Razorpay","Software Engineer","Mid","Bengaluru, India",46000,8000,14000,3],["Flipkart","Data Scientist","Senior","Bengaluru, India",58000,9000,18000,6],
 ["Meta","Software Engineer","Staff","Menlo Park, USA",210000,45000,190000,9],["Stripe","Software Engineer","Senior","New York, USA",185000,30000,130000,6]
] as const;
async function main(){for(const [name,role,level,location,baseSalary,bonus,stock,yearsExperience] of rows){const normalizedName=name.toLowerCase().replace(/[^a-z0-9]/g,'');const company=await prisma.company.upsert({where:{normalizedName},create:{name,normalizedName},update:{}});await prisma.compensation.upsert({where:{companyId_role_level_location_baseSalary_bonus_stock:{companyId:company.id,role,level,location,baseSalary,bonus,stock}},create:{companyId:company.id,role,level,location,baseSalary,bonus,stock,totalComp:baseSalary+bonus+stock,yearsExperience},update:{}})}}main().finally(()=>prisma.$disconnect());
