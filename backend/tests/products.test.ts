import request from 'supertest'
import app from '../src/app'

describe('Product API Endpoints', () => {
  it('GET /api/v1/products should return 200 and paginated list', async () => {
    const res = await request(app).get('/api/v1/products')
    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(Array.isArray(res.body.data)).toBe(true)
    expect(res.body.pagination).toBeDefined()
  })

  it('GET /api/v1/products/:id should return 200 for existing product', async () => {
    const res = await request(app).get('/api/v1/products/1')
    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.data.id).toBe('1')
  })

  it('POST /api/v1/products without auth token should return 401', async () => {
    const res = await request(app)
      .post('/api/v1/products')
      .send({
        name: 'Nuevo Servidor Test',
        price: 5000,
      })
    expect(res.status).toBe(401)
  })
})
