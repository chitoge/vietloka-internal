import { House } from '.'
import { User } from '../user'

let user, house

beforeEach(async () => {
  user = await User.create({ email: 'a@a.com', password: '12345678' })
  house = await House.create({ owner: user, address: 'Address abc', numOfMember: 2, hasChildren: true, hasOlders: false, area: 6969, price: 12696, numOfTotalSlots: 2, houseAspect: 'kanye west', image: ['abc.jpg', 'def.tga'], map: {lat: 12.34, lng: 56.78}, hasInternet: true, WC: "of course" })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = house.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(house.id)
    expect(typeof view.owner).toBe('object')
    expect(view.owner.id).toEqual(user._id)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = house.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(house.id)
    expect(typeof view.owner).toBe('object')
    expect(view.owner.id).toEqual(user._id)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
