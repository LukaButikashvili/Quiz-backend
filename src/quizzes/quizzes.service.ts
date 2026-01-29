import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService, TransactionClient } from 'src/prisma/prisma.service';
import { QuizBlockInput } from './dto/types';

@Injectable()
export class QuizzesService {
  constructor(private prisma: PrismaService) {}

  async create({
    publishedAt,
    title,
    blocks,
  }: {
    publishedAt?: Date | null;
    title: string;
    blocks?: QuizBlockInput[];
  }) {
    const newQuiz = await this.prisma.quiz.create({
      data: {
        publishedAt,
        title,
        blocks: blocks?.length
          ? {
              create: blocks.map((block) => ({
                type: block.type,
                order: block.order,
                title: block.title,
                text: block.text,
                questionType: block.questionType,
                options: block.options ?? Prisma.JsonNull,
              })),
            }
          : undefined,
      },
      include: {
        blocks: true,
      },
    });

    return newQuiz;
  }

  async update({
    id,
    title,
    publishedAt,
    blocks,
  }: {
    id: string;
    title?: string;
    publishedAt?: Date | null;
    blocks?: QuizBlockInput[];
  }) {
    const quiz = await this.prisma.quiz.findUnique({ where: { id } });
    if (!quiz) {
      throw new NotFoundException(`Quiz with id ${id} not found`);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
    return this.prisma.$transaction(async (tx: TransactionClient) => {
      await tx.quiz.update({
        where: { id },
        data: {
          title,
          publishedAt,
        },
      });

      if (blocks) {
        await tx.quizBlock.deleteMany({
          where: { quizId: id },
        });

        if (blocks.length > 0) {
          await tx.quizBlock.createMany({
            data: blocks.map((block) => ({
              quizId: id,
              type: block.type,
              order: block.order,
              title: block.title,
              text: block.text,
              questionType: block.questionType,
              options: block.options ?? Prisma.JsonNull,
            })),
          });
        }
      }

      return tx.quiz.findUnique({
        where: { id },
        include: {
          blocks: true,
        },
      });
    });
  }

  async publish(id: string) {
    const quiz = await this.prisma.quiz.findUnique({ where: { id } });
    if (!quiz) {
      throw new NotFoundException(`Quiz with id ${id} not found`);
    }

    return this.prisma.quiz.update({
      where: { id },
      data: {
        publishedAt: new Date(),
      },
    });
  }

  async deleteBlock(id: string) {
    const block = await this.prisma.quizBlock.findUnique({ where: { id } });
    if (!block) {
      throw new NotFoundException(`Block with id ${id} not found`);
    }

    return this.prisma.quizBlock.delete({
      where: { id },
    });
  }

  async getAll() {
    return this.prisma.quiz.findMany();
  }

  async getById(id: string) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id },
      include: {
        blocks: true,
      },
    });

    if (!quiz) {
      throw new NotFoundException(`Quiz with id ${id} not found`);
    }

    return quiz;
  }
}
