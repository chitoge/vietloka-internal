import request from 'supertest-as-promised'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import { House } from '../house'
import { Guest } from '../guest'
import routes, { Rent } from '.'

const app = () => express(routes)

let userSession, adminSession, anotherUserSession, rent, house, guest, anotherHouse, rent_confirmed, rent_completed, rent_refused, anotherHouse_2, anotherHouse_3, rent_1, rent_2, rent_3

beforeEach(async () => {
  const user = await User.create({ email: 'a@a.com', password: '12345678' })
  const anotherUser = await User.create({ email: 'b@b.com', password: '12345678' })
  const admin = await User.create({ email: 'c@c.com', password: '12345678', role: 'admin' })
  userSession = signSync(user.id)
  anotherUserSession = signSync(anotherUser.id)
  adminSession = signSync(admin.id)
  house = await House.create({ owner: anotherUser, title: 'what', address: 'Address abc', numOfMember: 2, hasChildren: true, hasOlders: false, area: 6969, price: 12696, numOfTotalSlots: 2, houseAspect: 'kanye west', image: ['abc.jpg', 'def.tga'], map: {lat: 12.34, lng: 56.78}, hasInternet: true, WC: "of course" })
  anotherHouse = await House.create({ owner: user, title: 'what', address: 'Address def', numOfMember: 2, hasChildren: true, hasOlders: false, area: 7070, price: 12696, numOfTotalSlots: 2, houseAspect: 'north west', image: ['abc.jpg', 'def.tga'], map: {lat: 12.34, lng: 56.78}, hasInternet: true, WC: "of course" })
  anotherHouse_2 = await House.create({ owner: user, title: 'what', address: 'Address ghi', numOfMember: 2, hasChildren: true, hasOlders: false, area: 7070, price: 12696, numOfTotalSlots: 2, houseAspect: 'north west', image: ['abc.jpg', 'def.tga'], map: {lat: 12.34, lng: 56.78}, hasInternet: true, WC: "of course" })
  anotherHouse_3 = await House.create({ owner: user, title: 'what', address: 'Address jkl', numOfMember: 2, hasChildren: true, hasOlders: false, area: 7070, price: 12696, numOfTotalSlots: 2, houseAspect: 'north west', image: ['abc.jpg', 'def.tga'], map: {lat: 12.34, lng: 56.78}, hasInternet: true, WC: "of course" })
  guest = await Guest.create({ nationality: 'Terran', user })
  rent = await Rent.create({ guest: user, house: house })
  rent_confirmed = await Rent.create({ guest: user, house: house, accepted: true, completed: false })
  rent_completed = await Rent.create({ guest: user, house: house, accepted: true, completed: true })
  rent_refused = await Rent.create({ guest: user, house: house, accepted: false, completed: true })
  rent_1 = await Rent.create({ guest: anotherUser, house: anotherHouse, accepted: true, completed: true })
  rent_2 = await Rent.create({ guest: anotherUser, house: anotherHouse, accepted: true, completed: true })
  rent_3 = await Rent.create({ guest: anotherUser, house: anotherHouse_2, accepted: true, completed: true })
})

test('POST /rents 404 (user, imaginary house)', async () => {
  const { status, body } = await request(app())
    .post('/')
    .send({ access_token: userSession, house: 'test' })
  expect(status).toBe(404)
})

test('POST /rents 201 (user, with guest role)', async () => {
  const { status, body } = await request(app())
    .post('/')
    .send({ access_token: userSession, house: house.id })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.house).toBe(house.id)
  expect(body.accepted).toEqual(false)
  expect(body.completed).toEqual(false)
  expect(typeof body.guest).toEqual('object')
})

test('POST /rents 404 (user, without guest role)', async () => {
  const { status, body } = await request(app())
    .post('/')
    .send({ access_token: anotherUserSession, house: house.id })
  expect(status).toBe(404)
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

test('GET /rents/history 200 (user)', async () => {
  const { status, body } = await request(app())
    .get(`/history`)
    .query({ access_token: userSession })
  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
})

test('GET /rents/:id/confirm 200 (host)', async () => {
  const { status, body } = await request(app())
    .get(`/${rent.id}/confirm`)
    .query({ otp_token: rent.confirmation_token })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(rent.id)
  expect(typeof body.guest).toEqual('object')
  expect(body.accepted).toBeTruthy()
  expect(body.completed).toBeFalsy()
})

test('GET /rents/:id/confirm 401 (host, invalid confirmation token)', async () => {
  const { status, body } = await request(app())
    .get(`/${rent.id}/confirm`)
    .query({ otp_token: 'abcdef' })
  expect(status).toBe(401)
})

// NOTE: no need to test for confirmed but incomplete requests; no crucial data should be changed in that case

test('GET /rents/:id/confirm 401 (host, completed rent)', async () => {
  const { status, body } = await request(app())
    .get(`/${rent_completed.id}/confirm`)
    .query({ otp_token: rent_completed.confirmation_token })
  expect(status).toBe(401)
})

test('GET /rents/:id/cancel 200 (host)', async () => {
  const { status, body } = await request(app())
    .get(`/${rent.id}/cancel`)
    .query({ otp_token: rent.confirmation_token })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(rent.id)
  expect(typeof body.guest).toEqual('object')
  expect(body.accepted).toBeFalsy()
  expect(body.completed).toBeTruthy()
})

test('GET /rents/:id/cancel 401 (host, invalid confirmation token)', async () => {
  const { status, body } = await request(app())
    .get(`/${rent.id}/cancel`)
    .query({ otp_token: 'abcdef' })
  expect(status).toBe(401)
  expect(rent.accepted).toBeFalsy()
  expect(rent.completed).toBeFalsy()
})

test('GET /rents/:id/cancel 401 (host, completed rent)', async () => {
  const { status, body } = await request(app())
    .get(`/${rent_completed.id}/cancel`)
    .query({ otp_token: rent_completed.confirmation_token })
  expect(status).toBe(401)
})

test('PUT /rents/:id/finish 200 (guest, confirmed rent)', async () => {
  const { status, body } = await request(app())
    .put(`/${rent_confirmed.id}/finish`)
    .send({ access_token: userSession })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(rent_confirmed.id)
  expect(body.completed).toBeTruthy()
})

test('PUT /rents/:id/finish 401 (guest, unconfirmed rent)', async () => {
  const { status, body } = await request(app())
    .put(`/${rent.id}/finish`)
    .send({ access_token: userSession })
  expect(status).toBe(401)
})

test('PUT /rents/:id/finish 401 (guest, completed rent)', async () => {
  const { status, body } = await request(app())
    .put(`/${rent_completed.id}/finish`)
    .send({ access_token: userSession })
  expect(status).toBe(401)
})

test('PUT /rents/:id/finish 401 (guest, refused rent)', async () => {
  const { status, body } = await request(app())
    .put(`/${rent_refused.id}/finish`)
    .send({ access_token: userSession })
  expect(status).toBe(401)
})

test('PUT /rents/:id/finish 401 (other guest)', async () => {
  const { status, body } = await request(app())
    .put(`/${rent_confirmed.id}/finish`)
    .send({ access_token: anotherUserSession })
  expect(status).toBe(401)
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
