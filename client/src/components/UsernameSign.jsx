import React from 'react';

import './UsernameSign.css';

export default function UsernameSign(props) {
    return (
            <h2 className='j-username'>{props.username}</h2>
    );
}
