-- CreateEnum
CREATE TYPE "UpdatePeriod" AS ENUM ('H12', 'WEEK', 'MONTH');

-- AlterTable
ALTER TABLE "Anime" ADD COLUMN     "updatePeriod" "UpdatePeriod" NOT NULL DEFAULT 'MONTH',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "Anime_updatedAt_idx" ON "Anime"("updatedAt");

-- CreateIndex
CREATE INDEX "Anime_updatePeriod_idx" ON "Anime"("updatePeriod");
