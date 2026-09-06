import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';

/**
 * MVP Auth Guard — §24.
 *
 * Strategy: Bearer token (user ID) or create an anonymous guest user.
 * In production, replace with JWT/session-based auth.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    let userId: string | null = null;

    if (authHeader?.startsWith('Bearer ')) {
      userId = authHeader.slice(7).trim();
    }

    // If no auth, create or find guest user (§24 — don't block first-run UX)
    if (!userId) {
      // For MVP: look for or create a default guest user
      const guest = await this.prisma.user.findFirst({
        where: { email: 'guest@gunrege.local' },
      });

      if (guest) {
        userId = guest.id;
      } else {
        const newGuest = await this.prisma.user.create({
          data: {
            email: 'guest@gunrege.local',
            name: 'Guest',
          },
        });
        userId = newGuest.id;
      }
    } else {
      // Validate the user exists
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        throw new UnauthorizedException('Invalid user token');
      }
    }

    request.userId = userId;
    return true;
  }
}
