"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FitEngineService = void 0;
const common_1 = require("@nestjs/common");
function getThresholds(stretch, fit) {
    const base = { tight: -2, close: 2, roomy: 5 };
    const stretchMod = { none: 0, low: 0.5, medium: 1.5, high: 3 };
    const sm = stretchMod[stretch] ?? 0;
    const fitMod = { slim: -1, regular: 0, relaxed: 2, oversized: 5 };
    const fm = fitMod[fit] ?? 0;
    return {
        tight: base.tight + fm,
        close: base.close + sm + fm,
        roomy: base.roomy + sm + fm,
    };
}
function easeCmToLabel(easeCm, thresholds) {
    if (easeCm < thresholds.tight)
        return 'Too tight';
    if (easeCm < thresholds.close)
        return 'Close';
    if (easeCm < thresholds.roomy)
        return 'Roomy';
    return 'Very roomy';
}
let FitEngineService = class FitEngineService {
    computeFit(garment, matchedModel, userMeasurements, matchConfidenceTier) {
        const thresholds = getThresholds(garment.stretch, garment.fit);
        const labels = [];
        const gm = garment.garmentMeasurements;
        const category = garment.category;
        if (category === 'Tops' || category === 'Sets' || category === 'Outerwear') {
            const m = gm;
            const bustEase = m.bustCm - matchedModel.bustCm;
            const bustMatchErr = matchedModel.bustCm - userMeasurements.bustCm;
            labels.push({
                zone: 'bust',
                label: easeCmToLabel(bustEase, thresholds),
                detail: `Garment bust ${m.bustCm}cm — model ${matchedModel.bustCm}cm`,
                garmentEaseCm: bustEase,
                matchErrorCm: bustMatchErr,
            });
            if (m.shoulderCm) {
                const shEase = m.shoulderCm - matchedModel.shoulderCm;
                const shMatchErr = matchedModel.shoulderCm -
                    (userMeasurements.shoulderCm ?? matchedModel.shoulderCm);
                labels.push({
                    zone: 'shoulders',
                    label: easeCmToLabel(shEase, { ...thresholds, roomy: thresholds.roomy - 1 }),
                    detail: `Garment shoulder ${m.shoulderCm}cm — model ${matchedModel.shoulderCm}cm`,
                    garmentEaseCm: shEase,
                    matchErrorCm: shMatchErr,
                });
            }
            labels.push({
                zone: 'length',
                label: m.lengthCm > 70 ? 'Long' : m.lengthCm > 60 ? 'Regular' : 'Cropped',
                detail: `Length ${m.lengthCm}cm`,
                garmentEaseCm: 0,
                matchErrorCm: 0,
            });
        }
        if (category === 'Trousers' || category === 'Jeans') {
            const m = gm;
            const waistEase = m.waistCm - matchedModel.waistCm;
            const waistMatchErr = matchedModel.waistCm - userMeasurements.waistCm;
            labels.push({
                zone: 'waist',
                label: easeCmToLabel(waistEase, thresholds),
                detail: `Garment waist ${m.waistCm}cm — model ${matchedModel.waistCm}cm`,
                garmentEaseCm: waistEase,
                matchErrorCm: waistMatchErr,
            });
            const hipsEase = m.hipsCm - matchedModel.hipsCm;
            const hipsMatchErr = matchedModel.hipsCm - userMeasurements.hipsCm;
            labels.push({
                zone: 'hips',
                label: easeCmToLabel(hipsEase, thresholds),
                detail: `Garment hips ${m.hipsCm}cm — model ${matchedModel.hipsCm}cm`,
                garmentEaseCm: hipsEase,
                matchErrorCm: hipsMatchErr,
            });
            labels.push({
                zone: 'length',
                label: m.inseamCm > 80 ? 'Full length' : m.inseamCm > 72 ? 'Regular' : 'Cropped',
                detail: `Inseam ${m.inseamCm}cm`,
                garmentEaseCm: 0,
                matchErrorCm: 0,
            });
        }
        if (category === 'Dresses') {
            const m = gm;
            const bustEase = m.bustCm - matchedModel.bustCm;
            labels.push({
                zone: 'bust',
                label: easeCmToLabel(bustEase, thresholds),
                detail: `Garment bust ${m.bustCm}cm`,
                garmentEaseCm: bustEase,
                matchErrorCm: matchedModel.bustCm - userMeasurements.bustCm,
            });
            const waistEase = m.waistCm - matchedModel.waistCm;
            labels.push({
                zone: 'waist',
                label: easeCmToLabel(waistEase, thresholds),
                detail: `Garment waist ${m.waistCm}cm`,
                garmentEaseCm: waistEase,
                matchErrorCm: matchedModel.waistCm - userMeasurements.waistCm,
            });
            labels.push({
                zone: 'length',
                label: m.lengthCm > 120
                    ? 'Floor length'
                    : m.lengthCm > 100
                        ? 'Midi'
                        : m.lengthCm > 70
                            ? 'Knee'
                            : 'Mini',
                detail: `Length ${m.lengthCm}cm`,
                garmentEaseCm: 0,
                matchErrorCm: 0,
            });
        }
        const qualifiedMessage = matchConfidenceTier !== 'close'
            ? 'Estimated fit based on your closest match — may vary'
            : undefined;
        return {
            labels: labels,
            matchConfidenceTier,
            qualifiedMessage: qualifiedMessage ?? null,
        };
    }
};
exports.FitEngineService = FitEngineService;
exports.FitEngineService = FitEngineService = __decorate([
    (0, common_1.Injectable)()
], FitEngineService);
//# sourceMappingURL=fit-engine.service.js.map