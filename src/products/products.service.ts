import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto } from '../common';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {

constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    const product = await this.prisma.product.create({
      data: {
        name: createProductDto.name,
        price: createProductDto.price,
      },
    });
    return product;
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    return this.prisma.findManyPaginated(this.prisma.product, {} ,{
      page: page || 1,
      pageSize: limit || 10,
    });
  }

  findOne(id: number) {
    return this.prisma.product.findUnique({
      where: { id },
    });
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
