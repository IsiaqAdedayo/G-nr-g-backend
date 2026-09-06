import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class ModelsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.modelPreset.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const model = await this.prisma.modelPreset.findUnique({ where: { id } });
    if (!model) throw new NotFoundException(`Model ${id} not found`);
    return model;
  }
}
