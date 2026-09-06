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
exports.LikenessController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const likeness_service_js_1 = require("./likeness.service.js");
const likeness_dto_js_1 = require("../../common/dto/likeness.dto.js");
const auth_guard_js_1 = require("../../common/guards/auth.guard.js");
let LikenessController = class LikenessController {
    likenessService;
    constructor(likenessService) {
        this.likenessService = likenessService;
    }
    async match(req, dto) {
        return this.likenessService.matchAndPersist(req.userId, dto.skinTone);
    }
    async get(req) {
        return this.likenessService.get(req.userId);
    }
    async update(req, body) {
        return this.likenessService.update(req.userId, body);
    }
};
exports.LikenessController = LikenessController;
__decorate([
    (0, common_1.Post)('match'),
    (0, swagger_1.ApiOperation)({ summary: 'Run model matching and persist likeness' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, likeness_dto_js_1.MatchLikenessDto]),
    __metadata("design:returntype", Promise)
], LikenessController.prototype, "match", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get active likeness' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LikenessController.prototype, "get", null);
__decorate([
    (0, common_1.Patch)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update likeness (e.g. adjust matched model)' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], LikenessController.prototype, "update", null);
exports.LikenessController = LikenessController = __decorate([
    (0, swagger_1.ApiTags)('Likeness'),
    (0, common_1.Controller)('likeness'),
    (0, common_1.UseGuards)(auth_guard_js_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [likeness_service_js_1.LikenessService])
], LikenessController);
//# sourceMappingURL=likeness.controller.js.map