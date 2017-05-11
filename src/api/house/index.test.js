import request from 'supertest-as-promised'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import { Host } from '../host'
import { Rent } from '../rent'
import { Comment } from '../comment'
import routes, { House } from '.'
import path from 'path'

const app = () => express(routes)

let user, userSession, anotherSession, house, leHost, otherHouse

beforeEach(async () => {
  user = await User.create({ email: 'a@a.com', password: '12345678' })
  const anotherUser = await User.create({ email: 'b@b.com', password: '12345678' })
  userSession = signSync(user.id)
  anotherSession = signSync(anotherUser.id)
  // like requirement, this user must have host role
  leHost = await Host.create({ user })
  house = await House.create({ owner: user, title: 'Some clickbaits', address: 'Address abc', numOfMember: 2, hasChildren: true, hasOlders: false, area: 6969, price: 12696, numOfTotalSlots: 2, houseAspect: 'kanye west', image: [], map: {lat: 12, lng: 56}, hasInternet: true, WC: "of course" })
  otherHouse = await House.create({ owner: anotherUser, title: 'Some clickbaits', address: 'Address abc', numOfMember: 2, hasChildren: true, hasOlders: false, area: 6969, price: 12696, numOfTotalSlots: 2, houseAspect: 'kanye west', image: ['abc.jpg', 'def.tga'], map: {lat: 12, lng: 56}, hasInternet: true, WC: "of course" })
  const rent_1 = await Rent.create({ guest: user, house: house, accepted: true, completed: true })
  const rent_2 = await Rent.create({ guest: user, house: house, accepted: true, completed: true })
  const rent_3 = await Rent.create({ guest: user, house: house, accepted: true, completed: true })
  const rent_4 = await Rent.create({ guest: user, house: house, accepted: true, completed: true })
  const rent_5 = await Rent.create({ guest: user, house: house, accepted: true, completed: true })
  const rent_6 = await Rent.create({ guest: user, house: house, accepted: true, completed: true })
  const rent_7 = await Rent.create({ guest: user, house: house, accepted: true, completed: true })
  const rent_8 = await Rent.create({ guest: user, house: house, accepted: true, completed: true })
  const otherRent_1 = await Rent.create({ guest: user, house: otherHouse, accepted: true, completed: true })
  const otherRent_2 = await Rent.create({ guest: user, house: otherHouse, accepted: true, completed: true })
  const comment_1 = await Comment.create({ guest: user, rent: rent_1, title: "Feels good man", content: "Trump is number 1! Long live America! Hail victory! Hail teh peoplez!", approves: true })
  const comment_2 = await Comment.create({ guest: user, rent: rent_2, title: "Feels good man", content: "Trump is number 1! Long live America! Hail victory! Hail teh peoplez!", approves: true })
  const comment_3 = await Comment.create({ guest: user, rent: rent_3, title: "Feels good man", content: "Trump is number 1! Long live America! Hail victory! Hail teh peoplez!", approves: true })
  const comment_4 = await Comment.create({ guest: user, rent: rent_4, title: "Feels good man", content: "Trump is number 1! Long live America! Hail victory! Hail teh peoplez!", approves: true })
  const comment_5 = await Comment.create({ guest: user, rent: rent_5, title: "Feels bad man", content: "Trump is number 1! Long live America! Hail victory! Hail teh peoplez!", approves: false })
  const comment_6 = await Comment.create({ guest: user, rent: rent_6, title: "Feels bad man", content: "Trump is number 1! Long live America! Hail victory! Hail teh peoplez!", approves: false })
  const comment_7 = await Comment.create({ guest: user, rent: rent_7, title: "Feels bad man", content: "Trump is number 1! Long live America! Hail victory! Hail teh peoplez!", approves: false })
})

test('POST /houses 201 (user, with host role)', async () => {
  const { status, body } = await request(app())
    .post('/')
    .send({ access_token: userSession, title: 'Other clickbaits', address: 'Address def', numOfMember: 2, hasChildren: true, hasOlders: false, area: 7070, price: 12696, numOfTotalSlots: 2, houseAspect: 'kanye west', image: ['abc.jpg', 'def.tga'], map: {lat: 12, lng: 56}, hasInternet: true, WC: "of course" })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(typeof body.owner).toEqual('object')
  // check for proper data
  expect(body.address).toBeTruthy()
})

test('POST /houses 404 (user, without host role)', async () => {
  const { status, body } = await request(app())
    .post('/')
    .send({ access_token: anotherSession, title: 'Other clickbaits', address: 'Address def', numOfMember: 2, hasChildren: true, hasOlders: false, area: 7070, price: 12696, numOfTotalSlots: 2, houseAspect: 'kanye west', image: ['abc.jpg', 'def.tga'], map: {lat: 12, lng: 56}, hasInternet: true, WC: "of course" })
  expect(status).toBe(404)
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

test('GET /houses/mine 200', async () => {
  const { status, body } = await request(app())
    .get('/mine')
    .query({ access_token: userSession })
  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
  // should have my house
  expect(body.find((x) => { return (house.id === x.id) })).toBeTruthy()
  // shouldn't have others house
  expect(body.find((x) => { return (otherHouse.id === x.id) })).toBeFalsy()
})

test('GET /houses/mine 401', async () => {
  const { status, body } = await request(app())
    .get('/mine')
  expect(status).toBe(401)
})

test('GET /houses/:id 200', async () => {
  const { status, body } = await request(app())
    .get(`/${house.id}`)
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toBe(house.id)
  expect(body.address).toBeTruthy()
})

test('GET /houses/:id/ratings 200', async () => {
  const { status, body } = await request(app())
    .get(`/${house.id}/ratings`)
  expect(status).toBe(200)
  expect(body.approval).toBe(4)
  expect(body.disapproval).toBe(3)
})

test('GET /houses/:id/comments 200', async () => {
  const { status, body } = await request(app())
    .get(`/${house.id}/comments`)
  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
})

test('GET /houses/:id 404', async () => {
  const { status } = await request(app())
    .get('/123456789098765432123456')
  expect(status).toBe(404)
})

test('POST /houses/:id/upload_photos 201', async () => {
  const { status, body } = await request(app())
    .post(`/${house.id}/upload_photos`)
    .set({"Authorization": "Bearer " + userSession})
    .attach('house_photos', path.join(__dirname, '../../../test_data/triggered.jpg'))
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.id).toBe(house.id)
  expect(body.image).toBeTruthy()
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
