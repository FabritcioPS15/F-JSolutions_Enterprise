import { Router } from 'express'
import {
  register,
  login,
  verifyTwoFactor,
  resendTwoFactor,
  twoFactorStatus,
  setupTwoFactor,
  enableTwoFactor,
  disableTwoFactor,
  regenerateRecoveryCodes,
  refreshToken,
  getMe,
  logout,
} from '../controllers/auth.controller'
import { authenticate, requirePermission } from '../middleware/auth'
import { validate } from '../middleware/validate'
import {
  registerSchema,
  loginSchema,
  twoFactorVerifySchema,
  twoFactorResendSchema,
  twoFactorSetupSchema,
  twoFactorEnableSchema,
  twoFactorPasswordSchema,
} from '../models/user.model'

const router = Router()

// El registro público está deshabilitado: solo un usuario con permiso de
// gestión de usuarios puede crear cuentas.
router.post('/register', authenticate, requirePermission('users.create'), validate(registerSchema), register)
router.post('/login', validate(loginSchema), login)
router.post('/2fa/verify', validate(twoFactorVerifySchema), verifyTwoFactor)
router.post('/2fa/resend', validate(twoFactorResendSchema), resendTwoFactor)
router.get('/2fa/status', authenticate, twoFactorStatus)
router.post('/2fa/setup', authenticate, validate(twoFactorSetupSchema), setupTwoFactor)
router.post('/2fa/enable', authenticate, validate(twoFactorEnableSchema), enableTwoFactor)
router.post('/2fa/disable', authenticate, validate(twoFactorPasswordSchema), disableTwoFactor)
router.post(
  '/2fa/recovery-codes',
  authenticate,
  validate(twoFactorPasswordSchema),
  regenerateRecoveryCodes
)
router.post('/refresh', refreshToken)
router.get('/me', authenticate, getMe)
router.post('/logout', authenticate, logout)

export default router
