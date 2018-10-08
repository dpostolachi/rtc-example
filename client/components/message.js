import React from 'react'
import styled, { css } from 'styled-components'
import moment from 'moment'

import {
	selfColor,
	selfText,
	otherText,
	otherColor
} from '../ui/colors'


const Message = styled.div`
	display: block;
`
const MessageText = styled.div`
	display: block;
	border-radius: 6px;
	background: red;
	padding: 3px 6px;
	line-height: 2rem;
	font-size: 1.6rem;
	color: #ffffff;
`

const MessageDate = styled.div`
	font-size: 1.3rem;
	line-height: 1.8rem;
	color: #9E9E9E;
`

const MessageContent = styled.div`
	display: inline-block;
`

const MessageContainer = styled.div`
	display: flex;
	margin-bottom: 12px;
	text-align: left;
	${ MessageText } {
		color: ${otherText};
		background: ${otherColor};
	}
	${ props => props.self && css`
		justify-content: flex-end;
		text-align: right;
		${ MessageText } {
			color: ${selfText};
			background: ${selfColor};
		}
	` }
`

const MessageAttachments = styled.div`
	display: inline-block;
	max-width: 60%;
	> img,
	> video,
	> audio {
		position: relative;
		max-width: 100%;
	}
`

export default ( ( { message, attachments, self, date } ) => {

	return (
		<MessageContainer self={ self }>
			<MessageContent>
				{
					( attachments.length ) ? (
						<MessageAttachments>
							{
								attachments.map( ( attachment, key ) => {
								   console.log( attachment )
								   switch( attachment.type ){
									   case 'image/png':
									   case 'image/jpeg':
									   case 'image/gif':
										   return <img src={ attachment.data } key={ key } />
									   case 'audio/mp3':
										   return (
											   <audio controls>
												   <source src={ attachment.data } type={ attachment.type } key={ key } />
											   </audio>
										   )
									   case 'video/mp4':
										   return (
											   <video controls>
												   <source src={ attachment.data } type={ attachment.type } key={ key } />
											   </video>
										   )
									   default:
										   return null

								   }
							   } )
							}
						</MessageAttachments>
					) : null
				}
				<Message>
					{
						message && (
							<MessageText>
								{ message }
							</MessageText>
						)
					}
					<MessageDate>
						{ moment( date ).format( 'HH:mm' ) }
					</MessageDate>
				</Message>
			</MessageContent>
		</MessageContainer>
	)

} )
