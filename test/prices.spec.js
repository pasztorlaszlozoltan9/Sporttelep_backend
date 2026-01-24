import request from 'supertest'
import app from '../app/app.js'

describe('/api/prices', () => {
    const restype= 'application/json; charset=utf-8'
    var token = null

    it('post /prices ', async () => {
      await request(app)
        .post('/api/prices')
        .set('Accept', 'application/json')
        .send({
            name: 'Something'
        })
        .expect('Content-Type', restype)
        .expect(201)

    })
    it('get /prices', async () => {
      await request(app)
        .get('/api/prices')
        .set('Accept', 'application/json')
        .expect('Content-Type', restype)
        .expect(200)
    })
    it('put /prices/:id', async () => {
      await request(app)
        .put('/api/prices/1')
        .set('Accept', 'application/json')
        .send({
            name: 'Another'
        })
        .expect('Content-Type', restype)
        .expect(200)
    })
    it('delete /prices/:id', async () => {
      await request(app)
        .delete('/api/prices/1')
        .set('Accept', 'application/json')
        .expect(200)
    })
})
