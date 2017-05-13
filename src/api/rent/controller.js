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
// TODO: verify payment information
export const create = ({ user, bodymen: { body } }, res, next) =>
  Guest.findOne({user: user.id, verified: true})
    .populate('user')
    .then(notFound(res))
    .then((guest) => mongoose.Types.ObjectId.isValid(body.house) ? House.findById(body.house) : null)
    .then(notFound(res))
    // validate house capacity
    .then((house) => Promise.all([house, Rent.count({house: house, accepted: true, completed: false})]))
    .then((stuffs) => {
      if (stuffs[0].numOfTotalSlots > stuffs[1]) {
      return stuffs[0]
    }
    else {
      res.status(413).end() // payload too large
      return null
    }})
    // check if there are pending requests; no more requests if currently staying at this place or already placed an request
    .then((house) => Promise.all([house, Rent.count({house: house, guest: user, completed: false})]))
    .then((stuffs) => {
      if (stuffs[1] > 0) {
        res.status(409).end() // conflict
        return null
      }
      return stuffs[0]
    })
    // actually create an object
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
    .populate('house')
    .then(notFound(res))
    .then((rent) => rent ? rent.view(true) : null)
    .then(success(res))
    .catch(next)

export const showSelf = ({ user }, res, next) =>
  Rent.find({guest : user})
    .populate('guest')
    .populate('house')
    .then((rents) => rents.map((rent) => rent.view()))
    .then(success(res))
    .catch(next)

// view all rent history as Host
export const showRentHistory = ({ user }, res, next) =>
  House.find({owner: user})
    .populate('owner')
    .then(notFound(res))
    .then((houses) => houses.map((house) => Rent.find({house: house}).populate('house').populate('guest')))
    .then((rents) => Promise.all(rents))
    .then((rents_) => [].concat.apply([], rents_))
    .then((rents) => rents.map((rent) => rent.view()))
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
    .then((rent) => rent ? rent.view() : null)
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
    .then((rent) => rent ? rent.view() : null)
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
    .then((rent) => rent ? rent.view() : null)
    //.then((rent) => {console.log(rent); return rent})
    .then(success(res))
    .catch(next)

export const destroy = ({ params }, res, next) =>
  Rent.findById(params.id)
    .then(notFound(res))
    .then((rent) => rent ? rent.remove() : null)
    .then(success(res, 204))
    .catch(next)
