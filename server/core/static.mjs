import mount from 'koa-mount'
import serve from 'koa-static'
import staticOptions from './static.config'

export default mount( '/', serve( 'public', staticOptions ) )
