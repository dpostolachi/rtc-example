import http from 'http'
import Koa from 'koa'
import serve from './server/core/static'
import views from './server/core/views'
import sockets from './server/core/sockets'
import router from './server/router'


const app = new Koa()

app.use( serve )
app.use( views )
app.use( router )

const Server = http.createServer( app.callback() )
Server.listen( 3001, () => {
	sockets( Server )
} )
