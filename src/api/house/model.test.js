import { House } from '.'
import { User } from '../user'

let user, house

beforeEach(async () => {
  user = await User.create({ email: 'a@a.com', password: '12345678' })
  house = await House.create({ owner: user, address: 'Address abc', numOfMember: 2, hasChildren: true, hasOlders: false, area: 'Outskirt', price: {monthlyPrice: 12346, electricityPrice: 1213, waterPrice: 1242}, numOfRemainingSlot: 2, properties: {WC: 'of course we do have', hasInternet: true}, image: ['abc.jpg', 'def.tga'], map: "lat long isn't it" })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = house.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(house.id)
    expect(typeof view.owner).toBe('object')
    expect(view.owner.id).toBe(user.id)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = house.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(house.id)
    expect(typeof view.owner).toBe('object')
    expect(view.owner.id).toBe(user.id)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
