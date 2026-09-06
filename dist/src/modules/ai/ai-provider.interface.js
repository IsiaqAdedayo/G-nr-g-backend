"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimulationProvider = void 0;
class SimulationProvider {
    async generateTryOn(input) {
        await new Promise((r) => setTimeout(r, 2000));
        return {
            resultUrl: input.garmentImage,
            provider: 'mvp-simulation',
            model: 'placeholder-v1',
            latencyMs: 2000,
        };
    }
}
exports.SimulationProvider = SimulationProvider;
//# sourceMappingURL=ai-provider.interface.js.map