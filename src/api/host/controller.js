import _ from 'lodash'
import { success, notFound, authorOrAdmin } from '../../services/response/'
import { Host } from '.'

export const create = ({ user, body }, res, next) =>
  Host.create({ ...body, user: user })
    .then((host) => host.view())
    .then(success(res, 201))
    .catch((err) => {
      /* istanbul ignore else */
      if (err.name === 'MongoError' && err.code === 11000) {
        res.status(409).json({
          valid: false,
          param: 'user',
          message: 'user already has host role'
        })
      } else {
        next(err)
      }
    })

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Host.find(query, select, cursor)
    .populate('user')
    .then((hosts) => hosts.map((host) => host.view()))
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Host.findById(params.id)
    .populate('user')
    .then(notFound(res))
    .then((host) => host ? host.view() : null)
    .then(success(res))
    .catch(next)

export const showSelf = ({ user }, res, next) =>
  Host.findOne({user : user})
    .populate('user')
    .then(notFound(res))
    .then((host) => host ? host.view() : null)
    .then(success(res))
    .catch(next)

export const update = ({ user, body, params }, res, next) =>
  Host.findById(params.id)
    .populate('user')
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'user'))
    .then((host) => host ? _.merge(host, body).save() : null)
    .then((host) => host ? host.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ user, params }, res, next) =>
  Host.findById(params.id)
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'user'))
    .then((host) => host ? host.remove() : null)
    .then(success(res, 204))
    .catch(next)
