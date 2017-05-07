import request from 'supertest-as-promised'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import { Host } from '../host'
import routes, { House } from '.'

const app = () => express(routes)

let user, userSession, anotherSession, house, leHost

beforeEach(async () => {
  user = await User.create({ email: 'a@a.com', password: '12345678' })
  const anotherUser = await User.create({ email: 'b@b.com', password: '12345678' })
  userSession = signSync(user.id)
  anotherSession = signSync(anotherUser.id)
  // like requirement, this user must have host role
  leHost = await Host.create({ user })
  house = await House.create({ owner: user, address: 'Address abc', numOfMember: 2, hasChildren: true, hasOlders: false, area: 6969, price: 12696, numOfTotalSlots: 2, houseAspect: 'kanye west', image: ['abc.jpg', 'def.tga'], map: {lat: 12, lng: 56}, hasInternet: true, WC: "of course" })
})

test('POST /houses 201, then GET /houses/:id (user, with host role)', async () => {
  const { status, body } = await request(app())
    .post('/')
    .send({ access_token: userSession, address: 'Address def', numOfMember: 2, hasChildren: true, hasOlders: false, area: 7070, price: 12696, numOfTotalSlots: 2, houseAspect: 'kanye west', image: ['abc.jpg', 'def.tga'], map: {lat: 12, lng: 56}, hasInternet: true, WC: "of course" })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(typeof body.user).toEqual('object')
})

test('POST /houses 201 (user, with host role) (issue #7)', async () => {
  const { status, body } = await request(app())
    .post('/')
    .send({ access_token: userSession, address: 'Address def', numOfMember: 2, hasChildren: true, hasOlders: false, area: 7070, price: 12696, numOfTotalSlots: 2, houseAspect: 'kanye west', image: ['abc.jpg', 'def.tga'], map: {lat: 12, lng: 56}, hasInternet: true, WC: "of course" })
  expect(status).toBe(201)
  console.log(body)
  expect(typeof body).toEqual('object')
  expect(typeof body.user).toEqual('object')
  // check actual correct user.id
  expect(body.user.id).toEqual(user.id)
  // check GET-able house.id
  let house_id = body.id
  const { get_status, get_body } = await request(app())
    .get(`/${house_id}`)
  console.log(get_body)
  expect(get_status).toBe(200)
  expect(typeof get_body).toEqual('object')
  expect(get_body.id).toEqual(house.id)
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
  expect(typeof body.owner).toEqual('object')
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
