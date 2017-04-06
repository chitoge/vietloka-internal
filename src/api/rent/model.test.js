import { Rent } from '.'
import { User } from '../user'

let user, rent

beforeEach(async () => {
  user = await User.create({ email: 'a@a.com', password: '123456' })
  rent = await Rent.create({ guest: user, house: 'test', accepted: 'test', completed: 'test' })
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
