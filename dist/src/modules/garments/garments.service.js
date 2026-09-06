"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GarmentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_js_1 = require("../../prisma/prisma.service.js");
let GarmentsService = class GarmentsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(filters) {
        const page = filters.page ?? 1;
        const limit = Math.min(filters.limit ?? 20, 100);
        const skip = (page - 1) * limit;
        const where = {};
        if (filters.category)
            where.category = filters.category;
        if (filters.fit)
            where.fit = filters.fit;
        if (filters.brandId)
            where.brandId = filters.brandId;
        if (filters.size)
            where.sizes = { has: filters.size };
        if (filters.maxPrice || filters.minPrice) {
            where.price = {};
            if (filters.maxPrice)
                where.price.lte = filters.maxPrice;
            if (filters.minPrice)
                where.price.gte = filters.minPrice;
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
    async findOne(id) {
        const garment = await this.prisma.garment.findUnique({
            where: { id },
            include: { brand: true },
        });
        if (!garment)
            throw new common_1.NotFoundException(`Garment ${id} not found`);
        return garment;
    }
};
exports.GarmentsService = GarmentsService;
exports.GarmentsService = GarmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_js_1.PrismaService])
], GarmentsService);
//# sourceMappingURL=garments.service.js.map