import React from 'react'
import { Link, Route, Switch } from 'react-router-dom';
import axios from 'axios'


import ProfileTab from './ProfileTab'
import PasswordTab from './PasswordTab'
import PersonalPosts from './PersonalPosts'
import Relationships from './Relationships'

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

export default class Account extends React.PureComponent {
    state = {
        id: this.props.user.id,
        username: this.props.user.username,
        firstName: this.props.user.firstname,
        lastName: this.props.user.lastname,
        email: this.props.user.email,
        avatar: this.props.user.avatar_url,
        avatarFile: null,
        bio: this.props.user.bio,
        lightTheme: this.props.user.light_theme,
        joiningDate: this.props.user.time_created,
        password: '',
        oldPassword: '',
        newPassword: '',
        newPasswordConfirmation: '',
        waitingForData: false,
        profileTab: 'active',
        passwordTab: '',
        postsTab: '',
        followTab: '',
    }

    // async componentDidMount() {
    //     const username = this.props.match.params.username

    //     if (username !== 'undefined') {
    //         try {
    //             const { data } = await axios.get(`/&api&/users/${username}`)
    //             this.setState({
    //                 id: data.payload.id,
    //                 username: data.payload.username,
    //                 email: data.payload.email,
    //                 firstName: data.payload.firstname,
    //                 lastName: data.payload.lastname,
    //                 avatar: data.payload.avatar_url,
    //                 bio: data.payload.bio,
    //                 lightTheme: data.payload.light_theme,
    //                 joiningDate: (data.payload.time_created).slice(0, 10),
    //                 waitingForData: false
    //             })
    //         } catch (err) {
    //             this.setState({ waitingForData: false })
    //             handleNetworkErrors(err)
    //         }
    //     } else {
    //         toast.error('Login issue, please logout and login into your account again',
    //             { position: toast.POSITION.TOP_CENTER });
    //     }
    // }

    handleTabSelection = ref => {
        if (ref === 1) {
            this.setState({
                profileTab: 'active',
                passwordTab: '',
                postsTab: '',
                followTab: ''
            })
        } else if (ref === 2) {
            this.setState({
                profileTab: '',
                passwordTab: 'active',
                postsTab: '',
                followTab: ''
            })
        } else if (ref === 3) {
            this.setState({
                profileTab: '',
                passwordTab: '',
                postsTab: 'active',
                followTab: ''
            })
        } else if (ref === 4) {
            this.setState({
                profileTab: '',
                passwordTab: '',
                postsTab: '',
                followTab: 'active'
            })
        }
    }

    handleFormSubmit = async (event) => {
        event.preventDefault()
        const {id, username, firstName, lastName, email, password, bio} = this.state
        
        if (id && username && firstName && lastName && email && password) {
            try {
                this.setState({ waitingForData: true })
                const userInfo = new FormData();
                
                userInfo.append('username', username)
                userInfo.append('firstname', firstName)
                userInfo.append('lastname', lastName)
                userInfo.append('password', password)
                userInfo.append('email', email)
                if (bio) {
                    userInfo.append('bio', bio)
                }
                if (this.state.avatarFile) {
                    userInfo.append('avatar', this.state.avatarFile)
                }

                const { data } = await axios.put(`/&api&/users/${id}`, userInfo)
                this.setState({
                    username: data.payload.username,
                    firstName: data.payload.firstname,
                    lastName: data.payload.lastname,
                    email: data.payload.email,
                    avatar: data.payload.avatar_url,
                    bio: data.payload.bio,
                    password: '',
                    waitingForData: false,
                })
                this.props.updateUser(data.payload)

                toast.success('Updated information successfully',
                    { position: toast.POSITION.BOTTOM_CENTER });

            } catch (err) {
                this.setState({ waitingForData: false })
                handleNetworkErrors(err)
            }
        } else {
            toast.error('Missing information, All fields with * are required',
                { position: toast.POSITION.TOP_CENTER });
        }
    }

    handlePasswordForm = async (event) => {
        event.preventDefault()
        const { id, oldPassword, newPassword, newPasswordConfirmation } = this.state

        if (oldPassword && newPassword && newPasswordConfirmation && newPassword === newPasswordConfirmation) {
            try {
                this.setState({ waitingForData: true })
                const updateData = { 
                    oldPassword: oldPassword, 
                    newPassword: newPassword, 
                    confirmedPassword: newPasswordConfirmation, 
                }

                await axios.patch(`/&api&/users/${id}/password`, updateData)
                this.setState({ 
                    waitingForData: false,
                    oldPassword: '', 
                    newPassword: '', 
                    newPasswordConfirmation: '', 
                })
                toast.success('Password updated successfully ',
                    { position: toast.POSITION.BOTTOM_CENTER });

            } catch (err) {
                this.setState({ waitingForData: false })
                handleNetworkErrors(err)
            }
        } else {
            toast.error('Missing information, All fields are required OR new password confirmation does not match',
                { position: toast.POSITION.TOP_CENTER });
        }
    }

    handleToggleTheme = async (event) => {
        // if (oldPassword && newPassword && newPasswordConfirmation && newPassword === newPasswordConfirmation) {
        //     try {
        //         const updateData = { 
        //             oldPassword: oldPassword, 
        //             newPassword: newPassword, 
        //             confirmedPassword: newPasswordConfirmation, 
        //         }

        //         const { data } = await axios.patch(`/&api&/users/${id}/password`, updateData)
        //         if (data.status === 'success') {
        //             sessionStorage.setItem('Suit_App_KS', newPassword);
        //             toast.success('Password updated successfully ',
        //             { position: toast.POSITION.BOTTOM_CENTER });

        //         } else {
        //             toast.warn('Something went wrong!!',
        //             { position: toast.POSITION.TOP_CENTER });
        //         }
        //     } catch (err) {
        //         handleNetworkErrors(err)
        //     }
        // } else {
        //     toast.error('Missing information, All fields are required OR new password confirmation does not match',
        //         { position: toast.POSITION.TOP_CENTER });
        // }
    }

    handleInputField = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }

    handleFileInput = event => {
        this.setState({avatarFile: event.target.files[0]})
    }

    handleDeleteAccount = async () => {
        if (this.state.password && this.state.id) {
            try {
                this.setState({ waitingForData: true })
                await axios.patch(`/&api&/users/${this.state.id}/delete`, {password: this.state.password})
                this.setState({ waitingForData: false })
                this.props.logout()
                
            } catch (err) {
                this.setState({ waitingForData: false })
                handleNetworkErrors(err)
            }
        } else {
            toast.error('Please enter your password to DELETE your account',
                { position: toast.POSITION.TOP_CENTER });
        }
    }


    // ############ RENDER ############
    render() {
        console.log(this.props.user)
        let content =
            <div className='spinner-border m-5' role='status'>
                <span className='sr-only  text-center'>Loading...</span>
            </div>
        if (!this.state.waitingForData) {
            content = 
            <>
                <ul className="nav nav-tabs">
                    <li className="nav-item">
                      <Link className={`nav-link ${this.state.profileTab}`} to={`${this.state.username}/account`} >Profile</Link>
                    </li>
                    <li className="nav-item">
                      <Link className={`nav-link ${this.state.passwordTab}`} to={`${this.state.username}/password`} >Update Password</Link>
                    </li>
                    <li className="nav-item">
                      <Link className={`nav-link ${this.state.postsTab}`} to={`${this.state.username}/posts`} >My Posts</Link>
                    </li>
                    <li className="nav-item">
                      <Link className={`nav-link ${this.state.followTab}`} to={`${this.state.username}/relationships`} >Follows</Link>
                    </li>
                </ul>

{/* ############ PROFILE TAB ################ */}
                <Switch>
                    <Route exact path={`/:username/account/`} render={props => (<ProfileTab 
                        active = {this.state.profileTab}
                        userId = {this.state.id}
                        handleDeleteAccount = {this.handleDeleteAccount} 
                        handleTabSelection = {this.handleTabSelection}
                        handleFormSubmit = {this.handleFormSubmit}
                        handleInputField = {this.handleInputField}
                        handleFileInput = {this.handleFileInput}
                        avatar = {this.state.avatar}
                        email = {this.state.email}
                        username = {this.state.username}
                        firstName = {this.state.firstName}
                        lastName = {this.state.lastName}
                        password = {this.state.password}
                        bio = {this.state.bio}
                        joiningDate = {this.state.joiningDate}
                        {...props} /> )}
                    />
                    <Route path={`/:username/account/password`} render={props => (<PasswordTab 
                        active = {this.state.passwordTab}
                        handleTabSelection = {this.handleTabSelection}
                        handlePasswordForm = {this.handlePasswordForm}
                        handleInputField = {this.handleInputField}
                        oldPassword = {this.state.oldPassword}
                        newPassword = {this.state.newPassword}
                        newPasswordConfirmation = {this.state.newPasswordConfirmation}
                        {...props} /> )} 
                    />
                    <Route path={`/:username/account/posts`} render={props => (<PersonalPosts
                        active = {this.state.postsTab}
                        handleTabSelection = {this.handleTabSelection}
                        userId = {this.state.id}
                        // allowedToEdit={this.state.id+'' === uId+''} // NEED TO BE REVIEWED
                        {...props} /> )} 
                    />
                    <Route path={`/:username/account/relationships`} render={props => (<Relationships
                        active = {this.state.followTab}
                        handleTabSelection = {this.handleTabSelection}
                        userId = {this.state.id}
                        {...props} /> )} 
                    />
                    {/* <Route exact component= {ErrorNotFound} /> */}
                </Switch>
            </>
                
        }

        return (
            <div className='container'>
                {content}    
            </div>
        )
    }
}