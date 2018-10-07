import IO from 'socket.io'
import P2P from 'socket.io-p2p-server'
import uuid from 'uuid/v4'

export default ( Server ) => {
	const io = IO( Server )
	io.use( P2P.Server )
	io.on( 'connection', ( socket ) => {
		// console.log( 'new connection' )
		socket.emit( 'go-private', () => {
			socket.broadcast.emit( 'go-private' )
		} )
	} )
}
