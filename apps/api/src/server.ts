import app from './app'
import { DEV_DEFAULTS, env } from './config/env'
import { logger } from './utils/logger'

const PORT = env.PORT

if (env.NODE_ENV === 'production') {
  if (env.JWT_SECRET === DEV_DEFAULTS.jwtSecret || env.JWT_REFRESH_SECRET === DEV_DEFAULTS.jwtRefreshSecret) {
    logger.warn('Usando secretos JWT de desarrollo en producción. Configura JWT_SECRET y JWT_REFRESH_SECRET.')
  }
}

app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}${env.API_PREFIX}`)
  logger.info(`Environment: ${env.NODE_ENV}`)
})