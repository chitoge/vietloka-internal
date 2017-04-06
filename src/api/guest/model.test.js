import { Guest } from '.'
import { User } from '../user'

let user, guest

beforeEach(async () => {
  user = await User.create({ email: 'a@a.com', password: '12345678' })
  guest = await Guest.create({ user })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = guest.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(guest.id)
    expect(typeof view.user).toBe('object')
    expect(view.user.id).toBe(user.id)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = guest.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(guest.id)
    expect(typeof view.user).toBe('object')
    expect(view.user.id).toBe(user.id)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
