
import { Injectable, Logger } from '@nestjs/common';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '../generated/prisma/client';
import { envConfig } from '../config';

  interface PaginationParams {
  page?: number;
  pageSize?: number;
}

@Injectable()
export class PrismaService extends PrismaClient {

  private logger = new Logger('PrismaService');

  constructor() {
    const adapter = new PrismaBetterSqlite3({ url: envConfig.DATABASE_URL });
    super({ adapter });

    this.logger.log('PrismaService initialized');
  }

  async findManyPaginated(
    model: any,
    args: any,
    { page = 1, pageSize = 10 }: PaginationParams
  ) {
    const skip = (page - 1) * pageSize;

    const [data, total] = await Promise.all([
      model.findMany({
        ...args,
        skip,
        take: pageSize,
      }),
      model.count({
        where: args.where,
      }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }
}

