/*
PostCard Component | Client | SUITAPP Web App
GROUP 1: Amine Bensalem, Douglas MacKrell, Savita Madray, Joseph P. Pasaoa
*/


import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import './PostCard.css';

import CommentCard from './CommentCard'

const iconLike = require("../assets/images/reactions/like.svg");
const iconComment = require("../assets/images/reactions/comment.svg");

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


export default class PostCard extends Component {
  uId = Number(sessionStorage.getItem('Suit_App_UId'));
  pw = sessionStorage.getItem('Suit_App_KS');
  state = {
    comments: [],
    reactions: [],
    currUserLikeId: null,
    areCommentsVisible: false
  }

  async componentDidMount() {
    await this.getCommentsAndReactions();
  }

  async componentDidUpdate(prevProps, prevState) {
    const prevIsLiked = !!prevState.currUserLikeId;
    const currIsLiked = !!this.state.currUserLikeId;
    if (prevIsLiked !== currIsLiked) {
      await this.getCommentsAndReactions();
    }
  }

  getCommentsAndReactions = async () => {
    const [ commentsResponse, reactionsResponse ] = await Promise.all([
      await axios.get(`/&api&/comments/${this.props.postId}`),
      await axios.get(`/&api&/reactions/post/all/${this.props.postId}`)
    ]);
    const comments = commentsResponse.data.payload;
    const allReactions = reactionsResponse.data.payload;
    const reactions = allReactions.filter(el => !el.comment_id);
    for (let reaction of reactions) {
      if (reaction.reactor_id === this.uId) {
        this.setState((prevState, props) => {
            return { currUserLikeId: reaction.reaction_id.toString() }
        });
        break;
      }
    }
    this.setState((prevState, props) => {
        return { comments: comments, reactions: reactions }
    });
  }

  handleLikeClick = async () => {
    try {
      if (!this.state.currUserLikeId) {
        const url = `/&api&/reactions/add/post/${this.props.postId}`;
        const postBody = {
          password: this.pw,
          reactorId: this.props.loggedUserId + '',
          emojiType: 1
        }
        const response = await axios.post(url, postBody);
        this.setState({ currUserLikeId: response.data.payload.id });
      } else {
        const url = `/&api&/reactions/delete/${this.state.currUserLikeId}`;
        const postBody = {
          password: this.pw,
          reactorId: this.props.loggedUserId + ''
        }
        const response = await axios.patch(url, postBody);
        this.setState({ currUserLikeId: null });
      }
    } catch (err) {
      handleNetworkErrors (err);
    }
  }

  handleShowClick = () => {
    this.setState((prevState, props) => {
      return { areCommentsVisible: !this.state.areCommentsVisible }
    });
  }

  render() {

    const {
      username,
      avatar_url,
      image_url,
      title,
      caption,
      hashtags,
      time_created
    } = this.props;
    const { comments, currUserLikeId, areCommentsVisible } = this.state;

    const didCurrUserReactStyle = currUserLikeId
      ? { boxShadow: "0px 2px 5px #6bb7c3" }
      : { boxShadow: "none" };
    const showCommsBtnStyle = areCommentsVisible
      ? { boxShadow: "0px 2px 5px #f310c2" }
      : { boxShadow: "none" };

    const commentsList = comments.map(comment => {
        return (
          <CommentCard 
            key={this.props.postId + comment.username + comment.comment_id} 
            commentId={comment.comment_id} 
            avatar={comment.avatar_url} 
            username={comment.username} 
            comment={comment.comment_body} 
            timestamp={comment.time_created} 
            userId={Number(this.uId)} 
            commenterId={comment.commenter_id} 
            // postId={this.props.postId} 
            reloadComments={this.getCommentsAndReactions} 
          />
        );
    })

    return(
      <li className="j-post-card">
        <div className="j-post-userbox">
          <Link to={`/${username}/persona`}>
            <h6 className="j-post-username j-shadow">{username}</h6>
            <img className="j-post-avatar j-shadow" src={avatar_url} alt="Avatar" />
          </Link>
        </div>

        <div className="j-post-grid" style={this.props.gridStyle}>

          <div className="j-reaction-hold">
            <div className="j-reaction-icon-btn" style={didCurrUserReactStyle} onClick={this.handleLikeClick}>
              <img src={iconLike} className="j-reaction-icon j-like-img" alt="likes" />
              <div className="j-reaction-num">
                {this.state.reactions.length}
              </div>
            </div>
            <div className="j-reaction-icon-btn j-comm-btn" style={showCommsBtnStyle} onClick={this.handleShowClick}>
              <img src={iconComment} className="j-reaction-icon" alt="comments" />
              <div className="j-reaction-num">
                {this.state.comments.length}
              </div>
            </div>
          </div>
          <div className="j-post-image-box">
            <img className="j-post-image j-shadow" src={image_url} style={this.props.imgStyle} alt="Post" />
          </div>
          <div className="j-post-banner-box">
            <h3 className="j-post-title">{title}</h3>
          </div>
          <p className="j-post-caption">{caption}</p>
        </div>

        <div className="j-post-hashtags-box">
          <div className="j-post-hr" />
          <div className="j-hash-date-line">
            <div className="j-post-hashtags">
              {hashtags}
            </div>
            <p className="j-post-date">{time_created}</p>
          </div>
        </div>

        {/* // <button 
        //   className="j-post-show-comments-btn" 
        //   style={showButtonStyle} 
        //   onClick={this.handleShowClick}
        // >Show Comments</button> */}

        <div className="j-post-comments-box" style={{ display: areCommentsVisible ? "block" : "none" }}>
          <div className="j-post-hr" style={{ display: areCommentsVisible ? "block" : "none" }} />
          {commentsList}
        </div>
      </li>
    );
  }
}
