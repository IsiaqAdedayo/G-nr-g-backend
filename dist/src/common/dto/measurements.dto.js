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
exports.CreateMeasurementsDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateMeasurementsDto {
    heightCm;
    bustCm;
    waistCm;
    hipsCm;
    shoulderCm;
    inseamCm;
    weightKg;
}
exports.CreateMeasurementsDto = CreateMeasurementsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Height in centimetres', example: 170 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(100),
    (0, class_validator_1.Max)(230),
    __metadata("design:type", Number)
], CreateMeasurementsDto.prototype, "heightCm", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Bust/chest in centimetres', example: 90 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(50),
    (0, class_validator_1.Max)(160),
    __metadata("design:type", Number)
], CreateMeasurementsDto.prototype, "bustCm", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Natural waist in centimetres', example: 72 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(40),
    (0, class_validator_1.Max)(140),
    __metadata("design:type", Number)
], CreateMeasurementsDto.prototype, "waistCm", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Hips in centimetres', example: 96 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(60),
    (0, class_validator_1.Max)(170),
    __metadata("design:type", Number)
], CreateMeasurementsDto.prototype, "hipsCm", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Shoulder width in centimetres' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(25),
    (0, class_validator_1.Max)(70),
    __metadata("design:type", Number)
], CreateMeasurementsDto.prototype, "shoulderCm", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Inseam in centimetres' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(50),
    (0, class_validator_1.Max)(110),
    __metadata("design:type", Number)
], CreateMeasurementsDto.prototype, "inseamCm", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Weight in kilograms' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(30),
    (0, class_validator_1.Max)(200),
    __metadata("design:type", Number)
], CreateMeasurementsDto.prototype, "weightKg", void 0);
//# sourceMappingURL=measurements.dto.js.map