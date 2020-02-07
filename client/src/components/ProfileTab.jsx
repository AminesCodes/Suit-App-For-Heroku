import React from 'react';
import Avatar from './Avatar';
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

export default class ProfileTab extends React.PureComponent {
    state = {
        followers: [],
        following: [],
    }

    async componentDidMount() {
        this.props.handleTabSelection(1)
        try {
            const promises = []
            promises.push(axios.get(`/&api&/follows/${this.props.userId}`)) // Followers
            promises.push(axios.get(`/&api&/follows/followers/${this.props.userId}`)) //     Following

            const response = await Promise.all(promises)
            this.setState({
                followers: response[0].data.payload,
                following: response[1].data.payload,
            })
        } catch (err) {
            handleNetworkErrors(err)
        }
    }
    
    // ##################### RENDER ######################
    render() {
        return (
            <div className={`tab-pane fade show ${this.props.active}`}>
                <div className='d-sm-flex justify-content-between col-sm-12'>
                    <Avatar avatar={this.props.avatar} className='d-lg-block'/>
                    <p className='d-lg-block'>Followers:<span className="badge badge-light"> {this.state.followers.length}</span></p>
                    <p className='d-lg-block'>Following:<span className="badge badge-light"> {this.state.following.length}</span></p>
                </div>
                <form className='form-row was-validated' onSubmit={this.props.handleFormSubmit}>
                    <div className='form-group col-sm-6'>
                        <label htmlFor='email'>Email address: </label>
                        <input 
                            className='form-control' 
                            id='email' 
                            type='email' 
                            name='email'
                            value={this.props.email} 
                            onChange={this.props.handleInputField} 
                            required />
                    </div>
                    <div className='form-group col-sm-6'>
                        <label htmlFor='username'>Username: </label>
                        <input 
                            className='form-control' 
                            id='username' 
                            type='text' 
                            name='username'
                            value={this.props.username} 
                            onChange={this.props.handleInputField} 
                            required />
                    </div>
                    <div className='form-group col-sm-6'>
                        <label htmlFor='firstname'>First name: </label>
                        <input 
                            className='form-control' 
                            id='firstname' 
                            type='text' 
                            name='firstName'
                            value={this.props.firstName} 
                            onChange={this.props.handleInputField} 
                            required />
                    </div>
                    <div className='form-group col-sm-6'>
                        <label htmlFor='lastname'>Last name: </label>
                        <input 
                            className='form-control' 
                            id='lastname' 
                            type='text' 
                            name='lastName'
                            value={this.props.lastName} 
                            onChange={this.props.handleInputField} 
                            required />
                    </div>
                    <div className='form-group col-sm-6'>
                        <label htmlFor='avatarUpload'>Avatar</label>
                        <input 
                            className='form-control' 
                            id='avatarUpload' 
                            type='file' 
                            accept='image/*' 
                            onInput={this.props.handleFileInput} 
                            onChange={e => e.target.value=null} />
                    </div>
                    <div className='form-group col-sm-6'>
                        <label htmlFor='password'>Password to allow changes: </label>
                        <input 
                            className='form-control' 
                            id='password' 
                            type='password' 
                            name='password'
                            autoComplete='off' 
                            value={this.props.password} 
                            onChange={this.props.handleInputField} 
                            required />
                    </div>
                    <div className='form-group col-sm-12'>
                        <label htmlFor='bio'>Bio: </label>
                        <textarea 
                            className='form-control' 
                            id='bio' 
                            rows='5' 
                            name='bio'
                            value={this.props.bio} 
                            onChange={this.props.handleInputField} />
                    </div>
                    <div className='d-sm-flex justify-content-between col-sm-12'>
                        <p className='d-lg-block'>User since: {this.props.joiningDate}</p>
                        <button className='btn btn-primary d-lg-block'>Update Information</button>
                    </div>
                </form>
                <button className='btn btn-danger d-lg-block' onClick={this.props.handleDeleteAccount}>Delete Account</button>
            </div>
        )
    }

    
}