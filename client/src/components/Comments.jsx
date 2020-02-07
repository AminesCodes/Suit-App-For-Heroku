import React from 'react'

import CommentCard from './CommentCard'

import { ReactComponent as Close } from '../assets/images/icons/times-circle-solid.svg';
import { ReactComponent as Edit } from '../assets/images/icons/edit-solid.svg';
import { ReactComponent as Save } from '../assets/images/icons/save-solid.svg';

export default class Comments extends React.PureComponent {


    // ################## RENDER ######################
    render() {
        const backgroundColor = 'white'
        const divStyle = {
            zIndex: 1,
            position: 'absolute',
            top: '3%',
            left: '2%',
            height: '95%',
            width: '100%',
            backgroundColor: backgroundColor,
            overflow: 'scroll'
        }
        const iconStyle = {
            zIndex: 1,
            height: '30px',
            width: '30px',
            padding: '0 5px',
            marginBottom: '10px',
            cursor: 'pointer',
            fill: 'red',
        }
        
        return (
            <div className='container rounded' style={divStyle}>
                <Close className='' style={iconStyle} onClick={this.props.handleCloseComments} />
                <form className='d-flex p-3' onSubmit={e => this.props.handleAddCommentForm(e)} style={{width: '100%'}}>
                    <div className='d-flex flex-column'>
                        <label htmlFor='newComment'><Edit className='icon flex-grow-1'/></label>
                        <button className='btn btn-primary'><Save style={{width: '30px'}}/></button>
                    </div>
                    <textarea className='rounded flex-grow-1' id='newComment' value={this.props.commentText} onChange={e => this.props.handleCommentInput(e)}></textarea>
                </form>
                {this.props.allComments.map(comment => <CommentCard key={comment.comment_id + comment.username} postId={this.props.postId} commentId={comment.comment_id} avatar={comment.avatar_url} username={comment.username} comment={comment.comment_body} timestamp={comment.time_created} loggedUserId={this.props.loggedUserId} commenterId={comment.commenter_id} reloadComments={this.props.reloadComments} />)}
            </div>
        )
    }
}