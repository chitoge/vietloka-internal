import mongoose from 'mongoose'
import _ from 'lodash'
import { success, notFound } from '../../services/response/'
import { Rent } from '.'
import { Guest } from '../guest'
import { House } from '../house'

// in order to rent, one must have Guest capability
export const create = ({ user, bodymen: { body } }, res, next) =>
  Guest.findOne({user: user.id, verified: true})
    .populate('user')
    .then(notFound(res))
    .then((guest) => mongoose.Types.ObjectId.isValid(body.house) ? House.findById(body.house) : null)
    .then(notFound(res))
    .then((house_) => house_ ? Rent.create({ house: house_.id, guest: user, accepted: false, completed: false }) : null)
    .then((rent) => rent.view(true))
    .then(success(res, 201))
    .catch(next)

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Rent.find(query, select, cursor)
    .populate('guest')
    .then((rents) => rents.map((rent) => rent.view()))
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Rent.findById(params.id)
    .populate('guest')
    .then(notFound(res))
    .then((rent) => rent ? rent.view() : null)
    .then(success(res))
    .catch(next)

// can only update as a Host, particularly updating completed and accepted field
// NOTE: if it's completed without accepted, it means this request has been canceled!
export const update = ({ bodymen: { body }, params }, res, next) =>
  Rent.findById(params.id)
    .populate('guest')
    .then(notFound(res))
    .then((rent) => rent ? _.merge(rent, body).save() : null)
    .then((rent) => rent ? rent.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ params }, res, next) =>
  Rent.findById(params.id)
    .then(notFound(res))
    .then((rent) => rent ? rent.remove() : null)
    .then(success(res, 204))
    .catch(next)
