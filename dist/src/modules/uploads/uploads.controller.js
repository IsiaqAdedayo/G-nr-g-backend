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
exports.UploadsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const uploads_service_js_1 = require("./uploads.service.js");
const auth_guard_js_1 = require("../../common/guards/auth.guard.js");
const class_validator_1 = require("class-validator");
class GetUploadUrlDto {
    filename;
    mimeType;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetUploadUrlDto.prototype, "filename", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['image/jpeg', 'image/png', 'image/webp']),
    __metadata("design:type", String)
], GetUploadUrlDto.prototype, "mimeType", void 0);
let UploadsController = class UploadsController {
    uploadsService;
    constructor(uploadsService) {
        this.uploadsService = uploadsService;
    }
    async getSignedUrl(dto) {
        return this.uploadsService.getSignedUploadUrl(dto.filename, dto.mimeType);
    }
};
exports.UploadsController = UploadsController;
__decorate([
    (0, common_1.Post)('signed-url'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a signed upload URL' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [GetUploadUrlDto]),
    __metadata("design:returntype", Promise)
], UploadsController.prototype, "getSignedUrl", null);
exports.UploadsController = UploadsController = __decorate([
    (0, swagger_1.ApiTags)('Uploads'),
    (0, common_1.Controller)('uploads'),
    (0, common_1.UseGuards)(auth_guard_js_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [uploads_service_js_1.UploadsService])
], UploadsController);
//# sourceMappingURL=uploads.controller.js.map