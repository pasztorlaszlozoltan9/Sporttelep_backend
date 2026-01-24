import request from 'supertest'
import app from '../app/app.js'

describe('/api/fields', () => {
    const restype= 'application/json; charset=utf-8'
    var token = null

    it('post /fields ', async () => {
      await request(app)
        .post('/api/fields')
        .set('Accept', 'application/json')
        .send({
            name: 'Something'
        })
        .expect('Content-Type', restype)
        .expect(201)

    })
    it('get /fields', async () => {
      await request(app)
        .get('/api/fields')
        .set('Accept', 'application/json')
        .expect('Content-Type', restype)
        .expect(200)
    })
    it('put /fields/:id', async () => {
      await request(app)
        .put('/api/fields/1')
        .set('Accept', 'application/json')
        .send({
            name: 'Another'
        })
        .expect('Content-Type', restype)
        .expect(200)
    })
    it('delete /fields/:id', async () => {
      await request(app)
        .delete('/api/fields/1')
        .set('Accept', 'application/json')
        .expect(200)
    })
})
