/**
 * AI Provider Abstraction — §6.
 * Never couple the domain directly to one AI vendor.
 */

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

/**
 * MVP placeholder provider — simulates try-on result.
 * Replace with ReplicateVirtualTryOnProvider, FalVirtualTryOnProvider, etc.
 */
export class SimulationProvider implements VirtualTryOnProvider {
  async generateTryOn(input: TryOnInput): Promise<TryOnResult> {
    // Simulate AI processing delay
    await new Promise((r) => setTimeout(r, 2000));

    return {
      resultUrl: input.garmentImage, // MVP: use fitted image as placeholder
      provider: 'mvp-simulation',
      model: 'placeholder-v1',
      latencyMs: 2000,
    };
  }
}
