import { Comment } from '.'
import { User } from '../user'
import { House } from '../house'
import { Rent } from '../rent'

let user, comment, house, rent

beforeEach(async () => {
  user = await User.create({ name: 'user', email: 'a@a.com', password: '12345678'})
  house = await House.create({ owner: user, title: 'what', address: 'Address abc', numOfMember: 2, hasChildren: true, hasOlders: false, area: 6969, price: 12696, numOfTotalSlots: 2, houseAspect: 'kanye west', image: ['abc.jpg', 'def.tga'], map: {lat: 12.34, lng: 56.78}, hasInternet: true, WC: "of course" })
  rent = await Rent.create({ guest: user, house: house, accepted: true, completed: true })
  comment = await Comment.create({ guest: user, rent: rent, house: house, title: "Feels good man", content: "Trump is number 1! Long live America! Hail victory! Hail teh peoplez!", approves: true })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = comment.view()
    console.log(view)
    console.log(comment)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(comment.id)
    expect(typeof view.guest).toBe('object')
    expect(view.guest.id).toBe(user.id)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
    expect(view.title).toBeTruthy()
    expect(view.content).toBeTruthy()
    expect(view.guest).toBeTruthy()
    expect(view.house).toBeTruthy()
  })

  it('returns full view', () => {
    const view = comment.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(comment.id)
    expect(typeof view.guest).toBe('object')
    expect(view.guest.id).toBe(user.id)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
    expect(view.title).toBeTruthy()
    expect(view.content).toBeTruthy()
    expect(view.guest).toBeTruthy()
    expect(view.house).toBeTruthy()
  })
})
