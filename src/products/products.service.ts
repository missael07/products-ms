import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto } from '../common';

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

    return this.prisma.findManyPaginated(this.prisma.product, {
      where: { available: true },
    } ,{
      page: page || 1,
      pageSize: limit || 10,
    });
  }

  async findOne(id: number) {

    const product = await this.prisma.product.findUnique({
      where: { id, available: true },
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return product;

  }

  async update(id: number, updateProductDto: UpdateProductDto) {

    const { id:__, name, price } = updateProductDto;
    const product = await this.findOne(id);

    return this.prisma.product.update({
      where: { id },
      data: {
        name: name ?? product.name,
        price: price ?? product.price,
        updatedAt: new Date(),
      },
    });
  }

  async remove(id: number) {

    await this.findOne(id);

    return this.prisma.product.update({
      where: { id },
      data: {
        available: false,
        updatedAt: new Date(),
      },
    });

  }
}
