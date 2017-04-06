import { Comment } from '.'
import { User } from '../user'

let user, comment

beforeEach(async () => {
  user = await User.create({ name: 'user', email: 'a@a.com', password: '12345678'})
  comment = await Comment.create({ user })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = comment.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(comment.id)
    expect(typeof view.user).toBe('object')
    expect(view.user.id).toBe(user.id)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = comment.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(comment.id)
    expect(typeof view.user).toBe('object')
    expect(view.user.id).toBe(user.id)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
