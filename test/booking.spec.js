import request from 'supertest'
import app from '../app/app.js'

describe('/api/bookings', () => {
    const restype= 'application/json; charset=utf-8'
    var token = null

    it('post /bookings ', async () => {
      await request(app)
        .post('/api/bookings')
        .set('Accept', 'application/json')
        .send({
            name: 'Something'
        })
        .expect('Content-Type', restype)
        .expect(201)

    })
    it('get /bookings', async () => {
      await request(app)
        .get('/api/bookings')
        .set('Accept', 'application/json')
        .expect('Content-Type', restype)
        .expect(200)
    })
    it('put /bookings/:id', async () => {
      await request(app)
        .put('/api/bookings/1')
        .set('Accept', 'application/json')
        .send({
            name: 'Another'
        })
        .expect('Content-Type', restype)
        .expect(200)
    })
    it('delete /bookings/:id', async () => {
      await request(app)
        .delete('/api/bookings/1')
        .set('Accept', 'application/json')
        .expect(200)
    })
})
