import { PrismaService } from '../../prisma/prisma.service.js';
export declare class AuthService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    register(email: string, password: string, name?: string): Promise<{
        id: string;
        email: string;
        name: string | null;
    }>;
    login(email: string, password: string): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            name: string | null;
        };
    }>;
}
