import { BlockType, Prisma, QuestionType } from '@prisma/client';

export type QuizBlockInput = {
  type: BlockType;
  order?: number | null;
  title?: string | null;
  text?: string | null;
  questionType?: QuestionType | null;
  options?: Prisma.JsonValue | null;
};
