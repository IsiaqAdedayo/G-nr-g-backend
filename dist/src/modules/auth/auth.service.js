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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_js_1 = require("../../prisma/prisma.service.js");
const node_crypto_1 = require("node:crypto");
function hashPassword(password, salt) {
    return (0, node_crypto_1.createHash)('sha256').update(`${salt}:${password}`).digest('hex');
}
let AuthService = class AuthService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async register(email, password, name) {
        const existing = await this.prisma.user.findUnique({ where: { email } });
        if (existing) {
            throw new common_1.ConflictException('Email already registered');
        }
        const salt = (0, node_crypto_1.randomBytes)(16).toString('hex');
        const hashedPassword = hashPassword(password, salt);
        const user = await this.prisma.user.create({
            data: {
                email,
                name,
                password: `${salt}:${hashedPassword}`,
            },
        });
        await this.prisma.userProfile.create({
            data: { userId: user.id },
        });
        return { id: user.id, email: user.email, name: user.name };
    }
    async login(email, password) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user || !user.password) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const [salt, storedHash] = user.password.split(':');
        const inputHash = hashPassword(password, salt);
        if (inputHash !== storedHash) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        return {
            access_token: user.id,
            user: { id: user.id, email: user.email, name: user.name },
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_js_1.PrismaService])
], AuthService);
//# sourceMappingURL=auth.service.js.map