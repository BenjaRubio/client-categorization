/*
  Warnings:

  - The values [ecommerce_retail,hospitality_tourism,entertainment] on the enum `Industry` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Industry_new" AS ENUM ('finance', 'healthcare', 'ecommerce_and_retail', 'education', 'logistics', 'real_estate', 'legal', 'hospitality_and_tourism', 'telecommunications', 'gastronomy', 'automotive', 'agriculture', 'professional_services', 'media_and_entertainment', 'non_profit', 'technology', 'energy', 'construction', 'art_and_design');
ALTER TABLE "meeting_categories" ALTER COLUMN "industry" TYPE "Industry_new" USING ("industry"::text::"Industry_new");
ALTER TYPE "Industry" RENAME TO "Industry_old";
ALTER TYPE "Industry_new" RENAME TO "Industry";
DROP TYPE "Industry_old";
COMMIT;
