import request from 'supertest-as-promised'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import routes, { Host } from '.'

const app = () => express(routes)

let user, userSession, anotherSession, host

beforeEach(async () => {
  user = await User.create({ email: 'a@a.com', password: '12345678', job: 'Developer' })
  const anotherUser = await User.create({ email: 'b@b.com', password: '12345678' })
  userSession = signSync(user.id)
  anotherSession = signSync(anotherUser.id)
  host = await Host.create({ user: user })
})

test('POST /hosts 201 (user)', async () => {
  const { status, body } = await request(app())
    .post('/')
    .send({ access_token: anotherSession })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(typeof body.user).toEqual('object')
})

test('POST /hosts 401', async () => {
  const { status } = await request(app())
    .post('/')
  expect(status).toBe(401)
})

test('GET /hosts 200', async () => {
  const { status, body } = await request(app())
    .get('/')
  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
})

test('GET /hosts/:id 200', async () => {
  const { status, body } = await request(app())
    .get(`/${host.id}`)
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(host.id)
  expect(body.job).toBe(user.job)
})

test('GET /hosts/self 200', async () => {
  const { status, body } = await request(app())
    .get(`/self`)
    .query({ access_token: userSession })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(host.id)
  expect(body.job).toBe(user.job)
})

test('GET /hosts/self 401', async () => {
  const { status, body } = await request(app())
    .get(`/self`)
  expect(status).toBe(401)
})

test('GET /hosts/self 404', async () => {
  const { status, body } = await request(app())
    .get(`/self`)
    .query({ access_token: anotherSession })
  expect(status).toBe(404)
})

test('GET /hosts/:id 404', async () => {
  const { status } = await request(app())
    .get('/123456789098765432123456')
  expect(status).toBe(404)
})

test('PUT /hosts/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .put(`/${host.id}`)
    .send({ access_token: userSession })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(host.id)
  expect(typeof body.user).toEqual('object')
})

test('PUT /hosts/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .put(`/${host.id}`)
    .send({ access_token: anotherSession })
  expect(status).toBe(401)
})

test('PUT /hosts/:id 401', async () => {
  const { status } = await request(app())
    .put(`/${host.id}`)
  expect(status).toBe(401)
})

test('PUT /hosts/:id 404 (user)', async () => {
  const { status } = await request(app())
    .put('/123456789098765432123456')
    .send({ access_token: anotherSession })
  expect(status).toBe(404)
})

test('DELETE /hosts/:id 204 (user)', async () => {
  const { status } = await request(app())
    .delete(`/${host.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(204)
})

test('DELETE /hosts/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .delete(`/${host.id}`)
    .send({ access_token: anotherSession })
  expect(status).toBe(401)
})

test('DELETE /hosts/:id 401', async () => {
  const { status } = await request(app())
    .delete(`/${host.id}`)
  expect(status).toBe(401)
})

test('DELETE /hosts/:id 404 (user)', async () => {
  const { status } = await request(app())
    .delete('/123456789098765432123456')
    .query({ access_token: anotherSession })
  expect(status).toBe(404)
})
