import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { GarmentFilterDto } from '../../common/dto/garment.dto.js';

@Injectable()
export class GarmentsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * GET /garments — Browse catalog with filters.
   * All data is seeded server-side only (§4.1).
   */
  async findAll(filters: GarmentFilterDto) {
    const page = filters.page ?? 1;
    const limit = Math.min(filters.limit ?? 20, 100);
    const skip = (page - 1) * limit;

    const where: any = {};

    if (filters.category) where.category = filters.category;
    if (filters.fit) where.fit = filters.fit;
    if (filters.brandId) where.brandId = filters.brandId;
    if (filters.size) where.sizes = { has: filters.size };
    if (filters.maxPrice || filters.minPrice) {
      where.price = {};
      if (filters.maxPrice) where.price.lte = filters.maxPrice;
      if (filters.minPrice) where.price.gte = filters.minPrice;
    }

    const [items, total] = await Promise.all([
      this.prisma.garment.findMany({
        where,
        include: { brand: true },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.garment.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * GET /garments/:id — Single garment details.
   */
  async findOne(id: string) {
    const garment = await this.prisma.garment.findUnique({
      where: { id },
      include: { brand: true },
    });

    if (!garment) throw new NotFoundException(`Garment ${id} not found`);
    return garment;
  }
}
