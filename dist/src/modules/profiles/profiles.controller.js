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
exports.ProfilesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const profiles_service_js_1 = require("./profiles.service.js");
const measurements_dto_js_1 = require("../../common/dto/measurements.dto.js");
const appearance_dto_js_1 = require("../../common/dto/appearance.dto.js");
const profile_dto_js_1 = require("../../common/dto/profile.dto.js");
const auth_guard_js_1 = require("../../common/guards/auth.guard.js");
let ProfilesController = class ProfilesController {
    profilesService;
    constructor(profilesService) {
        this.profilesService = profilesService;
    }
    async getMe(req) {
        return this.profilesService.getUser(req.userId);
    }
    async updateMe(req, body) {
        return this.profilesService.updateUser(req.userId, body);
    }
    async getBody(req) {
        return this.profilesService.getBody(req.userId);
    }
    async upsertBody(req, dto) {
        return this.profilesService.upsertBody(req.userId, dto);
    }
    async getAppearance(req) {
        return this.profilesService.getAppearance(req.userId);
    }
    async upsertAppearance(req, dto) {
        return this.profilesService.upsertAppearance(req.userId, dto);
    }
    async updateProfile(req, dto) {
        return this.profilesService.updateProfile(req.userId, dto);
    }
};
exports.ProfilesController = ProfilesController;
__decorate([
    (0, common_1.Get)('users/me'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user with full profile' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProfilesController.prototype, "getMe", null);
__decorate([
    (0, common_1.Patch)('users/me'),
    (0, swagger_1.ApiOperation)({ summary: 'Update current user' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProfilesController.prototype, "updateMe", null);
__decorate([
    (0, common_1.Get)('profiles/body'),
    (0, swagger_1.ApiOperation)({ summary: 'Get body measurements' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProfilesController.prototype, "getBody", null);
__decorate([
    (0, common_1.Put)('profiles/body'),
    (0, swagger_1.ApiOperation)({ summary: 'Create or update body measurements' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, measurements_dto_js_1.CreateMeasurementsDto]),
    __metadata("design:returntype", Promise)
], ProfilesController.prototype, "upsertBody", null);
__decorate([
    (0, common_1.Get)('profiles/appearance'),
    (0, swagger_1.ApiOperation)({ summary: 'Get appearance profile' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProfilesController.prototype, "getAppearance", null);
__decorate([
    (0, common_1.Put)('profiles/appearance'),
    (0, swagger_1.ApiOperation)({ summary: 'Create or update appearance profile' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, appearance_dto_js_1.CreateAppearanceDto]),
    __metadata("design:returntype", Promise)
], ProfilesController.prototype, "upsertAppearance", null);
__decorate([
    (0, common_1.Patch)('profiles'),
    (0, swagger_1.ApiOperation)({ summary: 'Update profile settings (unit, bodyShape)' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, profile_dto_js_1.UpdateProfileDto]),
    __metadata("design:returntype", Promise)
], ProfilesController.prototype, "updateProfile", null);
exports.ProfilesController = ProfilesController = __decorate([
    (0, swagger_1.ApiTags)('Profiles'),
    (0, common_1.Controller)(),
    (0, common_1.UseGuards)(auth_guard_js_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [profiles_service_js_1.ProfilesService])
], ProfilesController);
//# sourceMappingURL=profiles.controller.js.map