import request from 'supertest'
import app from '../src/app'

describe('Auth API Endpoints', () => {
  it('POST /api/v1/auth/login with valid mock credentials should return token', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'admin@fjsolutions.com.pe',
        password: 'Password123!',
      })

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.data.tokens).toBeDefined()
    expect(res.body.data.tokens.accessToken).toBeDefined()
  })

  it('POST /api/v1/auth/login with invalid email should fail', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'nonexistent@fjsolutions.com.pe',
        password: 'Password123!',
      })

    expect(res.status).toBe(401)
    expect(res.body.success).toBe(false)
  })

  it('GET /api/v1/auth/me without authorization header should return 401', async () => {
    const res = await request(app).get('/api/v1/auth/me')
    expect(res.status).toBe(401)
  })
})
