import { House } from '.'
import { User } from '../user'

let user, house

beforeEach(async () => {
  user = await User.create({ email: 'a@a.com', password: '123456' })
  house = await House.create({ host: user })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = house.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(house.id)
    expect(typeof view.host).toBe('object')
    expect(view.host.id).toBe(user.id)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = house.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(house.id)
    expect(typeof view.host).toBe('object')
    expect(view.host.id).toBe(user.id)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
