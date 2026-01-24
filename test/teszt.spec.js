import request from 'supertest'
import app from '../app/app.js'

describe('/api/teszts', () => {
    const restype= 'application/json; charset=utf-8'
    var token = null

    it('post /teszts ', async () => {
      await request(app)
        .post('/api/teszts')
        .set('Accept', 'application/json')
        .send({
            name: 'Something'
        })
        .expect('Content-Type', restype)
        .expect(201)

    })
    it('get /teszts', async () => {
      await request(app)
        .get('/api/teszts')
        .set('Accept', 'application/json')
        .expect('Content-Type', restype)
        .expect(200)
    })
    it('put /teszts/:id', async () => {
      await request(app)
        .put('/api/teszts/1')
        .set('Accept', 'application/json')
        .send({
            name: 'Another'
        })
        .expect('Content-Type', restype)
        .expect(200)
    })
    it('delete /teszts/:id', async () => {
      await request(app)
        .delete('/api/teszts/1')
        .set('Accept', 'application/json')
        .expect(200)
    })
})
