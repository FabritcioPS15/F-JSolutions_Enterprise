import { randomUUID } from 'node:crypto'
import type { AuthTwoFactorMethod } from './auth.repository'
import type {
  CreateChallengeInput,
  TwoFactorChallengeRecord,
  TwoFactorRecoveryCodeRecord,
  TwoFactorRepository,
} from './two-factor.repository'

type StoredRecoveryCode = TwoFactorRecoveryCodeRecord & { createdAt: Date }

export class InMemoryTwoFactorRepository implements TwoFactorRepository {
  private readonly challenges: TwoFactorChallengeRecord[] = []
  private readonly recoveryCodes: StoredRecoveryCode[] = []

  async createChallenge(input: CreateChallengeInput): Promise<TwoFactorChallengeRecord> {
    const challenge: TwoFactorChallengeRecord = {
      id: randomUUID(),
      userId: input.userId,
      method: input.method,
      codeHash: input.codeHash,
      attempts: 0,
      expiresAt: input.expiresAt,
      consumedAt: null,
      createdAt: new Date(),
    }
    this.challenges.push(challenge)
    return challenge
  }

  async findLatestChallenge(
    userId: string,
    method: AuthTwoFactorMethod
  ): Promise<TwoFactorChallengeRecord | null> {
    const matches = this.challenges.filter(
      (item) => item.userId === userId && item.method === method && !item.consumedAt
    )
    return matches.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0] ?? null
  }

  async incrementChallengeAttempts(id: string): Promise<void> {
    const challenge = this.challenges.find((item) => item.id === id)
    if (challenge) challenge.attempts += 1
  }

  async consumeChallenge(id: string): Promise<void> {
    const challenge = this.challenges.find((item) => item.id === id)
    if (challenge) challenge.consumedAt = new Date()
  }

  async consumeOpenChallenges(userId: string, method: AuthTwoFactorMethod): Promise<void> {
    const now = new Date()
    for (const challenge of this.challenges) {
      if (challenge.userId === userId && challenge.method === method && !challenge.consumedAt) {
        challenge.consumedAt = now
      }
    }
  }

  async replaceRecoveryCodes(userId: string, codeHashes: string[]): Promise<void> {
    const now = new Date()
    for (let index = this.recoveryCodes.length - 1; index >= 0; index -= 1) {
      if (this.recoveryCodes[index].userId === userId) this.recoveryCodes.splice(index, 1)
    }
    for (const codeHash of codeHashes) {
      this.recoveryCodes.push({ id: randomUUID(), userId, codeHash, usedAt: null, createdAt: now })
    }
  }

  async findRecoveryCode(
    userId: string,
    codeHash: string
  ): Promise<TwoFactorRecoveryCodeRecord | null> {
    return (
      this.recoveryCodes.find(
        (item) => item.userId === userId && item.codeHash === codeHash && !item.usedAt
      ) ?? null
    )
  }

  async consumeRecoveryCode(id: string): Promise<void> {
    const record = this.recoveryCodes.find((item) => item.id === id)
    if (record) record.usedAt = new Date()
  }

  async countAvailableRecoveryCodes(userId: string): Promise<number> {
    return this.recoveryCodes.filter((item) => item.userId === userId && !item.usedAt).length
  }
}
