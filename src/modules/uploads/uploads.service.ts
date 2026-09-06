import { Injectable, Logger } from '@nestjs/common';
import { randomBytes } from 'node:crypto';

/**
 * Upload service — §28.
 * Cloudinary for model images, garment images, try-on results.
 *
 * For MVP, generates placeholder signed URLs.
 * Replace with actual Cloudinary SDK in production.
 */
@Injectable()
export class UploadsService {
  private readonly logger = new Logger(UploadsService.name);

  /**
   * Generate a signed upload URL for client-side upload.
   * §25 — Use signed uploads, validate MIME types and file sizes.
   */
  async getSignedUploadUrl(filename: string, mimeType: string) {
    // Validate MIME type (§25)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(mimeType)) {
      throw new Error(`Invalid MIME type: ${mimeType}. Allowed: ${allowedTypes.join(', ')}`);
    }

    // Validate file size (§25) — max 10MB
    // (size is checked client-side and at upload time)

    const key = `gunrege/uploads/${Date.now()}-${randomBytes(8).toString('hex')}-${filename}`;

    // TODO: Replace with actual Cloudinary/Presigned S3 URL generation
    this.logger.log(`Generated upload key: ${key}`);

    return {
      uploadUrl: `https://api.cloudinary.com/v1_1/gunrege/upload?public_id=${key}`,
      key,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 min
    };
  }
}
