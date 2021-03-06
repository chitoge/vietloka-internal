import { Router } from 'express'
import user from './user'
import auth from './auth'
import comment from './comment'
import guest from './guest'
import host from './host'
import house from './house'
import rent from './rent'

const router = new Router()

/**
 * @apiDefine master Master access only
 * You must pass `access_token` parameter or a Bearer Token authorization header
 * to access this endpoint.
 */
/**
 * @apiDefine admin Admin access only
 * You must pass `access_token` parameter or a Bearer Token authorization header
 * to access this endpoint.
 */
/**
 * @apiDefine user User access only
 * You must pass `access_token` parameter or a Bearer Token authorization header
 * to access this endpoint.
 */
/**
 * @apiDefine listParams
 * @apiParam {String} [q] Query to search.
 * @apiParam {Number{1..30}} [page=1] Page number.
 * @apiParam {Number{1..100}} [limit=30] Amount of returned items.
 * @apiParam {String[]} [sort=-createdAt] Order of returned items.
 * @apiParam {String[]} [fields] Fields to be returned.
 */
router.use('/api/v1/users', user)
router.use('/auth', auth)
router.use('/api/v1/comments', comment)
router.use('/api/v1/guests', guest)
router.use('/api/v1/hosts', host)
router.use('/api/v1/houses', house)
router.use('/api/v1/rents', rent)

export default router
