import { Router } from 'express'
import { middleware as query } from 'querymen'
import { token } from '../../services/passport'
import { create, index, show, update, destroy, showSelf, showRating, showComments } from './controller'
export House, { schema } from './model'

const router = new Router()

/**
 * @api {post} /houses Create house
 * @apiName CreateHouse
 * @apiGroup House
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess {Object} house House's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 House not found.
 * @apiError 401 user access only.
 */
router.post('/',
  token({ required: true }),
  create)

/**
 * @api {get} /houses Retrieve houses
 * @apiName RetrieveHouses
 * @apiGroup House
 * @apiUse listParams
 * @apiSuccess {Object[]} houses List of houses.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get('/',
  query(),
  index)

/**
 * @api {get} /houses/:id Retrieve house
 * @apiName RetrieveHouse
 * @apiGroup House
 * @apiSuccess {Object} house House's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 House not found.
 */
router.get('/mine',
  token({ required: true }),
  showSelf)

/**
 * @api {get} /houses/:id Retrieve house
 * @apiName RetrieveHouse
 * @apiGroup House
 * @apiSuccess {Object} house House's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 House not found.
 */
router.get('/:id',
  show)

router.get('/:id/ratings',
  showRating)

router.get('/:id/comments',
  showComments)

/**
 * @api {put} /houses/:id Update house
 * @apiName UpdateHouse
 * @apiGroup House
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess {Object} house House's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 House not found.
 * @apiError 401 user access only.
 */
router.put('/:id',
  token({ required: true }),
  update)

/**
 * @api {delete} /houses/:id Delete house
 * @apiName DeleteHouse
 * @apiGroup House
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 House not found.
 * @apiError 401 user access only.
 */
router.delete('/:id',
  token({ required: true }),
  destroy)

export default router
