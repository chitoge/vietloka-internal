import { Router } from 'express'
import { middleware as query } from 'querymen'
import { token } from '../../services/passport'
import { create, index, show, update, destroy } from './controller'
export Comment, { schema } from './model'

const router = new Router()

/**
 * @api {post} /comments Create comment
 * @apiName CreateComment
 * @apiGroup Comment
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess {Object} comment Comment's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Comment not found.
 * @apiError 401 user access only.
 */
router.post('/',
  token({ required: true }),
  create)

/**
 * @api {get} /comments Retrieve comments
 * @apiName RetrieveComments
 * @apiGroup Comment
 * @apiUse listParams
 * @apiSuccess {Object[]} comments List of comments.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get('/',
  query(),
  index)

/**
 * @api {get} /comments/:id Retrieve comment
 * @apiName RetrieveComment
 * @apiGroup Comment
 * @apiSuccess {Object} comment Comment's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Comment not found.
 */
router.get('/:id',
  show)

/**
 * @api {put} /comments/:id Update comment
 * @apiName UpdateComment
 * @apiGroup Comment
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess {Object} comment Comment's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Comment not found.
 * @apiError 401 user access only.
 */
router.put('/:id',
  token({ required: true }),
  update)

/**
 * @api {delete} /comments/:id Delete comment
 * @apiName DeleteComment
 * @apiGroup Comment
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Comment not found.
 * @apiError 401 user access only.
 */
router.delete('/:id',
  token({ required: true }),
  destroy)

export default router
