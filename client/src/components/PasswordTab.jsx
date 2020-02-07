import React from 'react'

export default class PasswordTab extends React.PureComponent {
    componentDidMount() {
        this.props.handleTabSelection(2)
    }
    
    // ##################### RENDER ######################
    render() {
        return (
            <div className={`tab-pane fade show ${this.props.active}`}>
                <form className='form-row was-validated' onSubmit={this.props.handlePasswordForm}>
                    <div className='form-group col-sm-12'>
                        <label htmlFor='oldPassword'>Old Password: </label>
                        <input 
                            className='form-control' 
                            id='oldPassword' 
                            type='password'
                            name='oldPassword' 
                            autoComplete='off' 
                            value={this.props.oldPassword} 
                            onChange={this.props.handleInputField}
                            required />
                    </div>

                    <div className='form-group col-sm-6'>
                        <label htmlFor='newPassword'>New Password: </label>
                        <input 
                            className='form-control' 
                            id='newPassword' 
                            type='password'
                            name='newPassword' 
                            autoComplete='off' 
                            value={this.props.newPassword} 
                            onChange={this.props.handleInputField}
                            required />
                    </div>

                    <div className='form-group col-sm-6'>
                        <label htmlFor='newPasswordConfirmation'>Confirm Password: </label>
                        <input 
                            className='form-control' 
                            id='newPasswordConfirmation' 
                            type='password'
                            name='newPasswordConfirmation' 
                            autoComplete='off' 
                            value={this.props.newPasswordConfirmation} 
                            onChange={this.props.handleInputField}
                            required />
                    </div>

                    <div className='d-sm-flex justify-content-between col-sm-12'>
                        <button className='d-lg-block'>Update Information</button>
                    </div>
                </form>
            </div>
        )
    }
}