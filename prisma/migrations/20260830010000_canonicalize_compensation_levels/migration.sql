-- Canonicalize only the five levels supported by the product. Unknown historical
-- values are intentionally preserved rather than silently rewritten or deleted.
UPDATE "Compensation"
SET "level" = CASE LOWER(BTRIM("level"))
  WHEN 'entry' THEN 'Entry'
  WHEN 'mid' THEN 'Mid'
  WHEN 'senior' THEN 'Senior'
  WHEN 'staff' THEN 'Staff'
  WHEN 'principal' THEN 'Principal'
  ELSE "level"
END
WHERE LOWER(BTRIM("level")) IN ('entry', 'mid', 'senior', 'staff', 'principal');

-- Case-insensitive equality keeps the API filter compatible with any remaining
-- legacy casing while retaining normal PostgreSQL B-tree index behaviour.
CREATE EXTENSION IF NOT EXISTS citext;
ALTER TABLE "Compensation" ALTER COLUMN "level" TYPE CITEXT USING "level"::CITEXT;
