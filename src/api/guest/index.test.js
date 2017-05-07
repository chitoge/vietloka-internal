import request from 'supertest-as-promised'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import routes, { Guest } from '.'

const app = () => express(routes)

let userSession, anotherSession, guest

beforeEach(async () => {
  const user = await User.create({ email: 'a@a.com', password: '12345678' })
  const anotherUser = await User.create({ email: 'b@b.com', password: '12345678' })
  userSession = signSync(user.id)
  anotherSession = signSync(anotherUser.id)
  guest = await Guest.create({ nationality: 'Terran', user: user })
})

test('POST /guests 201 (user)', async () => {
  const { status, body } = await request(app())
    .post('/')
    .send({ access_token: anotherSession, nationality: 'Protoss' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(typeof body.user).toEqual('object')
})

test('POST /guests 401', async () => {
  const { status } = await request(app())
    .post('/')
  expect(status).toBe(401)
})

test('GET /guests 200', async () => {
  const { status, body } = await request(app())
    .get('/')
  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
})

test('GET /guests/:id 200', async () => {
  const { status, body } = await request(app())
    .get(`/${guest.id}`)
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(guest.id)
})

test('GET /guests/self 200', async () => {
  const { status, body } = await request(app())
    .get(`/self`)
    .query({ access_token: userSession })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(guest.id)
})

test('GET /guests/self 401', async () => {
  const { status, body } = await request(app())
    .get(`/self`)
  expect(status).toBe(401)
})

test('GET /guests/self 404', async () => {
  const { status, body } = await request(app())
    .get(`/self`)
    .query({ access_token: anotherSession })
  expect(status).toBe(404)
})

test('GET /guests/:id 404', async () => {
  const { status } = await request(app())
    .get('/123456789098765432123456')
  expect(status).toBe(404)
})

test('PUT /guests/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .put(`/${guest.id}`)
    .send({ access_token: userSession })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(guest.id)
  expect(typeof body.user).toEqual('object')
})

test('PUT /guests/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .put(`/${guest.id}`)
    .send({ access_token: anotherSession })
  expect(status).toBe(401)
})

test('PUT /guests/:id 401', async () => {
  const { status } = await request(app())
    .put(`/${guest.id}`)
  expect(status).toBe(401)
})

test('PUT /guests/:id 404 (user)', async () => {
  const { status } = await request(app())
    .put('/123456789098765432123456')
    .send({ access_token: anotherSession })
  expect(status).toBe(404)
})

test('DELETE /guests/:id 204 (user)', async () => {
  const { status } = await request(app())
    .delete(`/${guest.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(204)
})

test('DELETE /guests/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .delete(`/${guest.id}`)
    .send({ access_token: anotherSession })
  expect(status).toBe(401)
})

test('DELETE /guests/:id 401', async () => {
  const { status } = await request(app())
    .delete(`/${guest.id}`)
  expect(status).toBe(401)
})

test('DELETE /guests/:id 404 (user)', async () => {
  const { status } = await request(app())
    .delete('/123456789098765432123456')
    .query({ access_token: anotherSession })
  expect(status).toBe(404)
})
