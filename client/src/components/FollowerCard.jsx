import React from 'react'
import { Link } from 'react-router-dom'
import Avatar from './Avatar'

export default function FollowerCard(props) {
    return (
        <div className='m-2 p-2'>
            <div className='card border border-light rounded'>
                <div >
                    <Link className="card-img-top d-flex align-items-center bg-light" to={`/${props.username}/persona`} >
                        <div>
                            <Avatar avatar={props.avatar} />
                        </div>
                        <strong className='col p-2 m-0'>{props.username}</strong>
                    </Link>
                </div>
                <button className='btn btn-sm btn-info w-90 m-2' onClick={e => props.buttonClick(props.userId)} disabled={props.active}>{props.btn}</button>
            </div>
        </div>
    )
}