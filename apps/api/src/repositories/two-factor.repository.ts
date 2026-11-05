import type { AuthTwoFactorMethod } from './auth.repository'

export type TwoFactorChallengeRecord = {
  id: string
  userId: string
  method: AuthTwoFactorMethod
  codeHash: string
  attempts: number
  expiresAt: Date
  consumedAt: Date | null
  createdAt: Date
}

export type TwoFactorRecoveryCodeRecord = {
  id: string
  userId: string
  codeHash: string
  usedAt: Date | null
}

export type CreateChallengeInput = {
  userId: string
  method: AuthTwoFactorMethod
  codeHash: string
  expiresAt: Date
}

export interface TwoFactorRepository {
  createChallenge(input: CreateChallengeInput): Promise<TwoFactorChallengeRecord>
  findLatestChallenge(
    userId: string,
    method: AuthTwoFactorMethod
  ): Promise<TwoFactorChallengeRecord | null>
  incrementChallengeAttempts(id: string): Promise<void>
  consumeChallenge(id: string): Promise<void>
  consumeOpenChallenges(userId: string, method: AuthTwoFactorMethod): Promise<void>
  replaceRecoveryCodes(userId: string, codeHashes: string[]): Promise<void>
  findRecoveryCode(userId: string, codeHash: string): Promise<TwoFactorRecoveryCodeRecord | null>
  consumeRecoveryCode(id: string): Promise<void>
  countAvailableRecoveryCodes(userId: string): Promise<number>
}
