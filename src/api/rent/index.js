import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { token } from '../../services/passport'
import { create, index, show, destroy, hostConfirm, hostCancel, guestFinish, showSelf } from './controller'
import { schema } from './model'
export Rent, { schema } from './model'

const router = new Router()
const { house, accepted, completed } = schema.tree

/**
 * @api {post} /rents Create rent
 * @apiName CreateRent
 * @apiGroup Rent
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam house Rent's house.
 * @apiParam accepted Rent's accepted.
 * @apiParam completed Rent's completed.
 * @apiSuccess {Object} rent Rent's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Rent not found.
 * @apiError 401 user access only.
 */
router.post('/',
  token({ required: true }),
  body({ house, accepted, completed }),
  create)

/**
 * @api {get} /rents Retrieve rents
 * @apiName RetrieveRents
 * @apiGroup Rent
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiUse listParams
 * @apiSuccess {Object[]} rents List of rents.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 admin access only.
 */
router.get('/',
  token({ required: true, roles: ['admin'] }),
  query(),
  index)

/**
 * @api {get} /rents/:id Retrieve rent
 * @apiName RetrieveRent
 * @apiGroup Rent
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess {Object} rent Rent's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Rent not found.
 * @apiError 401 user access only.
 */
router.get('/mine',
  token({ required: true }),
  showSelf)

/**
 * @api {get} /rents/:id Retrieve rent
 * @apiName RetrieveRent
 * @apiGroup Rent
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess {Object} rent Rent's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Rent not found.
 * @apiError 401 user access only.
 */
router.get('/:id',
  token({ required: true }),
  show)

/**
 * @api {get} /rents/:id Retrieve rent
 * @apiName RetrieveRent
 * @apiGroup Rent
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess {Object} rent Rent's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Rent not found.
 * @apiError 401 user access only.
 */
router.get('/:id/confirm',
  hostConfirm)

/**
 * @api {get} /rents/:id Retrieve rent
 * @apiName RetrieveRent
 * @apiGroup Rent
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess {Object} rent Rent's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Rent not found.
 * @apiError 401 user access only.
 */
router.get('/:id/cancel',
  hostCancel)

/**
 * @api {put} /rents/:id Retrieve rent
 * @apiName RetrieveRent
 * @apiGroup Rent
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess {Object} rent Rent's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Rent not found.
 * @apiError 401 user access only.
 */
router.put('/:id/finish',
  token({ required: true }),
  guestFinish)

/**
 * @api {delete} /rents/:id Delete rent
 * @apiName DeleteRent
 * @apiGroup Rent
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Rent not found.
 * @apiError 401 admin access only.
 */
router.delete('/:id',
  token({ required: true, roles: ['admin'] }),
  destroy)

export default router
