import request from 'supertest'
import app from '../app/app.js'

describe('/api/sports', () => {
    const restype= 'application/json; charset=utf-8'
    var token = null

    it('post /sports ', async () => {
      await request(app)
        .post('/api/sports')
        .set('Accept', 'application/json')
        .send({
            name: 'Something'
        })
        .expect('Content-Type', restype)
        .expect(201)

    })
    it('get /sports', async () => {
      await request(app)
        .get('/api/sports')
        .set('Accept', 'application/json')
        .expect('Content-Type', restype)
        .expect(200)
    })
    it('put /sports/:id', async () => {
      await request(app)
        .put('/api/sports/1')
        .set('Accept', 'application/json')
        .send({
            name: 'Another'
        })
        .expect('Content-Type', restype)
        .expect(200)
    })
    it('delete /sports/:id', async () => {
      await request(app)
        .delete('/api/sports/1')
        .set('Accept', 'application/json')
        .expect(200)
    })
})
