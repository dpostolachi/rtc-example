import React, { PureComponent } from 'react'
import P2P from 'socket.io-p2p'
import io from 'socket.io-client'

const opts = {
	numClients: 10,
}

export default class Chatyx extends PureComponent {

	constructor( props ) {
		super( props )
		const socket = io( 'http://localhost:3001' )
		this.socket = new P2P( socket, opts, () => {
			console.log( 'Hello from RTC' )
		} )

		this.state = {
			messages: [],
		}

		this.sendMessage = this.sendMessage.bind( this )
		this.handleFile = this.handleFile.bind( this )

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
		e.currentTarget.value = ''
		console.log( 'sending', value )
		this.socket.emit( 'peer-msg', {
			text: value,
			attachments: [],
		} )
	}

	handleFile( e ) {
		Chatyx.getBase64( e.currentTarget.files[0] )
		.then( ( data ) => {
			this.socket.emit( 'peer-msg', {
				text: '',
				attachments: [ data ],
			} )
		} )
		// const { value } = e.currentTarget
	}

	static getBase64( file ) {
		return new Promise( ( resolve, reject ) => {
			const reader = new FileReader()
			reader.readAsArrayBuffer( file )
			reader.onload = () => {
				const arrayBuffer = reader.result
				resolve(
					{
						name: file.name,
						type: file.type,
						size: file.size,
						data: arrayBuffer
					}
				)
			}
			reader.onerror = () => {
				alert( 'nein' )
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
							return <li key={ key }>{ message.text } { message.attachments.map( ( attachment ) => {
								console.log( attachment )
								switch( attachment.type ){
									case 'image/png':
									case 'image/jpg':
									case 'image/gif':
										return <img src={ attachment.data } />
									case 'audio/mp3':
										return (
											<audio controls>
												<source src={ attachment.data } type={ attachment.type } />
											</audio>
										)
									case 'video/mp4':
									case 'video/quicktime':
									case 'video/x-quicktime':
										return (
											<video controls>
												<source src={ attachment.data } type={ attachment.type } />
											</video>
										)
									default:
										return null

								}
							} ) } </li>
						} )
					}
				</ul>
				<textarea onBlur={ this.sendMessage } />
				<input type='file' onChange={ this.handleFile } />
				<img id="wham" src="#" />
			</div>
		)
	}

}
