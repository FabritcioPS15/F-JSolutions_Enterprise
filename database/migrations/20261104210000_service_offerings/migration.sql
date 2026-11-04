-- CreateEnum
CREATE TYPE "ServiceCategory" AS ENUM ('SUPPORT', 'INFRASTRUCTURE', 'SOFTWARE');

-- CreateEnum
CREATE TYPE "ServiceStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "service_offerings" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" "ServiceCategory" NOT NULL,
    "summary" TEXT NOT NULL,
    "intro" TEXT NOT NULL,
    "heroImageSrc" TEXT,
    "heroImageAlt" TEXT,
    "includes" JSONB NOT NULL,
    "faq" JSONB NOT NULL,
    "related" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" "ServiceStatus" NOT NULL DEFAULT 'DRAFT',
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_offerings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "service_offerings_slug_key" ON "service_offerings"("slug");

-- CreateIndex
CREATE INDEX "service_offerings_status_category_position_idx" ON "service_offerings"("status", "category", "position");
