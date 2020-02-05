import React from 'react'
import axios from 'axios'

import Comments from './Comments'
import { ReactComponent as TrashCan } from '../assets/images/icons/trash-solid.svg';
import { ReactComponent as Close } from '../assets/images/icons/times-circle-solid.svg';
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

export default class PostLightBox extends React.PureComponent {
    state = {
        comments: [],
        reactions: [],
        displayComments: false,
        showComments: false,
        newComment: '',
    }

    getAllCommentsAndReactions = async (postId) => {
        try {
            const promises = []
    
            promises.push(axios.get(`/&api&/comments/${postId}`))
            // promises.push(axios.get(`/&api&/reactions/${postId}`))
    
            const response = await Promise.all(promises)
            this.setState({
                comments: response[0].data.payload,
                // reactions: response[1].data.payload,
            })
        } catch (err) {
            handleNetworkErrors(err)
        }
    }

    componentDidMount() {
        this.getAllCommentsAndReactions(this.props.postId)
    }

    handleShowComments = () => {
        this.setState({showComments: true})
    }
    handleCloseComments = () => {
        this.setState({showComments: false})
    }

    handleAddCommentForm = async (event) => {
        event.preventDefault()

        try {
            const pw = sessionStorage.getItem('Suit_App_KS')
            const uId = sessionStorage.getItem('Suit_App_UId')
            const requestBody = {
                password: pw,
                body: this.state.newComment,
            }
            const { data } = await axios.post(`/&api&/comments/${this.props.postId}/${uId}`, requestBody)
            if (data.status === 'success') {
                this.getAllCommentsAndReactions(this.props.postId)
                this.setState({newComment: ''})
            }
        } catch (err) {
            handleNetworkErrors(err)
        }
    }

    handleCommentInput = event => {
        this.setState({newComment: event.target.value})
    }

    // ######################## RENDER ###################
    render() {
        const backgroundColor = 'rgba(77, 73, 73, 0.542)'
        const divStyle = {
            position: 'absolute',
            top: '3%',
            left: '2%',
            height: '95%',
            width: '100%',
            backgroundColor: backgroundColor,
        }
    
        const imageStyle = {
            width: '100%',
            height: '100%',
            objectFit: 'scale-down',
        }
 
        const uId = parseInt(sessionStorage.getItem('Suit_App_UId'))
        let commentsContainer = null
        if (this.state.showComments) {
            commentsContainer = <Comments userId={uId} postId={this.props.postId} allComments={this.state.comments} handleCloseComments={this.handleCloseComments} handleCommentInput={this.handleCommentInput} commentText={this.state.newComment} handleAddCommentForm={this.handleAddCommentForm} reloadComments={this.getAllCommentsAndReactions}/>
        }
    
        let trashCanIcon = null
        let saveButton = null
        let editIcon = null
        let edit = 'disabled'
        let postId = null

        if (this.props.allowedToEdit) {
            trashCanIcon = <TrashCan className='icon' style={{position: 'absolute', top: '0', right: '0'}} onClick={() => this.props.handleDeletePost(this.props.postId)}/>
            saveButton = <button className='btn btn-primary'><Save style={{width: '30px'}}/></button>
            editIcon = <Edit className='icon flex-grow-1'/>
            edit = ''
            postId = this.props.postId
        }

        return ( 
            <>
            <div className='container rounded' style={divStyle}>
                <div className='card position-relative' style={{width: '100%', height: '100%', backgroundColor: backgroundColor}}>
                    <Close className='position-absolute icon' onClick={this.props.handleClosePost} />
                    <div className='card-img-top position-relative' style={{width: '100%', height: '80%'}}>
                        {trashCanIcon}
                        <img src={this.props.image} alt='Card' style={imageStyle}/>
                        <span className='timestampSpan'>{new Date(this.props.timestamp).toLocaleString()}</span>
                    </div>
                    <div className='card-body p-1' style={{width: '100%', height: '20%'}}>
                        <form className='row' onSubmit={e => this.props.handleForm(e, postId)} style={{width: '100%', height: '83%'}}>
                            <div className='col-1'>
                                <label htmlFor='titleEdit'>{editIcon}</label>
                                {saveButton}
                            </div>
                            <div className='col-11 d-flex flex-column'>
                                <input className={`rounded mb-1`} type='text' id='titleEdit' value={this.props.title} onChange={e => this.props.handleTitleInput(e)} disabled={edit}/>
                                <textarea className={`rounded flex-grow-1`} value={this.props.caption} onChange={e => this.props.handleCaptionInput(e)} disabled={edit}/>
                            </div>
                        </form>
                        <div className='d-flex justify-content-between'>
                            <span className='text-white p-0 m-0 cursorPointer'>Reactions <span>{this.state.reactions.length}</span></span>
                            <span className='text-white p-0 m-0 cursorPointer' onClick={this.handleShowComments}>Comments <span>{this.state.comments.length}</span></span>
                        </div>
                    </div>
                </div>
            </div>
            {commentsContainer}
            </>
        )
    }
}