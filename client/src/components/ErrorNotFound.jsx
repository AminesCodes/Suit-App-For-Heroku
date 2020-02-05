import React from 'react';

const img404 = require('../assets/images/404notfound.jpg');


export default function ErrorNotFound() {
    return(
        <img className='img-fluid d-sm-block mx-auto' src={img404} alt='404 Error' width='90%'/>
    )
}