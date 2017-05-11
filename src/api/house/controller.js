import _ from 'lodash'
import { success, notFound, authorOrAdmin } from '../../services/response/'
import { House } from '.'
import { Host } from '../host'
import { Rent } from '../rent'
import { Comment } from '../comment'

export const checkTooManyPics = (res, addCount) => (house) => {
  if (house) {
    if ((house.images.length + addCount) <= 10) { // can it go overflow :v
      return house
    }
    res.status(413).end() // payload too large
  }
  return null
}

export const create = ({ user, body }, res, next) =>
  Host.findOne({user: user.id, verified: true})
    .populate('user')
    .then(notFound(res))
    .then((host) => House.create({ ...body, owner: host.user }))
    .then((h) => h.view(true))
    .then(success(res, 201))
    .catch(next)

// image upload
export const imageUpload = ({ user, files }, res, next) =>
  House.findById(params.id)
    .then((t) => {console.log(t); return t})
    .populate('owner')
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'owner'))
    // check for images count
    .then(checkTooManyPics(res, files.length))
    .then((house) => house ? _.merge(house, {image: _.concat(house.image, files.map((file) => ('uploads/' + file.filename)))}) : null)
    .then((house) => house ? house.view(true) : null)
    .then(success(res, 201))
    .catch((err) => {console.log(err); next(err)})

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
    .then((house) => house ? house.view(true) : null)
    .then(success(res))
    .catch(next)

// count ratings
export const showRating = ({ params }, res, next) =>
  House.findById(params.id)
    .populate('owner')
    .then(notFound(res))
    .then((house) => house ? Rent.find({house: house, accepted: true, completed: true}, "_id") : null)
    .then((rents) => Promise.all(rents.map((rent) => Comment.findOne({rent: rent}, {approves: true}))))
    .then((ratings) => ratings.reduce((accumulate, current) => current ? 
      (current.approves ? {approval: accumulate.approval+1, disapproval: accumulate.disapproval} 
                        : {approval: accumulate.approval, disapproval: accumulate.disapproval+1})
                                                                       : accumulate, {approval: 0, disapproval: 0}))
    .then(success(res))
    .catch(next)

// show all comments about this house; returns id only
export const showComments = ({ params }, res, next) =>
  House.findById(params.id)
    .populate('owner')
    .then(notFound(res))
    .then((house) => house ? Rent.find({house: house, accepted: true, completed: true}, "_id") : null)
    .then((rents) => Promise.all(rents.map((rent) => Comment.findOne({rent: rent}, {_id: true}))))
    .then((comments) => comments.filter(Boolean))
    .then((comments) => comments.map((cmt) => cmt._id))
    .then(success(res))
    .catch(next)

export const showSelf = ({ user }, res, next) =>
  House.find({owner : user})
    .populate('owner')
    .then((houses) => houses.map((house) => house.view()))
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
