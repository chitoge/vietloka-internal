import { Host } from '.'
import { User } from '../user'

let user, host

beforeEach(async () => {
  user = await User.create({ email: 'a@a.com', password: '123456' })
  host = await Host.create({ user })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = host.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(host.id)
    expect(typeof view.user).toBe('object')
    expect(view.user.id).toBe(user.id)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = host.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(host.id)
    expect(typeof view.user).toBe('object')
    expect(view.user.id).toBe(user.id)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
