-- Revert the transient CITEXT type change. Neon pooler connections can cache
-- prepared result types, so a separate normalized key is safer for production.
ALTER TABLE "Compensation" ALTER COLUMN "level" TYPE TEXT USING "level"::TEXT;

ALTER TABLE "Compensation" ADD COLUMN "levelKey" TEXT;
UPDATE "Compensation" SET "levelKey" = LOWER(BTRIM("level"));
ALTER TABLE "Compensation" ALTER COLUMN "levelKey" SET NOT NULL;
CREATE INDEX "Compensation_levelKey_idx" ON "Compensation"("levelKey");
