import _ from 'lodash'
import { success, notFound, authorOrAdmin } from '../../services/response/'
import { Guest } from '.'

export const create = ({ user, body }, res, next) =>
  Guest.findOne({user : user.id})
    .populate('user')
    .then(notFound(res), Guest.create({ ...body, user }))
    .then((guest) => guest.view())
    .then(success(res, 201))
    .catch(next)

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Guest.find(query, select, cursor)
    .populate('user')
    .then((guests) => guests.map((guest) => guest.view()))
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Guest.findById(params.id)
    .populate('user')
    .then(notFound(res))
    .then((guest) => guest ? guest.view() : null)
    .then(success(res))
    .catch(next)

export const showSelf = ({ user }, res, next) =>
  Guest.findOne({user : user.id})
    .populate('user')
    .then(notFound(res))
    .then((guest) => guest ? guest.view() : null)
    .then(success(res))
    .catch(next)

export const update = ({ user, body, params }, res, next) =>
  Guest.findById(params.id)
    .populate('user')
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'user'))
    .then((guest) => guest ? _.merge(guest, body).save() : null)
    .then((guest) => guest ? guest.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ user, params }, res, next) =>
  Guest.findById(params.id)
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'user'))
    .then((guest) => guest ? guest.remove() : null)
    .then(success(res, 204))
    .catch(next)
