-- CreateEnum
CREATE TYPE "StudentNoteType" AS ENUM ('TECHNICAL', 'DISCIPLINARY');

-- CreateTable
CREATE TABLE "student_notes" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "teacherId" INTEGER NOT NULL,
    "type" "StudentNoteType" NOT NULL,
    "content" TEXT NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "seedKey" TEXT,

    CONSTRAINT "student_notes_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "student_notes_seedKey_key" ON "student_notes"("seedKey");
CREATE INDEX "student_notes_studentId_teacherId_idx" ON "student_notes"("studentId", "teacherId");
ALTER TABLE "student_notes" ADD CONSTRAINT "student_notes_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "student_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "student_notes" ADD CONSTRAINT "student_notes_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "teacher_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
