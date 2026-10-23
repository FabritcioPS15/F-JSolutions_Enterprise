import { Router } from 'express'
import { register, login, refreshToken, getMe, logout } from '../controllers/auth.controller'
import { authenticate } from '../middleware/auth'
import { validate } from '../middleware/validate'
import { registerSchema, loginSchema } from '../models/user.model'

const router = Router()

router.post('/register', validate(registerSchema), register)
router.post('/login', validate(loginSchema), login)
router.post('/refresh', refreshToken)
router.get('/me', authenticate, getMe)
router.post('/logout', authenticate, logout)

export default router
