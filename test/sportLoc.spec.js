import request from 'supertest'
import app from '../app/app.js'

describe('/api/sportLocs', () => {
    const restype= 'application/json; charset=utf-8'
    var token = null

    it('post /sportLocs ', async () => {
      await request(app)
        .post('/api/sportLocs')
        .set('Accept', 'application/json')
        .send({
            name: 'Something'
        })
        .expect('Content-Type', restype)
        .expect(201)

    })
    it('get /sportLocs', async () => {
      await request(app)
        .get('/api/sportLocs')
        .set('Accept', 'application/json')
        .expect('Content-Type', restype)
        .expect(200)
    })
    it('put /sportLocs/:id', async () => {
      await request(app)
        .put('/api/sportLocs/1')
        .set('Accept', 'application/json')
        .send({
            name: 'Another'
        })
        .expect('Content-Type', restype)
        .expect(200)
    })
    it('delete /sportLocs/:id', async () => {
      await request(app)
        .delete('/api/sportLocs/1')
        .set('Accept', 'application/json')
        .expect(200)
    })
})
