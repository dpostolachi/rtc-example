import Router from 'koa-router'

import HomeController from '../controllers/home'

const router = new Router()

router.get( '/', HomeController )

export default router.routes()
