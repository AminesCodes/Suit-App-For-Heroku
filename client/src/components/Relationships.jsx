import React from 'react'
import FollowCard from './FollowerCard'
import axios from 'axios'

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const handleNetworkErrors = err => {
    if (err.response) {
        if (err.response.data.message) {
            toast.error(err.response.data.message,
                { position: toast.POSITION.TOP_CENTER });
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

export default class PersonalPosts extends React.PureComponent {
    state = {
        followers: [],
        following: [],
    }

    getRelations = async (userId) => {
        try {
            const promises = []
            promises.push(axios.get(`/&api&/follows/${userId}`)) // Following
            promises.push(axios.get(`/&api&/follows/followers/${userId}`)) //     Followers

            const response = await Promise.all(promises)
            const following = response[0].data.payload
            const followers = response[1].data.payload
            const followingMap = {}
            for (let follow of following) {
                followingMap[follow.follow] = true
                follow.activeBtn = ''
            }
            for (let follow of followers) {
                if (followingMap[follow.follower]) {
                    follow.activeBtn = 'disabled'
                } else {
                    follow.activeBtn = ''
                }
            }
            this.setState({
                following: following,
                followers: followers,
            })
        } catch (err) {
            handleNetworkErrors(err)
        }
    }

    async componentDidMount() {
        this.props.handleTabSelection(4)
        await this.getRelations(this.props.userId)
    }


    handleUnfollowButton = async (targetId) => {
        try {
            const password = sessionStorage.getItem('Suit_App_KS')
            const userId = this.props.userId

            const {data} = await axios.patch(`/&api&/follows/delete/${userId}/${targetId}`, {password: password})
            if (data.status === 'success') {
                this.getRelations(userId)
            }
        } catch (err) {
            handleNetworkErrors(err)
        }
    }

    handleFollowButton = async (targetId) => {
        try {
            const password = sessionStorage.getItem('Suit_App_KS')
            const userId = this.props.userId

            const {data} = await axios.post(`/&api&/follows/add/${userId}/${targetId}`, {password: password})
            if (data.status === 'success') {
                this.getRelations(userId)
            }
        } catch (err) {
            handleNetworkErrors(err)
        }
    }
    
    // ##################### RENDER ######################
    render() {
        return (
            <div className={`d-md-flex justify-content-center mb-3 tab-pane ${this.props.active}`}>
                <div className='container-sm border border-dark rounded m-2 align-self-start'>
                    <strong>Following <span className='badge badge-light'>{this.state.following.length}</span></strong> 
                    {this.state.following.map(follow => <FollowCard username={follow.follow} userId={follow.followed_user_id} avatar={follow.avatar_url} active={follow.activeBtn} key={follow.avatar_url+follow.follow} btn='Unfollow' buttonClick={this.handleUnfollowButton}/>)}
                </div>
                
                <div className='container-sm border border-dark rounded m-2 align-self-start'>
                    <strong>Followers <span className='badge badge-light'>{this.state.followers.length}</span></strong> 
                    {this.state.followers.map(follow => <FollowCard username={follow.follower} userId={follow.follower_id} avatar={follow.avatar_url} active={follow.activeBtn} key={follow.avatar_url+follow.follower} btn='Follow' buttonClick={this.handleFollowButton}/>)}
                </div>
            </div>
        )
    }
}