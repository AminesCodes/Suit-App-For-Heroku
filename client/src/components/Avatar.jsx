import React from 'react';

const imgAvatar = require('../assets/images/avatars/2.png');


export default function Avatar(props) {
    return (
        <div className='avatarDiv'>
            <img className='avatarImage' src={props.avatar || imgAvatar} alt='profile avatar'></img>
        </div>
    )
}