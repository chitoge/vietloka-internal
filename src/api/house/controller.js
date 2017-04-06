import _ from 'lodash'
import { success, notFound, authorOrAdmin } from '../../services/response/'
import { House } from '.'
import { Host } from '../host'

export const create = ({ user, body }, res, next) =>
  Host.findOne({user: user.id, verified: true})
    .populate('user')
    .then(notFound(res))
    .then(House.create({ ...body, owner: user }))
    .then((house) => house.view(true))
    .then(success(res, 201))
    .catch(next)

// TODO: implement advanced searching
export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  House.find(query, select, cursor)
    .populate('owner')
    .then((houses) => houses.map((house) => house.view()))
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  House.findById(params.id)
    .populate('owner')
    .then(notFound(res))
    .then((house) => house ? house.view() : null)
    .then(success(res))
    .catch(next)

export const update = ({ user, body, params }, res, next) =>
  House.findById(params.id)
    .populate('owner')
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'owner'))
    .then((house) => house ? _.merge(house, body).save() : null)
    .then((house) => house ? house.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ user, params }, res, next) =>
  House.findById(params.id)
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'owner'))
    .then((house) => house ? house.remove() : null)
    .then(success(res, 204))
    .catch(next)
