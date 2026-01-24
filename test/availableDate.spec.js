import request from 'supertest'
import app from '../app/app.js'

describe('/api/availableDates', () => {
    const restype= 'application/json; charset=utf-8'
    var token = null

    it('post /availableDates ', async () => {
      await request(app)
        .post('/api/availableDates')
        .set('Accept', 'application/json')
        .send({
            name: 'Something'
        })
        .expect('Content-Type', restype)
        .expect(201)

    })
    it('get /availableDates', async () => {
      await request(app)
        .get('/api/availableDates')
        .set('Accept', 'application/json')
        .expect('Content-Type', restype)
        .expect(200)
    })
    it('put /availableDates/:id', async () => {
      await request(app)
        .put('/api/availableDates/1')
        .set('Accept', 'application/json')
        .send({
            name: 'Another'
        })
        .expect('Content-Type', restype)
        .expect(200)
    })
    it('delete /availableDates/:id', async () => {
      await request(app)
        .delete('/api/availableDates/1')
        .set('Accept', 'application/json')
        .expect(200)
    })
})
