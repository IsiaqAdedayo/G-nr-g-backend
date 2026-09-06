import { UploadsService } from './uploads.service.js';
declare class GetUploadUrlDto {
    filename: string;
    mimeType: string;
}
export declare class UploadsController {
    private readonly uploadsService;
    constructor(uploadsService: UploadsService);
    getSignedUrl(dto: GetUploadUrlDto): Promise<{
        uploadUrl: string;
        key: string;
        expiresAt: string;
    }>;
}
export {};
