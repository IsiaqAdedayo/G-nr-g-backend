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
exports.LooksService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_js_1 = require("../../prisma/prisma.service.js");
let LooksService = class LooksService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, dto) {
        const tryOn = await this.prisma.tryOn.findFirst({
            where: { id: dto.tryOnId, userId, status: 'completed' },
            include: {
                likeness: true,
                garment: true,
                fitAnalysis: true,
            },
        });
        if (!tryOn) {
            throw new common_1.NotFoundException('Completed try-on not found');
        }
        const existing = await this.prisma.look.findUnique({
            where: {
                likenessId_garmentId: {
                    likenessId: tryOn.likenessId,
                    garmentId: tryOn.garmentId,
                },
            },
        });
        if (existing) {
            return this.prisma.look.update({
                where: { id: existing.id },
                data: {
                    tryOnId: tryOn.id,
                    resultImg: tryOn.resultUrl,
                },
                include: {
                    garment: true,
                    likeness: { include: { matchedModel: true } },
                },
            });
        }
        return this.prisma.look.create({
            data: {
                userId,
                likenessId: tryOn.likenessId,
                garmentId: tryOn.garmentId,
                tryOnId: tryOn.id,
                resultImg: tryOn.resultUrl,
            },
            include: {
                garment: true,
                likeness: { include: { matchedModel: true } },
            },
        });
    }
    async findAll(userId) {
        return this.prisma.look.findMany({
            where: { userId },
            include: {
                garment: true,
                likeness: { include: { matchedModel: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async remove(userId, lookId) {
        const look = await this.prisma.look.findFirst({
            where: { id: lookId, userId },
        });
        if (!look)
            throw new common_1.NotFoundException('Look not found');
        return this.prisma.look.delete({ where: { id: lookId } });
    }
};
exports.LooksService = LooksService;
exports.LooksService = LooksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_js_1.PrismaService])
], LooksService);
//# sourceMappingURL=looks.service.js.map