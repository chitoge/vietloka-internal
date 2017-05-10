import mongoose from 'mongoose'
import _ from 'lodash'
import { success, notFound } from '../../services/response/'
import { Rent } from '.'
import { Guest } from '../guest'
import { House } from '../house'

// token verifier
export const tokenMatch = (res, suppliedToken) => (current_rent) => {
  if (current_rent) {
    if (suppliedToken === current_rent.confirmation_token) {
      return current_rent
    }
    res.status(401).end()
  }
  return null
}

export const checkVerifiedRequest = (res) => (current_rent) => {
  if (current_rent) {
    if (current_rent.accepted) {
      return current_rent
    }
    res.status(401).end()
  }
  return null
}

export const checkIncomplete = (res) => (current_rent) => {
  if (current_rent) {
    if (!current_rent.completed) {
      return current_rent
    }
    res.status(401).end()
  }
  return null
}

export const checkCustomer = (res, user) => (current_rent) => {
  if (current_rent) {
    if (current_rent.guest.equals(user.id)) {
      return current_rent
    }
    res.status(401).end()
  }
  return null
}

// in order to rent, one must have Guest capability
// TODO: validate CSRF token
// TODO: verify payment information
export const create = ({ user, bodymen: { body } }, res, next) =>
  Guest.findOne({user: user.id, verified: true})
    .populate('user')
    .then(notFound(res))
    .then((guest) => mongoose.Types.ObjectId.isValid(body.house) ? House.findById(body.house) : null)
    .then(notFound(res))
    // validate house capacity
    .then((house_) => house_ ? Rent.create({ house: house_.id, guest: user, accepted: false, completed: false }) : null)
    // notify host for confirmation
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

// change Host confirmation status
export const hostConfirm = ({ params, query }, res, next) =>
  Rent.findById(params.id)
    .populate('guest')
    .then(notFound(res))
    // verify incompleted request
    .then(checkIncomplete(res))
    // verify confirmation token
    .then(tokenMatch(res, query.otp_token))
    .then((rent) => rent ? _.merge(rent, {accepted: true, completed: false}).save() : null)
    .then((rent) => rent ? rent.view(true) : null)
    .then(success(res))
    .catch(next)

export const hostCancel = ({ params, query }, res, next) =>
  Rent.findById(params.id)
    .populate('guest')
    .then(notFound(res))
    // verify incompleted request
    .then(checkIncomplete(res))
    // verify confirmation token
    .then(tokenMatch(res, query.otp_token))
    .then((rent) => rent ? _.merge(rent, {accepted: false, completed: true}).save() : null)
    .then((rent) => rent ? rent.view(true) : null)
    .then(success(res))
    .catch(next)

export const guestFinish = ({ user, params }, res, next) =>
  Rent.findById(params.id)
    .populate('guest')
    .then(notFound(res))
    // verify guest
    .then(checkCustomer(res, user))
    //.then((rent) => {console.log('customer');console.log(rent); return rent})
    // verify completed status; no more completion after completed
    .then(checkIncomplete(res))
    //.then((rent) => {console.log('completed');console.log(rent); return rent})
    // verify confirmation status
    .then(checkVerifiedRequest(res))
    //.then((rent) => {console.log('verified');console.log(rent); return rent})
    .then((rent) => rent ? _.merge(rent, {completed: true}).save() : null)
    .then((rent) => rent ? rent.view(true) : null)
    //.then((rent) => {console.log(rent); return rent})
    .then(success(res))
    .catch(next)

export const destroy = ({ params }, res, next) =>
  Rent.findById(params.id)
    .then(notFound(res))
    .then((rent) => rent ? rent.remove() : null)
    .then(success(res, 204))
    .catch(next)
