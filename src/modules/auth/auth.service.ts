import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { createHash, randomBytes } from 'node:crypto';

function hashPassword(password: string, salt: string): string {
  return createHash('sha256').update(`${salt}:${password}`).digest('hex');
}

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Register a new user.
   * §24 — Keep auth lightweight, don't block first-run UX.
   */
  async register(email: string, password: string, name?: string) {
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const salt = randomBytes(16).toString('hex');
    const hashedPassword = hashPassword(password, salt);

    const user = await this.prisma.user.create({
      data: {
        email,
        name,
        password: `${salt}:${hashedPassword}`,
      },
    });

    // Auto-create profile
    await this.prisma.userProfile.create({
      data: { userId: user.id },
    });

    return { id: user.id, email: user.email, name: user.name };
  }

  /**
   * Login — returns user ID as bearer token for MVP.
   */
  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const [salt, storedHash] = user.password.split(':');
    const inputHash = hashPassword(password, salt);

    if (inputHash !== storedHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // MVP: return user ID as token. Replace with JWT in production.
    return {
      access_token: user.id,
      user: { id: user.id, email: user.email, name: user.name },
    };
  }
}
