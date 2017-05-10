import _ from 'lodash'
import { success, notFound, authorOrAdmin } from '../../services/response/'
import { Comment } from '.'
import { Guest } from '../guest'
import { Host } from '../host'
import { Rent } from '../rent'
import { checkComplete, checkCustomer } from '../rent/controller'

export const create = ({ user, body }, res, next) =>
  Rent.findOne({_id: body.rent, accepted: true, completed: true})
    .populate('guest')
    .populate('house')
    .then(notFound(res))
    // now we actually found a completed rent; operate on this
    // check for actual customer
    .then(checkCustomer(res, user))
    .then((rent) => rent ? Comment.create({ ...body, guest: user, rent: rent }) : null)
    .then((comment) => comment.view(false))
    .then(success(res, 201))
    .catch((err) => {
      /* istanbul ignore else */
      if (err.name === 'MongoError' && err.code === 11000) {
        res.status(409).json({
          valid: false,
          param: 'rent',
          message: 'You made a comment with this transaction before'
        })
      } else {
        next(err)
      }
    })

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Comment.find(query, select, cursor)
    .populate('guest')
    .populate('rent')
    .then((comments) => comments.map((comment) => comment.view()))
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Comment.findById(params.id)
    .populate('guest')
    .populate('rent')
    .then(notFound(res))
    .then((comment) => comment ? comment.view() : null)
    .then(success(res))
    .catch(next)

export const update = ({ user, body, params }, res, next) =>
  Comment.findById(params.id)
    .populate('guest')
    .populate('rent')
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'guest'))
    .then((comment) => comment ? _.merge(comment, body).save() : null)
    .then((comment) => comment ? comment.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ user, params }, res, next) =>
  Comment.findById(params.id)
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'guest'))
    .then((comment) => comment ? comment.remove() : null)
    .then(success(res, 204))
    .catch(next)
