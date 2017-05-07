import { Rent } from '.'
import { User } from '../user'
import { House } from '../house'

let user, rent, house

beforeEach(async () => {
  user = await User.create({ email: 'a@a.com', password: '12345678' })
  house = await House.create({ owner: user, address: 'Address abc', numOfMember: 2, hasChildren: true, hasOlders: false, area: 6969, price: 12696, numOfTotalSlots: 2, houseAspect: 'kanye west', image: ['abc.jpg', 'def.tga'], map: {lat: 12.34, lng: 56.78}, hasInternet: true, WC: "of course" })
  rent = await Rent.create({ guest: user, house: house })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = rent.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(rent.id)
    expect(typeof view.guest).toBe('object')
    expect(view.guest.id).toBe(user.id)
    expect(view.house).toBe(rent.house)
    expect(view.accepted).toBe(rent.accepted)
    expect(view.completed).toBe(rent.completed)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = rent.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(rent.id)
    expect(typeof view.guest).toBe('object')
    expect(view.guest.id).toBe(user.id)
    expect(view.house).toBe(rent.house)
    expect(view.accepted).toBe(rent.accepted)
    expect(view.completed).toBe(rent.completed)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
