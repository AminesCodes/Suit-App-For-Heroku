import React from 'react'

export default function PostThumbnail(props) {
    return (
        <div className='img-thumbnail align-self-start m-2'>
            <img className='img-fluid cursorPointer' src={props.image} alt={props.tags} width='100px' onClick={e => props.handlePicClick(props.index)}/>
        </div>
    )
}