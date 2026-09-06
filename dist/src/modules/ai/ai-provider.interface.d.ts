export interface TryOnInput {
    likenessId: string;
    garmentId: string;
    modelImage: string;
    garmentImage: string;
    pose?: string;
    renderConfig?: Record<string, any>;
}
export interface TryOnResult {
    resultUrl: string;
    provider: string;
    model: string;
    latencyMs: number;
}
export interface VirtualTryOnProvider {
    generateTryOn(input: TryOnInput): Promise<TryOnResult>;
}
export declare class SimulationProvider implements VirtualTryOnProvider {
    generateTryOn(input: TryOnInput): Promise<TryOnResult>;
}
