/*
Warnings:

- You are about to drop the column `flashcardId` on the `ReviewHistory` table. All the data in the column will be lost.
- You are about to drop the column `flashcardId` on the `UserProgress` table. All the data in the column will be lost.
- You are about to drop the `Flashcard` table. If the table is not empty, all the data it contains will be lost.
- A unique constraint covering the columns `[userId,cardId]` on the table `UserProgress` will be added. If there are existing duplicate values, this will fail.
- Added the required column `cardId` to the `ReviewHistory` table without a default value. This is not possible if the table is not empty.
- Added the required column `cardId` to the `UserProgress` table without a default value. This is not possible if the table is not empty.

 */
-- DropForeignKey
ALTER TABLE "ReviewHistory"
DROP CONSTRAINT "ReviewHistory_flashcardId_fkey";

-- DropForeignKey
ALTER TABLE "UserProgress"
DROP CONSTRAINT "UserProgress_flashcardId_fkey";

-- DropIndex
DROP INDEX "UserProgress_userId_flashcardId_key";

-- CreateTable
CREATE TABLE
  "Deck" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    CONSTRAINT "Deck_pkey" PRIMARY KEY ("id")
  );

-- CreateTable
CREATE TABLE
  "Card" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "text" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "meaning" TEXT,
    "audioUrl" TEXT,
    "type" "CardType" NOT NULL,
    "complexity" INTEGER NOT NULL,
    "explanation" TEXT,
    "deck_id" TEXT,
    CONSTRAINT "Card_pkey" PRIMARY KEY ("id")
  );

INSERT INTO
  "Card" (
    id,
    text,
    language,
    meaning,
    "audioUrl",
    type,
    complexity,
    explanation
  )
SELECT
  id,
  hiragana,
  'jp-JP' AS language,
  meaning,
  "audioUrl",
  type,
  complexity,
  explanation
FROM
  "Flashcard";

-- AlterTable
ALTER TABLE "Lesson"
ADD COLUMN "deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "ReviewHistory"
ADD COLUMN "cardId" TEXT NOT NULL;

UPDATE "ReviewHistory"
SET
  "cardId" = "flashcardId";

ALTER TABLE "ReviewHistory"
DROP COLUMN "flashcardId";

-- AlterTable
ALTER TABLE "UserProgress"
ADD COLUMN "cardId" TEXT NOT NULL;

UPDATE "UserProgress"
SET
  "cardId" = "flashcardId";

ALTER TABLE "UserProgress"
DROP COLUMN "flashcardId";

-- CreateIndex
CREATE UNIQUE INDEX "Card_text_key" ON "Card" ("text");

-- CreateIndex
CREATE UNIQUE INDEX "UserProgress_userId_cardId_key" ON "UserProgress" ("userId", "cardId");

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_deck_id_fkey" FOREIGN KEY ("deck_id") REFERENCES "Deck" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProgress" ADD CONSTRAINT "UserProgress_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewHistory" ADD CONSTRAINT "ReviewHistory_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- DropTable
DROP TABLE "Flashcard";