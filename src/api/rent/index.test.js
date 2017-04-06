import request from 'supertest-as-promised'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import routes, { Rent } from '.'

const app = () => express(routes)

let userSession, adminSession, rent

beforeEach(async () => {
  const user = await User.create({ email: 'a@a.com', password: '123456' })
  const admin = await User.create({ email: 'c@c.com', password: '123456', role: 'admin' })
  userSession = signSync(user.id)
  adminSession = signSync(admin.id)
  rent = await Rent.create({ guest: user })
})

test('POST /rents 201 (user)', async () => {
  const { status, body } = await request(app())
    .post('/')
    .send({ access_token: userSession, house: 'test', accepted: 'test', completed: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.house).toEqual('test')
  expect(body.accepted).toEqual('test')
  expect(body.completed).toEqual('test')
  expect(typeof body.guest).toEqual('object')
})

test('POST /rents 401', async () => {
  const { status } = await request(app())
    .post('/')
  expect(status).toBe(401)
})

test('GET /rents 200 (admin)', async () => {
  const { status, body } = await request(app())
    .get('/')
    .query({ access_token: adminSession })
  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
})

test('GET /rents 401 (user)', async () => {
  const { status } = await request(app())
    .get('/')
    .query({ access_token: userSession })
  expect(status).toBe(401)
})

test('GET /rents 401', async () => {
  const { status } = await request(app())
    .get('/')
  expect(status).toBe(401)
})

test('GET /rents/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .get(`/${rent.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(rent.id)
  expect(typeof body.guest).toEqual('object')
})

test('GET /rents/:id 401', async () => {
  const { status } = await request(app())
    .get(`/${rent.id}`)
  expect(status).toBe(401)
})

test('GET /rents/:id 404 (user)', async () => {
  const { status } = await request(app())
    .get('/123456789098765432123456')
    .query({ access_token: userSession })
  expect(status).toBe(404)
})

test('PUT /rents/:id 200', async () => {
  const { status, body } = await request(app())
    .put(`/${rent.id}`)
    .send({ house: 'test', accepted: 'test', completed: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(rent.id)
  expect(body.house).toEqual('test')
  expect(body.accepted).toEqual('test')
  expect(body.completed).toEqual('test')
})

test('PUT /rents/:id 404', async () => {
  const { status } = await request(app())
    .put('/123456789098765432123456')
    .send({ house: 'test', accepted: 'test', completed: 'test' })
  expect(status).toBe(404)
})

test('DELETE /rents/:id 204 (admin)', async () => {
  const { status } = await request(app())
    .delete(`/${rent.id}`)
    .query({ access_token: adminSession })
  expect(status).toBe(204)
})

test('DELETE /rents/:id 401 (user)', async () => {
  const { status } = await request(app())
    .delete(`/${rent.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(401)
})

test('DELETE /rents/:id 401', async () => {
  const { status } = await request(app())
    .delete(`/${rent.id}`)
  expect(status).toBe(401)
})

test('DELETE /rents/:id 404 (admin)', async () => {
  const { status } = await request(app())
    .delete('/123456789098765432123456')
    .query({ access_token: adminSession })
  expect(status).toBe(404)
})
