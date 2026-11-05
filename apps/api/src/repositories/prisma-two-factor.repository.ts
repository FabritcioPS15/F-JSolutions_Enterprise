import { prisma } from '../config/database'
import type { AuthTwoFactorMethod } from './auth.repository'
import type {
  CreateChallengeInput,
  TwoFactorChallengeRecord,
  TwoFactorRecoveryCodeRecord,
  TwoFactorRepository,
} from './two-factor.repository'

function toChallenge(record: {
  id: string
  userId: string
  method: AuthTwoFactorMethod
  codeHash: string
  attempts: number
  expiresAt: Date
  consumedAt: Date | null
  createdAt: Date
}): TwoFactorChallengeRecord {
  return {
    id: record.id,
    userId: record.userId,
    method: record.method,
    codeHash: record.codeHash,
    attempts: record.attempts,
    expiresAt: record.expiresAt,
    consumedAt: record.consumedAt,
    createdAt: record.createdAt,
  }
}

export class PrismaTwoFactorRepository implements TwoFactorRepository {
  async createChallenge(input: CreateChallengeInput): Promise<TwoFactorChallengeRecord> {
    const challenge = await prisma.twoFactorChallenge.create({
      data: {
        userId: input.userId,
        method: input.method,
        codeHash: input.codeHash,
        expiresAt: input.expiresAt,
      },
    })
    return toChallenge(challenge)
  }

  async findLatestChallenge(
    userId: string,
    method: AuthTwoFactorMethod
  ): Promise<TwoFactorChallengeRecord | null> {
    const challenge = await prisma.twoFactorChallenge.findFirst({
      where: { userId, method, consumedAt: null },
      orderBy: { createdAt: 'desc' },
    })
    return challenge ? toChallenge(challenge) : null
  }

  async incrementChallengeAttempts(id: string): Promise<void> {
    await prisma.twoFactorChallenge.update({
      where: { id },
      data: { attempts: { increment: 1 } },
    })
  }

  async consumeChallenge(id: string): Promise<void> {
    await prisma.twoFactorChallenge.update({
      where: { id },
      data: { consumedAt: new Date() },
    })
  }

  async consumeOpenChallenges(userId: string, method: AuthTwoFactorMethod): Promise<void> {
    await prisma.twoFactorChallenge.updateMany({
      where: { userId, method, consumedAt: null },
      data: { consumedAt: new Date() },
    })
  }

  async replaceRecoveryCodes(userId: string, codeHashes: string[]): Promise<void> {
    await prisma.$transaction([
      prisma.twoFactorRecoveryCode.deleteMany({ where: { userId } }),
      ...(codeHashes.length > 0
        ? [
            prisma.twoFactorRecoveryCode.createMany({
              data: codeHashes.map((codeHash) => ({ userId, codeHash })),
            }),
          ]
        : []),
    ])
  }

  async findRecoveryCode(
    userId: string,
    codeHash: string
  ): Promise<TwoFactorRecoveryCodeRecord | null> {
    const record = await prisma.twoFactorRecoveryCode.findFirst({
      where: { userId, codeHash, usedAt: null },
    })
    return record
      ? { id: record.id, userId: record.userId, codeHash: record.codeHash, usedAt: record.usedAt }
      : null
  }

  async consumeRecoveryCode(id: string): Promise<void> {
    await prisma.twoFactorRecoveryCode.update({
      where: { id },
      data: { usedAt: new Date() },
    })
  }

  async countAvailableRecoveryCodes(userId: string): Promise<number> {
    return prisma.twoFactorRecoveryCode.count({ where: { userId, usedAt: null } })
  }
}

export const prismaTwoFactorRepository = new PrismaTwoFactorRepository()
