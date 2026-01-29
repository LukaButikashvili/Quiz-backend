import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.quizBlock.deleteMany();
  await prisma.quiz.deleteMany();

  await prisma.quiz.create({
    data: {
      title: 'General Knowledge Quiz',
      publishedAt: new Date(),
      blocks: {
        create: [
          {
            type: 'header',
            order: 1,
            title: 'Welcome to the Quiz!',
          },
          {
            type: 'question',
            order: 2,
            title: 'What is the capital of France?',
            questionType: 'single',
            options: [
              { id: '1', label: 'Paris', isCorrectAnswer: true },
              { id: '2', label: 'London', isCorrectAnswer: false },
              { id: '3', label: 'Berlin', isCorrectAnswer: false },
              { id: '4', label: 'Madrid', isCorrectAnswer: false },
            ],
          },
          {
            type: 'question',
            order: 3,
            title: 'Which planets are known as gas giants?',
            questionType: 'multi',
            options: [
              { id: '1', label: 'Mars', isCorrectAnswer: false },
              { id: '2', label: 'Jupiter', isCorrectAnswer: true },
              { id: '3', label: 'Saturn', isCorrectAnswer: true },
              { id: '4', label: 'Venus', isCorrectAnswer: false },
            ],
          },
          {
            type: 'question',
            order: 4,
            title: 'What is 7 x 8?',
            questionType: 'text',
            options: [
              { id: '1', label: 'Option 1', isCorrectAnswer: false },
              { id: '2', label: 'Option 2', isCorrectAnswer: false },
            ],
          },
          {
            type: 'footer',
            order: 999,
            title: 'Thanks for taking the quiz!',
          },
        ],
      },
    },
    include: { blocks: true },
  });

  await prisma.quiz.create({
    data: {
      title: 'Programming Basics',
      publishedAt: null,
      blocks: {
        create: [
          {
            type: 'header',
            order: 1,
            title: 'Programming Fundamentals',
          },
          {
            type: 'question',
            order: 2,
            title: 'Which of these is a JavaScript framework?',
            questionType: 'single',
            options: [
              { id: '1', label: 'React', isCorrectAnswer: true },
              { id: '2', label: 'Django', isCorrectAnswer: false },
              { id: '3', label: 'Laravel', isCorrectAnswer: false },
            ],
          },
          {
            type: 'question',
            order: 3,
            title: 'What does HTML stand for?',
            questionType: 'text',
            options: [
              { id: '1', label: 'Option 1', isCorrectAnswer: false },
              { id: '2', label: 'Option 2', isCorrectAnswer: false },
              { id: '3', label: 'Option 3', isCorrectAnswer: false },
            ],
          },
          {
            type: 'footer',
            order: 999,
            title: 'Quiz Footer!',
          },
        ],
      },
    },
    include: { blocks: true },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
