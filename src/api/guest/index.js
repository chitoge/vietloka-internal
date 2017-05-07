import { Router } from 'express'
import { middleware as query } from 'querymen'
import { token } from '../../services/passport'
import { create, index, show, showSelf, update, destroy } from './controller'
export Guest, { schema } from './model'

const router = new Router()

/**
 * @api {post} /guests Create guest
 * @apiName CreateGuest
 * @apiGroup Guest
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess {Object} guest Guest's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Guest not found.
 * @apiError 401 user access only.
 */
router.post('/',
  token({ required: true }),
  create)

/**
 * @api {get} /guests Retrieve guests
 * @apiName RetrieveGuests
 * @apiGroup Guest
 * @apiUse listParams
 * @apiSuccess {Object[]} guests List of guests.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get('/',
  query(),
  index)

/**
 * @api {get} /guests/:id Retrieve self guest info
 * @apiName RetrieveSelfGuest
 * @apiGroup Guest
 * @apiSuccess {Object} guest Guest's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Guest not found.
 */
router.get('/self',
  token({ required: true }),
  showSelf)


/**
 * @api {get} /guests/:id Retrieve guest
 * @apiName RetrieveGuest
 * @apiGroup Guest
 * @apiSuccess {Object} guest Guest's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Guest not found.
 */
router.get('/:id',
  show)


/**
 * @api {put} /guests/:id Update guest
 * @apiName UpdateGuest
 * @apiGroup Guest
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess {Object} guest Guest's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Guest not found.
 * @apiError 401 user access only.
 */
router.put('/:id',
  token({ required: true }),
  update)

/**
 * @api {delete} /guests/:id Delete guest
 * @apiName DeleteGuest
 * @apiGroup Guest
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Guest not found.
 * @apiError 401 user access only.
 */
router.delete('/:id',
  token({ required: true }),
  destroy)

export default router
