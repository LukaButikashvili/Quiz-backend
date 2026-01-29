-- CreateEnum
CREATE TYPE "BlockType" AS ENUM ('header', 'question', 'button', 'footer');

-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('single', 'multi', 'text');

-- CreateTable
CREATE TABLE "Quiz" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3),

    CONSTRAINT "Quiz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuizBlock" (
    "id" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "type" "BlockType" NOT NULL,
    "order" INTEGER,
    "title" TEXT,
    "text" TEXT,
    "questionType" "QuestionType",
    "options" JSONB,

    CONSTRAINT "QuizBlock_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "QuizBlock" ADD CONSTRAINT "QuizBlock_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;
