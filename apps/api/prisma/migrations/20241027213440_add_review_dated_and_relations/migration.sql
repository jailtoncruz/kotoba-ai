/*
  Warnings:

  - A unique constraint covering the columns `[userId,flashcardId]` on the table `UserProgress` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "UserProgress" ADD COLUMN     "lastReviewed" TIMESTAMP(3),
ADD COLUMN     "nextReviewDate" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "UserProgress_userId_flashcardId_key" ON "UserProgress"("userId", "flashcardId");
