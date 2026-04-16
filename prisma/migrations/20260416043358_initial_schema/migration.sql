-- CreateEnum
CREATE TYPE "WeeklyVolume" AS ENUM ('0-100', '101-500', '501-2000', '2000+', 'undefined');

-- CreateEnum
CREATE TYPE "UseCase" AS ENUM ('customer_service', 'scheduling', 'technical_support', 'ads', 'other');

-- CreateEnum
CREATE TYPE "AwarenessChannel" AS ENUM ('internet_search', 'networking', 'family_friend', 'social_networks_ads', 'webinars_talks', 'fair', 'linkedin', 'podcasts', 'other');

-- CreateEnum
CREATE TYPE "Seasonality" AS ENUM ('constant', 'seasonal', 'undefined');

-- CreateEnum
CREATE TYPE "IntegrationLevel" AS ENUM ('low', 'medium', 'high');

-- CreateEnum
CREATE TYPE "Urgency" AS ENUM ('low', 'medium', 'high');

-- CreateEnum
CREATE TYPE "Industry" AS ENUM ('finance', 'healthcare', 'ecommerce_retail', 'education', 'logistics', 'real_estate', 'legal', 'hospitality_tourism', 'telecommunications', 'gastronomy', 'automotive', 'agriculture', 'professional_services', 'entertainment', 'non_profit');

-- CreateTable
CREATE TABLE "clients" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "salesmen" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "salesmen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales_meetings" (
    "id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "salesman_id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "closed" BOOLEAN NOT NULL DEFAULT false,
    "transcription" TEXT NOT NULL,

    CONSTRAINT "sales_meetings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meeting_categories" (
    "id" TEXT NOT NULL,
    "sales_meeting_id" TEXT NOT NULL,
    "weekly_volume" "WeeklyVolume" NOT NULL,
    "use_case" "UseCase" NOT NULL,
    "industry" "Industry" NOT NULL,
    "awareness_channel" "AwarenessChannel" NOT NULL,
    "seasonality" "Seasonality" NOT NULL,
    "integration_level" "IntegrationLevel" NOT NULL,
    "urgency" "Urgency" NOT NULL,

    CONSTRAINT "meeting_categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "meeting_categories_sales_meeting_id_key" ON "meeting_categories"("sales_meeting_id");

-- AddForeignKey
ALTER TABLE "sales_meetings" ADD CONSTRAINT "sales_meetings_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_meetings" ADD CONSTRAINT "sales_meetings_salesman_id_fkey" FOREIGN KEY ("salesman_id") REFERENCES "salesmen"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meeting_categories" ADD CONSTRAINT "meeting_categories_sales_meeting_id_fkey" FOREIGN KEY ("sales_meeting_id") REFERENCES "sales_meetings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
