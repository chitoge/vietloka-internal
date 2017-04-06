import { Router } from 'express'
import { middleware as query } from 'querymen'
import { token } from '../../services/passport'
import { create, index, show, showSelf, update, destroy } from './controller'
export Host, { schema } from './model'

const router = new Router()

/**
 * @api {post} /hosts Create host
 * @apiName CreateHost
 * @apiGroup Host
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess {Object} host Host's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Host not found.
 * @apiError 401 user access only.
 */
router.post('/',
  token({ required: true }),
  create)

/**
 * @api {get} /hosts Retrieve hosts
 * @apiName RetrieveHosts
 * @apiGroup Host
 * @apiUse listParams
 * @apiSuccess {Object[]} hosts List of hosts.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get('/',
  query(),
  index)

/**
 * @api {get} /hosts/:id Retrieve host
 * @apiName RetrieveHost
 * @apiGroup Host
 * @apiSuccess {Object} host Host's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Host not found.
 */
router.get('/:id',
  show)

/**
 * @api {get} /hosts/:id Retrieve host
 * @apiName RetrieveHost
 * @apiGroup Host
 * @apiSuccess {Object} host Host's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Host not found.
 */
router.get('/self',
  showSelf)

/**
 * @api {put} /hosts/:id Update host
 * @apiName UpdateHost
 * @apiGroup Host
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess {Object} host Host's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Host not found.
 * @apiError 401 user access only.
 */
router.put('/:id',
  token({ required: true }),
  update)

/**
 * @api {delete} /hosts/:id Delete host
 * @apiName DeleteHost
 * @apiGroup Host
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Host not found.
 * @apiError 401 user access only.
 */
router.delete('/:id',
  token({ required: true }),
  destroy)

export default router
