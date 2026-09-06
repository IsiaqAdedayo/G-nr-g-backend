"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var UploadsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadsService = void 0;
const common_1 = require("@nestjs/common");
const node_crypto_1 = require("node:crypto");
let UploadsService = UploadsService_1 = class UploadsService {
    logger = new common_1.Logger(UploadsService_1.name);
    async getSignedUploadUrl(filename, mimeType) {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(mimeType)) {
            throw new Error(`Invalid MIME type: ${mimeType}. Allowed: ${allowedTypes.join(', ')}`);
        }
        const key = `gunrege/uploads/${Date.now()}-${(0, node_crypto_1.randomBytes)(8).toString('hex')}-${filename}`;
        this.logger.log(`Generated upload key: ${key}`);
        return {
            uploadUrl: `https://api.cloudinary.com/v1_1/gunrege/upload?public_id=${key}`,
            key,
            expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
        };
    }
};
exports.UploadsService = UploadsService;
exports.UploadsService = UploadsService = UploadsService_1 = __decorate([
    (0, common_1.Injectable)()
], UploadsService);
//# sourceMappingURL=uploads.service.js.map