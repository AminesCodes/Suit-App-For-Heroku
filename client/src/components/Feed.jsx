/*
Feed Container Component | Client | SUITAPP Web App
GROUP 1: Amine Bensalem, Douglas MacKrell, Savita Madray, Joseph P. Pasaoa
*/


import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// import './Feed.css';

import PostCard from './PostCard';


export default class Feed extends PureComponent {
  state = {
    posts: []
  }

  componentDidMount() {
    this.getFeed();
  }

  async componentDidUpdate(prevProps, prevState) {
    const arePathnamesSame = this.props.location.pathname === prevProps.location.pathname;
    const areSearchesSame = this.props.location.search === prevProps.location.search;
    if (!arePathnamesSame || !areSearchesSame) {
      await this.getFeed();
    }
  }

  getSearches = () => {
      let process = new URLSearchParams(this.props.location.search);
      const string = process.get("search");
      return string;
  }

  getFeed = async () => {
    let url = '/&api&/posts/';             // location parse begins at global feed
    const pathname = this.props.location.pathname;
    const searchString = this.getSearches();
    if (!pathname.includes("all")) {                      // switch to follows feed
      url += `follows/${this.props.user.id}`;
    } else if (searchString) {                            // switch to hashtags feed
      url += `tags/?hashtags=${searchString}`;
    }
    const response = await axios.get(url);
    const postsArray = response.data.payload;
    this.setState((prevState, props) => {
        return {posts: postsArray}
    });
  }

  // ############## RENDER ################
  render() {
    const postsList = this.state.posts.map(post => {

        // CREATE HASHTAGS COMPONENTS
        let hashtags = [];
        if (post.hashtag_str) {
          let tagData = post.hashtag_str;
          hashtags = tagData.split('#');
          hashtags = hashtags.filter(el => !!el).map((tag, index) => {
              return (
                <Link 
                  key={post.id + tag + `-i${index}`} 
                  to={`/${this.props.currUsername}/feed/all?search=${tag}`} 
                  className="j-post-hashtag-link" 
                >
                  {'#' + tag}
                </Link>
              );
          });
        }

        // CREATE DYNAMIC POST WIDTH ON EMPTY TEXTS PROP
        const calcedImgStyle = { marginRight: (!post.title && !post.caption) ? "auto" : false };
        const calcedGridStyle = { gridTemplateColumns: (!post.title && !post.caption) ? "190px min-content" : "373px min-content" };

        // FORMAT TIMESTAMP PROP
        const timestamp = new Date(post.time_created);

        return(
            <PostCard
              key={post.id} 
              currUsername={this.props.currUsername} 
              postId={post.id} 
              username={post.username} 
              avatar_url={post.avatar_url} 
              image_url={post.image_url} 
              title={post.title} 
              caption={post.caption} 
              hashtags={hashtags} 
              time_created={timestamp.toLocaleString()} 

              imgStyle={calcedImgStyle} 
              gridStyle={calcedGridStyle} 

              handleClickHashtag={this.handleClickHashtag} 
            />
        );
    });

    return (
      <>
        {postsList}
      </>
    )
  }
}
