import request from 'supertest'
import app from '../app/app.js'

describe('/api/locations', () => {
    const restype= 'application/json; charset=utf-8'
    var token = null

    it('post /locations ', async () => {
      await request(app)
        .post('/api/locations')
        .set('Accept', 'application/json')
        .send({
            name: 'Something'
        })
        .expect('Content-Type', restype)
        .expect(201)

    })
    it('get /locations', async () => {
      await request(app)
        .get('/api/locations')
        .set('Accept', 'application/json')
        .expect('Content-Type', restype)
        .expect(200)
    })
    it('put /locations/:id', async () => {
      await request(app)
        .put('/api/locations/1')
        .set('Accept', 'application/json')
        .send({
            name: 'Another'
        })
        .expect('Content-Type', restype)
        .expect(200)
    })
    it('delete /locations/:id', async () => {
      await request(app)
        .delete('/api/locations/1')
        .set('Accept', 'application/json')
        .expect(200)
    })
})
