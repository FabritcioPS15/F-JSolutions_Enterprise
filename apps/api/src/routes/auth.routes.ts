import { Router } from 'express'
import { register, login, refreshToken, getMe, logout } from '../controllers/auth.controller'
import { authenticate, requirePermission } from '../middleware/auth'
import { validate } from '../middleware/validate'
import { registerSchema, loginSchema } from '../models/user.model'

const router = Router()

// El registro público está deshabilitado: solo un usuario con permiso de
// gestión de usuarios puede crear cuentas.
router.post('/register', authenticate, requirePermission('users.create'), validate(registerSchema), register)
router.post('/login', validate(loginSchema), login)
router.post('/refresh', refreshToken)
router.get('/me', authenticate, getMe)
router.post('/logout', authenticate, logout)

export default router
