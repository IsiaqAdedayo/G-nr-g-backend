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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TryOnsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const try_ons_service_js_1 = require("./try-ons.service.js");
const try_on_dto_js_1 = require("../../common/dto/try-on.dto.js");
const auth_guard_js_1 = require("../../common/guards/auth.guard.js");
let TryOnsController = class TryOnsController {
    tryOnsService;
    constructor(tryOnsService) {
        this.tryOnsService = tryOnsService;
    }
    async create(req, dto) {
        return this.tryOnsService.create(req.userId, dto);
    }
    async findOne(id, req) {
        return this.tryOnsService.findOne(id, req.userId);
    }
    async getStatus(id, req) {
        return this.tryOnsService.getStatus(id, req.userId);
    }
};
exports.TryOnsController = TryOnsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a virtual try-on job' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, try_on_dto_js_1.CreateTryOnDto]),
    __metadata("design:returntype", Promise)
], TryOnsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get try-on result with fit analysis' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TryOnsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Get try-on job status (for polling)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TryOnsController.prototype, "getStatus", null);
exports.TryOnsController = TryOnsController = __decorate([
    (0, swagger_1.ApiTags)('Try-Ons'),
    (0, common_1.Controller)('try-ons'),
    (0, common_1.UseGuards)(auth_guard_js_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [try_ons_service_js_1.TryOnsService])
], TryOnsController);
//# sourceMappingURL=try-ons.controller.js.map