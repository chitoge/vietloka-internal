import request from 'supertest-as-promised'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import routes, { House } from '.'

const app = () => express(routes)

let userSession, anotherSession, house

beforeEach(async () => {
  const user = await User.create({ email: 'a@a.com', password: '123456' })
  const anotherUser = await User.create({ email: 'b@b.com', password: '123456' })
  userSession = signSync(user.id)
  anotherSession = signSync(anotherUser.id)
  house = await House.create({ host: user })
})

test('POST /houses 201 (user)', async () => {
  const { status, body } = await request(app())
    .post('/')
    .send({ access_token: userSession })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(typeof body.host).toEqual('object')
})

test('POST /houses 401', async () => {
  const { status } = await request(app())
    .post('/')
  expect(status).toBe(401)
})

test('GET /houses 200', async () => {
  const { status, body } = await request(app())
    .get('/')
  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
})

test('GET /houses/:id 200', async () => {
  const { status, body } = await request(app())
    .get(`/${house.id}`)
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(house.id)
})

test('GET /houses/:id 404', async () => {
  const { status } = await request(app())
    .get('/123456789098765432123456')
  expect(status).toBe(404)
})

test('PUT /houses/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .put(`/${house.id}`)
    .send({ access_token: userSession })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(house.id)
  expect(typeof body.host).toEqual('object')
})

test('PUT /houses/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .put(`/${house.id}`)
    .send({ access_token: anotherSession })
  expect(status).toBe(401)
})

test('PUT /houses/:id 401', async () => {
  const { status } = await request(app())
    .put(`/${house.id}`)
  expect(status).toBe(401)
})

test('PUT /houses/:id 404 (user)', async () => {
  const { status } = await request(app())
    .put('/123456789098765432123456')
    .send({ access_token: anotherSession })
  expect(status).toBe(404)
})

test('DELETE /houses/:id 204 (user)', async () => {
  const { status } = await request(app())
    .delete(`/${house.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(204)
})

test('DELETE /houses/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .delete(`/${house.id}`)
    .send({ access_token: anotherSession })
  expect(status).toBe(401)
})

test('DELETE /houses/:id 401', async () => {
  const { status } = await request(app())
    .delete(`/${house.id}`)
  expect(status).toBe(401)
})

test('DELETE /houses/:id 404 (user)', async () => {
  const { status } = await request(app())
    .delete('/123456789098765432123456')
    .query({ access_token: anotherSession })
  expect(status).toBe(404)
})
