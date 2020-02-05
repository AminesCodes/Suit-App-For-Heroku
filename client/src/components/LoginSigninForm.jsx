import React from 'react';
import axios from 'axios';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './LoginSigninForm.css';


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
        toast.error('Sorry, an error occured, try again later', 
            { position: toast.POSITION.TOP_CENTER });
        console.log('Error', err);
    }
}


export default class LoginSigninFrom extends React.PureComponent {
    state = {
        email: '',
        password: '',
        username: '',
        firstName: '',
        lastName: '',
        ageCheck: false,
        formFunctionality: ['Login', 'New user? ', 'Sign-in'],
        loading: false,
    }

    handleFormSubmit = async (event) => {
        event.preventDefault()

        if (this.state.formFunctionality[0] === 'Login') {
            const user = {
                email: this.state.email,
                password: this.state.password
            }
            try {
                this.setState({loading: true})
                const { data } = await axios.patch('/&api&/users/login', user)

                this.setState({ loading: false })
                this.props.formSubmit(data.payload, this.state.password)
            } catch (err) {
                this.setState({loading: false})
                handleNetworkErrors(err)
            }
        } else if (this.state.formFunctionality[0] === 'Sign-in') {
            const user = { 
                username: this.state.username, 
                firstname: this.state.firstName, 
                lastname: this.state.lastName,
                password: this.state.password, 
                email: this.state.email
            }
            if (this.state.ageCheck) {
                user.ageCheck = 'true'
            }
            try {
                this.setState({loading: true})
                const { data } = await axios.post('/&api&/users/signup', user)

                this.setState({ loading: false })
                this.props.formSubmit(data.payload, this.state.password)
            } catch (err) {
                this.setState({loading: false})
                handleNetworkErrors(err)
            }
        }
    }

    handleUsernameInput = event => {
        this.setState({username: event.target.value})
    }


    handleFirstNameInput = event => {
        this.setState({firstName: event.target.value})
    }
    
    handleLastNameInput = event => {
        this.setState({lastName: event.target.value})
    }
    
    handleDobInput = event => {
        this.setState({dob: event.target.value})
    }
    
    handleEmailInput = event => {
        this.setState({email: event.target.value})
    }

    handlePasswordInput = event => {
        this.setState({password: event.target.value})
    }

    handleSigninBtn = () => {
        if (this.state.formFunctionality[0] === 'Login'){
            this.setState({formFunctionality: ['Sign-in', 'Already a user? ', 'Login']})
        } else if (this.state.formFunctionality[0] === 'Sign-in') {
            this.setState({formFunctionality: ['Login', 'New user? ', 'Sign-in']})
        }

    }

    handleAgeCheck = () => {
        const status = this.state.ageCheck;
        this.setState({ageCheck: !status})
    }


    //################# RENDER ################
    render() {
        let spinner = null;
        if (this.state.loading) {
            spinner = <div className='spinner-border d-sm-block' role='status'>
            <span className='sr-only'>Loading...</span>
          </div>
        }

        let signinFields = null;
        if (this.state.formFunctionality[0] === 'Sign-in') {
            signinFields = <>
                <div className='j-form-group form-group col-md-6'>
                    <input className='j-form-control form-control' id='username' type='text' value={this.state.username} onChange={this.handleUsernameInput} required></input>
                    <label className='ph-area' htmlFor='username'>Username: </label>
                </div>
                <div className='j-form-group form-group col-md-6'>
                    <input className='j-form-control form-control' id='firstname' type='text' value={this.state.firstName} onChange={this.handleFirstNameInput} required></input>
                    <label className='ph-area' htmlFor='firstname'>First name: </label>
                </div>
                <div className='j-form-group form-group col-md-6'>
                    <input className='j-form-control form-control' id='lastname' type='text' value={this.state.lastName} onChange={this.handleLastNameInput} required></input>
                    <label className='ph-area' htmlFor='lastname'>Last name: </label>
                </div>
                <div className='j-form-group form-group col-md-6'>
                    <input className='j-form-check-input form-check-input' id='defaultCheck' type='checkbox' checked={this.state.ageCheck} onChange={this.handleAgeCheck}/>
                    <label className='j-form-check-label form-check-label' htmlFor='defaultCheck'>I confirm that I am 13 years old or older.</label>
                </div>
            </>
        }
        return(
            <form className='j-was-validated was-validated row' onSubmit={this.handleFormSubmit} >
                <div className='j-form-group form-group col-md-6'>
                    <input className='j-form-control form-control' id='email' type='email' value={this.state.email} onChange={this.handleEmailInput} required></input>
        <label className='ph-area' htmlFor='email'>Email address: </label>
                </div>
                <div className='j-form-group form-group col-md-6'>
                    <input className='j-form-control form-control' id='password' type='password' autoComplete='off' value={this.state.password} onChange={this.handlePasswordInput} required></input>
                    <label className='ph-area' htmlFor='password'>Password: </label>
                </div>
                {signinFields}
                <div className='j-d-sm-flex d-sm-flex justify-content-between col-md-12'>
                    <button className='d-sm-block'>{this.state.formFunctionality[0]}</button>
                    {spinner}
                    <button className='d-sm-block btn btn-link' onClick={this.handleSigninBtn}>{this.state.formFunctionality[1]}<strong>{this.state.formFunctionality[2]}</strong></button>
                </div>
            </form>
        )
    }
}