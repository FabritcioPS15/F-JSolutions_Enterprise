import { User } from '../types'
import { signToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt'

interface RegisterInput {
  name: string
  email: string
  password: string
  phone?: string
  company?: string
}

export class AuthService {
  private mockUsers: (User & { passwordHash: string })[] = [
    {
      id: 'usr_admin_01',
      name: 'Administrador F&J',
      email: 'admin@fjsolutions.com.pe',
      role: 'admin',
      passwordHash: 'hash_demo_12345',
      company: 'F&J Systems S.A.C.',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'usr_demo_02',
      name: 'Cliente Demo',
      email: 'cliente@empresa.pe',
      role: 'customer',
      passwordHash: 'hash_demo_12345',
      company: 'Minera Los Andes',
      phone: '+51 987 654 321',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

  async register(input: RegisterInput) {
    const existing = this.mockUsers.find((u) => u.email.toLowerCase() === input.email.toLowerCase())
    if (existing) {
      throw new Error('El correo electrónico ya se encuentra registrado')
    }

    const newUser: User & { passwordHash: string } = {
      id: `usr_${Date.now()}`,
      name: input.name,
      email: input.email,
      role: 'customer',
      passwordHash: 'hashed_' + input.password,
      phone: input.phone,
      company: input.company,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.mockUsers.push(newUser)

    const tokenPayload = {
      sub: newUser.id,
      email: newUser.email,
      role: newUser.role,
    }

    const accessToken = signToken(tokenPayload)
    const refreshToken = signRefreshToken(tokenPayload)

    // Omitimos passwordHash
    const { passwordHash: _, ...safeUser } = newUser

    return {
      user: safeUser,
      tokens: {
        accessToken,
        refreshToken,
      },
    }
  }

  async login(email: string, _password: string) {
    const user = this.mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase())
    if (!user) return null

    // En producción se compararía con bcrypt.compare(password, user.passwordHash)
    const tokenPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    }

    const accessToken = signToken(tokenPayload)
    const refreshToken = signRefreshToken(tokenPayload)

    const { passwordHash: _, ...safeUser } = user

    return {
      user: safeUser,
      tokens: {
        accessToken,
        refreshToken,
      },
    }
  }

  async refresh(refreshToken: string) {
    const payload = verifyRefreshToken(refreshToken)
    const user = await this.findById(payload.sub)
    if (!user) {
      throw new Error('Usuario no encontrado')
    }

    const newAccessToken = signToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    })

    return {
      accessToken: newAccessToken,
    }
  }

  async findById(id: string): Promise<User | null> {
    const user = this.mockUsers.find((u) => u.id === id)
    if (!user) return null
    const { passwordHash: _, ...safeUser } = user
    return safeUser
  }
}
