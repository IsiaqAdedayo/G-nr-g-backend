import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateMeasurementsDto } from '../../common/dto/measurements.dto.js';
import { CreateAppearanceDto } from '../../common/dto/appearance.dto.js';
import { UpdateProfileDto } from '../../common/dto/profile.dto.js';

@Injectable()
export class ProfilesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get or create a profile for a user.
   */
  async getOrCreateProfile(userId: string) {
    let profile = await this.prisma.userProfile.findUnique({
      where: { userId },
      include: { body: true, appearance: true },
    });

    if (!profile) {
      profile = await this.prisma.userProfile.create({
        data: { userId },
        include: { body: true, appearance: true },
      });
    }

    return profile;
  }

  /**
   * Update user-level profile fields (unit, bodyShape).
   */
  async updateProfile(userId: string, dto: UpdateProfileDto) {
    // Update user unit preference
    if (dto.unit) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { unit: dto.unit },
      });
    }

    const profile = await this.getOrCreateProfile(userId);

    return this.prisma.userProfile.update({
      where: { id: profile.id },
      data: { bodyShape: dto.bodyShape ?? profile.bodyShape },
      include: { body: true, appearance: true },
    });
  }

  /**
   * PUT /profiles/body — Create or update body measurements.
   */
  async upsertBody(userId: string, dto: CreateMeasurementsDto) {
    const profile = await this.getOrCreateProfile(userId);

    const existingBody = await this.prisma.bodyProfile.findUnique({
      where: { profileId: profile.id },
    });

    if (existingBody) {
      return this.prisma.bodyProfile.update({
        where: { profileId: profile.id },
        data: dto,
      });
    }

    return this.prisma.bodyProfile.create({
      data: {
        profileId: profile.id,
        ...dto,
      },
    });
  }

  /**
   * GET /profiles/body
   */
  async getBody(userId: string) {
    const profile = await this.getOrCreateProfile(userId);
    return this.prisma.bodyProfile.findUnique({
      where: { profileId: profile.id },
    });
  }

  /**
   * PUT /profiles/appearance — Create or update appearance profile.
   */
  async upsertAppearance(userId: string, dto: CreateAppearanceDto) {
    const profile = await this.getOrCreateProfile(userId);

    const existing = await this.prisma.appearanceProfile.findUnique({
      where: { profileId: profile.id },
    });

    if (existing) {
      return this.prisma.appearanceProfile.update({
        where: { profileId: profile.id },
        data: dto,
      });
    }

    return this.prisma.appearanceProfile.create({
      data: {
        profileId: profile.id,
        ...dto,
      },
    });
  }

  /**
   * GET /profiles/appearance
   */
  async getAppearance(userId: string) {
    const profile = await this.getOrCreateProfile(userId);
    return this.prisma.appearanceProfile.findUnique({
      where: { profileId: profile.id },
    });
  }

  /**
   * GET /users/me — Full user with profile.
   */
  async getUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: {
          include: { body: true, appearance: true },
        },
        likeness: {
          include: { matchedModel: true },
        },
      },
    });

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  /**
   * PATCH /users/me — Update user name/email.
   */
  async updateUser(userId: string, data: { name?: string; email?: string }) {
    return this.prisma.user.update({
      where: { id: userId },
      data,
    });
  }
}
