/*
  Warnings:

  - Added the required column `userId` to the `Deck` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Deck" ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Deck" ADD CONSTRAINT "Deck_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
