/*
  Warnings:

  - You are about to drop the `LessonScriptLine` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[code]` on the table `Lesson` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `Lesson` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "LessonScriptLine" DROP CONSTRAINT "LessonScriptLine_lessonId_fkey";

-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "observations" TEXT;

-- DropTable
DROP TABLE "LessonScriptLine";

-- CreateTable
CREATE TABLE "LessonLine" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "languageCode" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "audioUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LessonLine_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Lesson_code_key" ON "Lesson"("code");

-- AddForeignKey
ALTER TABLE "LessonLine" ADD CONSTRAINT "LessonLine_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
