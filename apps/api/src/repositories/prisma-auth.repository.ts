import { Prisma } from '@prisma/client'
import { prisma } from '../config/database'
import type {
  AuthRepository,
  AuthRoleRecord,
  AuthUserRecord,
  CreateAuthUserInput,
} from './auth.repository'

const userInclude = {
  role: {
    include: {
      permissions: {
        include: { permission: true },
      },
    },
  },
} satisfies Prisma.UserInclude

type PrismaUserWithAccess = Prisma.UserGetPayload<{ include: typeof userInclude }>

function toRecord(user: PrismaUserWithAccess): AuthUserRecord {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    passwordHash: user.passwordHash,
    phone: user.phone,
    company: user.company,
    status: user.status,
    lastLoginAt: user.lastLoginAt,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    role: {
      id: user.role.id,
      key: user.role.key,
      name: user.role.name,
    },
    permissions: user.role.permissions.map((entry) => entry.permission.key),
  }
}

export class PrismaAuthRepository implements AuthRepository {
  async findByEmail(email: string): Promise<AuthUserRecord | null> {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: userInclude,
    })
    return user ? toRecord(user) : null
  }

  async findById(id: string): Promise<AuthUserRecord | null> {
    const user = await prisma.user.findUnique({
      where: { id },
      include: userInclude,
    })
    return user ? toRecord(user) : null
  }

  async findRoleByKey(key: string): Promise<AuthRoleRecord | null> {
    const role = await prisma.role.findUnique({ where: { key } })
    return role ? { id: role.id, key: role.key, name: role.name } : null
  }

  async createUser(input: CreateAuthUserInput): Promise<AuthUserRecord> {
    const user = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email.toLowerCase(),
        passwordHash: input.passwordHash,
        phone: input.phone ?? null,
        company: input.company ?? null,
        roleId: input.roleId,
      },
      include: userInclude,
    })
    return toRecord(user)
  }

  async touchLastLogin(id: string): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: { lastLoginAt: new Date() },
    })
  }
}

export const prismaAuthRepository = new PrismaAuthRepository()
