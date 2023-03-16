-- CreateTable
CREATE TABLE "Anime" (
    "dbID" SERIAL NOT NULL,
    "shikimoriID" INTEGER NOT NULL,
    "foundByName" TEXT[],
    "coreData" JSONB NOT NULL,

    CONSTRAINT "Anime_pkey" PRIMARY KEY ("dbID")
);

-- CreateIndex
CREATE UNIQUE INDEX "Anime_shikimoriID_key" ON "Anime"("shikimoriID");

-- CreateIndex
CREATE INDEX "Anime_shikimoriID_idx" ON "Anime"("shikimoriID");

-- CreateIndex
CREATE INDEX "Anime_foundByName_idx" ON "Anime"("foundByName");
