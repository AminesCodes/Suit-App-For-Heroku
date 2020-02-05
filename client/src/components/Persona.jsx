/*
Persona Component | Client | SUITAPP Web App
GROUP 1: Amine Bensalem, Douglas MacKrell, Savita Madray, Joseph P. Pasaoa
*/


import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import axios from 'axios'

// import './Persona.css';

import PersonalPosts from './PersonalPosts'
import Avatar from './Avatar'


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

export default class Persona extends Component {
  state = {
    userId: 0,
    username: '',
    avatar: '',
    bio: '',
    isUserFollowing: false,
    followers: [],
    newPost: null,
    title: '',
    caption: '',
  }

  getUserInfo = async (url) => {
    try {
      const targetUser = url.split('/')[1]
      const {data} = await axios.get(`/&api&/users/${targetUser}`)  //GET THE USER INFO
      this.setState({
        userId: data.payload.id,
        username: data.payload.username,
        avatar: data.payload.avatar_url,
        bio: data.payload.bio,
      })

      const promises = []
      promises.push(axios.get(`/&api&/follows/followers/${data.payload.id}`))
      
      const currentUserId = sessionStorage.getItem('Suit_App_UId')
      const currentUsername = sessionStorage.getItem('Suit_App_Un')
      promises.push(axios.get(`/&api&/follows/${currentUserId}`))

      const [ allFollowersData, allCurrentUserFollowingsData ] = await Promise.all(promises)

      const allFollowers = allFollowersData.data.payload
      const randomIndexes = []
      this.getRandomFollowers(randomIndexes, 3, {}, allFollowers.length)
      const randomFollows = randomIndexes.map(num => allFollowers[num])
      
      this.setState({ followers: randomFollows })

      const allCurrentUserFollowings = allCurrentUserFollowingsData.data.payload
      let isUserFollowing = false
      for (let following of allCurrentUserFollowings) {
        console.log(following.follow, targetUser, currentUsername)
        if (following.follow === targetUser) {
          isUserFollowing = true
          break
        }
      }
      if (targetUser === currentUsername) {
        isUserFollowing = true
      }
      
      this.setState({ isUserFollowing: isUserFollowing })
    } catch (err) {
      handleNetworkErrors(err)
    }
  }

  async componentDidMount() {
    await this.getUserInfo(this.props.match.url)
  }

  async shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.match.url !== this.props.match.url) {
       this.getUserInfo(nextProps.match.url)
      return true
    }
    return false
  }

  getRandomFollowers = (arr, num, tracker, max) => {
    const randomId = Math.floor(Math.random() * max)
    if (arr.length === num) {
      return
    }
    if (tracker[randomId]) {
      this.getRandomFollowers(arr, num, tracker, max)
    } else {
      tracker[randomId] = true
      arr.push(randomId)
      this.getRandomFollowers(arr, num, tracker, max)
    }
  }

  handleFollowButton = async () => {
    const currentUserId = sessionStorage.getItem('Suit_App_UId')
    const pw = sessionStorage.getItem('Suit_App_KS')
    const targetUserId = this.state.userId

    try {
      const { data } = await axios.post(`/&api&/follows/add/${currentUserId}/${targetUserId}`, {password: pw})
      if (data.status === 'success') {
        this.setState({ isUserFollowing: true })
      }
    } catch (err) {
      handleNetworkErrors(err)
    }
  }
  
  // ################ RENDER ###########
  render() {
    const uId = sessionStorage.getItem('Suit_App_UId')
    const imgAvatar = require('../assets/images/avatars/2.png')

    let followBtn = null
    if (!this.state.isUserFollowing) {
      followBtn = <button className='btn btn-sm btn-info m-2' onClick={this.handleFollowButton}>Follow</button>
    }
    return (
      <div className='container-fluid m-3'>
        <div className='row' >
            <div className='col-sm-2'>
                <Avatar avatar={this.state.avatar}/>
            </div>
            <div className='col-sm-7'>
                {followBtn}
                <p>{this.state.bio}</p>
            </div>
            <div className='col-sm-3'>
                <div className='d-flex flex-wrap m-0 p-0'>
                  {this.state.followers.map(user => 
                    <div className='flex-fill m-0 p-0' key={user.follower+user.avatar_url}>
                      <Link to={`/${user.follower}/persona`}>
                        <img className='squareAvatar m-0 p-0' src={user.avatar_url || imgAvatar} alt='profile avatar'></img>
                      </Link>
                    </div>)}   
                </div>
            </div>
        </div>
        <PersonalPosts className='row' userId={this.state.userId} allowedToEdit={this.state.userId+'' === uId+''} active={true}/>
   </div>
    );
  }
}
