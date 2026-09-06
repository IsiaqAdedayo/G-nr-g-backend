export declare class UploadsService {
    private readonly logger;
    getSignedUploadUrl(filename: string, mimeType: string): Promise<{
        uploadUrl: string;
        key: string;
        expiresAt: string;
    }>;
}
