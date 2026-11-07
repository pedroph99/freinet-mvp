/*
  Warnings:

  - You are about to drop the column `foto` on the `student_profiles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "student_profiles" DROP COLUMN "foto",
ADD COLUMN     "photo" TEXT;
