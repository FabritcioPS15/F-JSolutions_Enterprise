import request from 'supertest'
import app from '../src/app'

describe('Catalog API guards', () => {
  it('rechaza crear productos sin sesión', async () => {
    const res = await request(app)
      .post('/api/v1/products')
      .send({ name: 'Servidor de prueba', price: 1000 })
    expect(res.status).toBe(401)
    expect(res.body.success).toBe(false)
  })

  it('rechaza la lectura administrativa de productos sin sesión', async () => {
    const res = await request(app).get('/api/v1/products?scope=admin')
    expect(res.status).toBe(401)
  })

  it('rechaza crear categorías y marcas sin sesión', async () => {
    const category = await request(app).post('/api/v1/categories').send({ name: 'Redes' })
    const brand = await request(app).post('/api/v1/brands').send({ name: 'Cisco' })
    expect(category.status).toBe(401)
    expect(brand.status).toBe(401)
  })

  it('rechaza la lectura administrativa de categorías y marcas sin sesión', async () => {
    const categories = await request(app).get('/api/v1/categories?scope=admin')
    const brands = await request(app).get('/api/v1/brands?scope=admin')
    expect(categories.status).toBe(401)
    expect(brands.status).toBe(401)
  })

  it('rechaza actualizar y eliminar productos sin sesión', async () => {
    const update = await request(app).put('/api/v1/products/producto-1').send({ price: 10 })
    const remove = await request(app).delete('/api/v1/products/producto-1')
    expect(update.status).toBe(401)
    expect(remove.status).toBe(401)
  })
})
