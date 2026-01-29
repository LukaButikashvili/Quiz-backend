import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

export type TransactionClient = Omit<
  PrismaClient,
  '$transaction' | '$connect' | '$disconnect' | '$on' | '$extends'
>;

// Prisma 7 driver adapter API lacks proper type definitions
// See: https://github.com/prisma/prisma/issues/23619
function createPrismaClient(): PrismaClient {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  const adapter = new PrismaPg(pool);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  return new PrismaClient({ adapter });
}

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private _client: PrismaClient;

  constructor() {
    this._client = createPrismaClient();
  }

  get quiz() {
    return this._client.quiz;
  }

  get quizBlock() {
    return this._client.quizBlock;
  }

  $transaction<T>(fn: (prisma: TransactionClient) => Promise<T>): Promise<T> {
    return this._client.$transaction(fn);
  }

  async onModuleInit(): Promise<void> {
    try {
      await this._client.$connect();
      console.log('Database Connected Successfully');
    } catch (error) {
      console.log('Failed to Connect Database', error);
    }
  }

  async onModuleDestroy(): Promise<void> {
    try {
      await this._client.$disconnect();
      console.log('Database Disconnected Successfully');
    } catch (error) {
      console.log('Failed to disconnect Database', error);
    }
  }
}
