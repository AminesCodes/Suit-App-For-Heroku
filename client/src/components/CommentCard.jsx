import React from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

import Avatar from './Avatar'
import { ReactComponent as Close } from '../assets/images/icons/times-circle-solid.svg';
import { ReactComponent as TrashCan } from '../assets/images/icons/trash-solid.svg';
import { ReactComponent as Edit } from '../assets/images/icons/edit-solid.svg';
import { ReactComponent as Save } from '../assets/images/icons/save-solid.svg';


import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const handleNetworkErrors = err => {
    if (err.response) {
        if (err.response.data.message) {
            toast.error(err.response.data.message,
                { position: toast.POSITION.TOP_CENTER });
        } else {
            toast.error(`${err.response.data}: ${err.response.status} - ${err.response.statusText}`,
            { position: toast.POSITION.TOP_CENTER });
            console.log('Error', err);
        }
    } else if (err.message) {
        toast.error(err.message,
            { position: toast.POSITION.TOP_CENTER });
    } else {
        toast.error('Sorry, an error occurred, try again later',
            { position: toast.POSITION.TOP_CENTER });
        console.log('Error', err);
    }
}


export default class CommentCard extends React.PureComponent {
    state = {
        comment: this.props.comment,
        isEditable: this.props.userId === this.props.commenterId,
        showForm: false,
    }

    handleCommentInput = event => {
        this.setState({comment: event.target.value})
    }

    handleEditForm = async (event) => {
        event.preventDefault()

        if (this.state.comment && this.state.comment !== this.props.comment) {
            try {
                const pw = sessionStorage.getItem('Suit_App_KS')
                const requestBody = {
                    password: pw,
                    userId: this.props.userId,
                    body: this.state.comment
                }
                const { data } = await axios.put(`/&api&/comments/${this.props.commentId}`, requestBody)
                console.log(data)
                if (data.status === 'success') {
                    if (this.props.reloadComments) {
                        this.props.reloadComments(this.props.postId)
                    }
                    this.setState({
                        showForm: false,
                        // comment: this.props.comment
                    })
                }
            } catch (err) {
                handleNetworkErrors(err)
            }
        } else if (this.state.comment === this.props.comment){
            this.setState({ showForm: false })
        }
    }

    showEditForm = () => {
        this.setState({showForm: !this.state.showForm})
    }

    handleDeleteComment = async () => {
        try {
            const pw = sessionStorage.getItem('Suit_App_KS')
            const requestBody = {
                password: pw,
                userId: this.props.userId,
            }
            const { data } = await axios.patch(`/&api&/comments/${this.props.commentId}/delete`, requestBody)
            if (data.status === 'success') {
                if (this.props.reloadComments) {
                    this.props.reloadComments(this.props.postId)
                }
            }
        } catch (err) {
            handleNetworkErrors(err)
        }

    }

    // ########################## RENDER ######################
    render() {
        let commentControl = null
        if (this.state.isEditable) {
            commentControl = 
                <div className='col-sm-1'>
                    <Edit className='icon' onClick={this.showEditForm} />
                    <TrashCan className='icon' onClick={this.handleDeleteComment} />
                </div>
        }

        let editForm = null
        if (this.state.showForm) {
            editForm = 
            <form className='d-flex' onSubmit={this.handleEditForm} >
                <Close className='icon' onClick={this.showEditForm} />
                <div className='d-flex flex-column'>
                    <label htmlFor='editComment'><Edit className='icon flex-grow-1'/></label>
                    <button className='btn btn-primary'><Save style={{width: '30px'}}/></button>
                </div>
                <textarea className='rounded flex-grow-1' id='editComment' value={this.state.comment} onChange={this.handleCommentInput} />
            </form>
        }

        return (
            <div className='row'>
                <div className='col-sm-3'>
                    <Link to={`/${this.props.username}/persona`}>
                        <Avatar className='d-block' avatar={this.props.avatar} />
                        <strong className='d-block p-2 m-0'>{this.props.username}</strong>
                    </Link>
                </div>
                <div className='col-sm-9'>
                    <div className='row'>
                        <div className='col-sm-11'>
                            <span className='d-block m-2' >{this.props.comment}</span>
                            <span className='j-comm-time d-block m-2'>{new Date(this.props.timestamp).toLocaleString()}</span>
                        </div>
                        {commentControl}
                    </div>
                    {editForm}
                </div>
            </div>
        )
    }
}