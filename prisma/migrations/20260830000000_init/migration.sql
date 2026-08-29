-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "normalizedName" TEXT NOT NULL,
    "logoText" TEXT,
    "industry" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Compensation" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "userId" TEXT,
    "role" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "baseSalary" INTEGER NOT NULL,
    "bonus" INTEGER NOT NULL DEFAULT 0,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "totalComp" INTEGER NOT NULL,
    "yearsExperience" DOUBLE PRECISION,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Compensation_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "Company_name_key" ON "Company"("name");
CREATE UNIQUE INDEX "Company_normalizedName_key" ON "Company"("normalizedName");
CREATE INDEX "Compensation_role_level_location_idx" ON "Compensation"("role", "level", "location");
CREATE INDEX "Compensation_totalComp_idx" ON "Compensation"("totalComp");
CREATE INDEX "Compensation_companyId_totalComp_idx" ON "Compensation"("companyId", "totalComp");
CREATE INDEX "Compensation_createdAt_idx" ON "Compensation"("createdAt");
CREATE UNIQUE INDEX "Compensation_companyId_role_level_location_baseSalary_bonus_key" ON "Compensation"("companyId", "role", "level", "location", "baseSalary", "bonus", "stock");

ALTER TABLE "Compensation" ADD CONSTRAINT "Compensation_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Compensation" ADD CONSTRAINT "Compensation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
