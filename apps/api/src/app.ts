import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import { env } from './config/env'
import { errorHandler } from './middleware/error-handler'
import { requestLogger } from './middleware/request-logger'
import { rateLimiter } from './middleware/rate-limiter'

// Routes
import productRoutes from './routes/product.routes'
import categoryRoutes from './routes/category.routes'
import brandRoutes from './routes/brand.routes'
import clientRoutes from './routes/client.routes'
import authRoutes from './routes/auth.routes'
import orderRoutes from './routes/order.routes'
import contactRoutes from './routes/contact.routes'
import cotizacionRoutes from './routes/cotizacion.routes'
import quoteRoutes from './routes/quote.routes'
import helpdeskRoutes from './routes/helpdesk.routes'
import dashboardRoutes from './routes/dashboard.routes'
import serviceOfferingRoutes from './routes/service-offering.routes'

const app = express()

// ── Security middleware ───────────────────────────────────────────────────────
app.use(helmet())
app.use(cors({ origin: env.FRONTEND_URL, credentials: true }))
app.use(rateLimiter)

// ── Body parsing ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// ── Logging ───────────────────────────────────────────────────────────────────
app.use(requestLogger)

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// ── API Routes ────────────────────────────────────────────────────────────────
const PREFIX = env.API_PREFIX
app.use(`${PREFIX}/products`, productRoutes)
app.use(`${PREFIX}/categories`, categoryRoutes)
app.use(`${PREFIX}/brands`, brandRoutes)
app.use(`${PREFIX}/clients`, clientRoutes)
app.use(`${PREFIX}/auth`, authRoutes)
app.use(`${PREFIX}/orders`, orderRoutes)
app.use(`${PREFIX}/contact`, contactRoutes)
app.use(`${PREFIX}/cotizaciones`, cotizacionRoutes)
app.use(`${PREFIX}/quotes`, quoteRoutes)
app.use(`${PREFIX}/helpdesk`, helpdeskRoutes)
app.use(`${PREFIX}/dashboard`, dashboardRoutes)
app.use(`${PREFIX}/services`, serviceOfferingRoutes)

// ── Error handler (must be last) ──────────────────────────────────────────────
app.use(errorHandler)

export default app