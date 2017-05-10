import request from 'supertest-as-promised'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import { House } from '../house'
import { Rent } from '../rent'
import routes, { Comment } from '.'

const app = () => express(routes)

let userSession, anotherSession, comment, house, anotherHouse, rent, another_rent_completed, rent_completed, rent_rejected

beforeEach(async () => {
  const user = await User.create({ name: 'user', email: 'a@a.com', password: '12345678'})
  const anotherUser = await User.create({ email: 'b@b.com', password: '12345678' })
  userSession = signSync(user.id)
  anotherSession = signSync(anotherUser.id)
  house = await House.create({ owner: anotherUser, title: 'what', address: 'Address abc', numOfMember: 2, hasChildren: true, hasOlders: false, area: 6969, price: 12696, numOfTotalSlots: 2, houseAspect: 'kanye west', image: ['abc.jpg', 'def.tga'], map: {lat: 12.34, lng: 56.78}, hasInternet: true, WC: "of course" })
  anotherHouse = await House.create({ owner: user, title: 'what', address: 'Address def', numOfMember: 2, hasChildren: true, hasOlders: false, area: 7070, price: 12696, numOfTotalSlots: 2, houseAspect: 'north west', image: ['abc.jpg', 'def.tga'], map: {lat: 12.34, lng: 56.78}, hasInternet: true, WC: "of course" })
  rent = await Rent.create({ guest: user, house: house })
  rent_completed = await Rent.create({ guest: user, house: house, accepted: true, completed: true })
  another_rent_completed = await Rent.create({ guest: user, house: anotherHouse, accepted: true, completed: true })
  rent_rejected = await Rent.create({ guest: user, house: house, accepted: false, completed: true })
  comment = await Comment.create({ guest: user, rent: rent_completed, title: "Good place to go!", content: "Totally satisfied with this! Will come again! Highly recommended!", approves: true })
})

test('POST /comments 201 (user)', async () => {
  const { status, body } = await request(app())
    .post('/')
    .send({ access_token: userSession, rent: another_rent_completed.id, title: "Roads untraveled", content: "There's a seat here alongside me", approves: true })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(typeof body.guest).toEqual('object')
})

test('POST /comments 404 (user, rejected rent)', async () => {
  const { status, body } = await request(app())
    .post('/')
    .send({ access_token: userSession, rent: rent_rejected.id, title: "Roads untraveled", content: "There's a seat here alongside me", approves: true })
  expect(status).toBe(404)
})

test('POST /comments 409 (user, existed comment)', async () => {
  const { status, body } = await request(app())
    .post('/')
    .send({ access_token: userSession, rent: rent_completed.id, title: "Powerless", content: "There's a seat here alongside me", approves: true })
  expect(status).toBe(409)
})

test('POST /comments 401', async () => {
  const { status } = await request(app())
    .post('/')
  expect(status).toBe(401)
})

test('GET /comments 200', async () => {
  const { status, body } = await request(app())
    .get('/')
  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
})

test('GET /comments/:id 200', async () => {
  const { status, body } = await request(app())
    .get(`/${comment.id}`)
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(comment.id)
})

test('GET /comments/:id 404', async () => {
  const { status } = await request(app())
    .get('/123456789098765432123456')
  expect(status).toBe(404)
})

test('PUT /comments/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .put(`/${comment.id}`)
    .send({ access_token: userSession, content: "Skin to bone, steel to rust" })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(comment.id)
  expect(typeof body.guest).toEqual('object')
})

test('PUT /comments/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .put(`/${comment.id}`)
    .send({ access_token: anotherSession })
  expect(status).toBe(401)
})

test('PUT /comments/:id 401', async () => {
  const { status } = await request(app())
    .put(`/${comment.id}`)
  expect(status).toBe(401)
})

test('PUT /comments/:id 404 (user)', async () => {
  const { status } = await request(app())
    .put('/123456789098765432123456')
    .send({ access_token: anotherSession })
  expect(status).toBe(404)
})

test('DELETE /comments/:id 204 (user)', async () => {
  const { status } = await request(app())
    .delete(`/${comment.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(204)
})

test('DELETE /comments/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .delete(`/${comment.id}`)
    .send({ access_token: anotherSession })
  expect(status).toBe(401)
})

test('DELETE /comments/:id 401', async () => {
  const { status } = await request(app())
    .delete(`/${comment.id}`)
  expect(status).toBe(401)
})

test('DELETE /comments/:id 404 (user)', async () => {
  const { status } = await request(app())
    .delete('/123456789098765432123456')
    .query({ access_token: anotherSession })
  expect(status).toBe(404)
})
