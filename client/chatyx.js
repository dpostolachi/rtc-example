import React, { PureComponent } from 'react'
import P2P from 'socket.io-p2p'
import io from 'socket.io-client'
import Message from './components/message'

const opts = {
	numClients: 10,
}

export default class Chatyx extends PureComponent {

	constructor( props ) {
		super( props )
		const socket = io()
		this.socket = new P2P( socket, opts, () => {
			console.log( 'Hello from RTC' )
		} )

		this.state = {
			messages: [],
		}

		this.sendMessage = this.sendMessage.bind( this )
		this.handleFile = this.handleFile.bind( this )

	}

	pushMessage( message, self = false ) {
		this.setState( ( state, props ) => {
			return {
				messages: [
					...state.messages,
					{
						...message,
						self,
					}
				]
			}
		} )
	}

	componentDidMount() {
		this.socket.on( 'go-private', () => {
			this.socket.upgrade()
		} )
		this.socket.on('peer-msg', ( data ) => {
			console.log( 'got stuff', data )

			if ( data.attachments.length ) {
				data.attachments = data.attachments.map( ( data ) => {
					const { type } = data
					const arrayBufferView = new Uint8Array(data.data)
					const blob = new Blob( [ arrayBufferView ], { type } )
					const urlCreator = window.URL || window.webkitURL
					const imageUrl = urlCreator.createObjectURL( blob )
					return {
						data: imageUrl,
						type,
					}
				} )
			}

			this.setState( {
				messages: this.state.messages.concat( data )
			} )
		})
	}

	sendMessage( e ) {
		const { value } = e.currentTarget
		if ( value ) {

			e.currentTarget.value = ''

			const message = {
				message: value,
				attachments: [],
				date: new Date(),
			}

			this.socket.emit( 'peer-msg', message )
			this.pushMessage( message , true )

		}
	}

	handleFile( e ) {

		const Promises = []
		for( let i = 0; i < e.currentTarget.files.length; i++){
			Promises.push( Chatyx.getBase64( e.currentTarget.files[ i ] ) )
		}
		Promise.all( Promises )
		.then( ( data ) => {

			const message = {
				message: '',
				attachments: data,
				date: new Date(),
			}

			this.socket.emit( 'peer-msg', message )


			this.pushMessage( {
				...message,
				attachments: data.map( file => Chatyx.getBlobFromFile( file ) )
			}, true )


		} )
	}

	static getBlobFromFile( { type, data } ) {
		const arrayBufferView = new Uint8Array( data )
		const blob = new Blob( [ arrayBufferView ], { type } )
		const urlCreator = window.URL || window.webkitURL
		const imageUrl = urlCreator.createObjectURL( blob )
		return {
			data: imageUrl,
			type,
		}
	}

	static getBase64( file ) {
		return new Promise( ( resolve, reject ) => {
			const reader = new FileReader()
			reader.readAsArrayBuffer( file )
			reader.onload = () => {
				const arrayBuffer = reader.result
				// size: file.size,
				// name: file.name,
				resolve(
					{
						type: file.type,
						data: arrayBuffer
					}
				)
			}
			reader.onerror = () => {
				reject()
			}

		} )
	}


	render () {

		const { messages } = this.state
		return (
			<div>
				<ul>
					{
						messages.map( ( message, key ) => {
							return <Message { ...message } key={ key } />
						} )
					}
				</ul>
				<textarea onBlur={ this.sendMessage } />
				<input type='file' accept='image/jpeg,image/png,image/gif,video/mp4,audio/mp3' onChange={ this.handleFile } multiple/>
				<img id="wham" src="#" />
			</div>
		)
	}

}
