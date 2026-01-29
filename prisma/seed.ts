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
      title: 'Quiz',
      publishedAt: new Date(),
      blocks: {
        create: [
          {
            type: 'header',
            order: 0,
            title: 'Welcome!',
          },
          {
            type: 'question',
            order: 1,
            title: 'What is the capital of France?',
            questionType: 'single',
            options: ['London', 'Paris', 'Berlin', 'Madrid'],
          },
          {
            type: 'question',
            order: 2,
            title: 'Which planets are known as gas giants?',
            questionType: 'multi',
            options: ['Mars', 'Jupiter', 'Saturn', 'Venus'],
          },
          {
            type: 'question',
            order: 3,
            title: 'What is 7 x 8?',
            questionType: 'text',
          },
          {
            type: 'footer',
            order: 4,
            text: 'Thanks for taking the quiz!',
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
            order: 0,
            title: 'Programming Fundamentals',
          },
          {
            type: 'question',
            order: 1,
            title: 'Which of these is a JavaScript framework?',
            questionType: 'single',
            options: ['Django', 'React', 'Laravel', 'Rails'],
          },
          {
            type: 'question',
            order: 2,
            title: 'What does HTML stand for?',
            questionType: 'text',
          },
          {
            type: 'button',
            order: 3,
            title: 'Submit Quiz',
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
