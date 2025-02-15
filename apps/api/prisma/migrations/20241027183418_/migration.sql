/*
  Warnings:

  - A unique constraint covering the columns `[hiragana]` on the table `Flashcard` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Flashcard_hiragana_key" ON "Flashcard"("hiragana");
