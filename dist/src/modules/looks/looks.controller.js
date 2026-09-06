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
exports.LooksController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const looks_service_js_1 = require("./looks.service.js");
const look_dto_js_1 = require("../../common/dto/look.dto.js");
const auth_guard_js_1 = require("../../common/guards/auth.guard.js");
let LooksController = class LooksController {
    looksService;
    constructor(looksService) {
        this.looksService = looksService;
    }
    async findAll(req) {
        return this.looksService.findAll(req.userId);
    }
    async create(req, dto) {
        return this.looksService.create(req.userId, dto);
    }
    async remove(id, req) {
        return this.looksService.remove(req.userId, id);
    }
};
exports.LooksController = LooksController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all saved looks' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LooksController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Save a try-on result as a Look' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, look_dto_js_1.CreateLookDto]),
    __metadata("design:returntype", Promise)
], LooksController.prototype, "create", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a saved look' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LooksController.prototype, "remove", null);
exports.LooksController = LooksController = __decorate([
    (0, swagger_1.ApiTags)('Looks'),
    (0, common_1.Controller)('looks'),
    (0, common_1.UseGuards)(auth_guard_js_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [looks_service_js_1.LooksService])
], LooksController);
//# sourceMappingURL=looks.controller.js.map