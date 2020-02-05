import React from 'react'

export default class PasswordTab extends React.PureComponent {
    componentDidMount() {
        this.props.handleTabSelection(2)
    }
    
    // ##################### RENDER ######################
    render() {
        return (
            <div className={`tab-pane fade show ${this.props.active}`}>
                <form className='form-row was-validated' onSubmit={e => this.props.handlePasswordForm(e)}>
                    <div className='form-group col-sm-12'>
                        <label htmlFor='oldPassword'>Old Password: </label>
                        <input className='form-control' id='oldPassword' type='password' autoComplete='off' value={this.props.oldPassword} onChange={e => this.props.handleOldPasswordInput(e)} required></input>
                    </div>
                    <div className='form-group col-sm-6'>
                        <label htmlFor='newPassword'>New Password: </label>
                        <input className='form-control' id='newPassword' type='password' autoComplete='off' value={this.props.newPassword} onChange={e => this.props.handleNewPasswordInput(e)} required></input>
                    </div>
                    <div className='form-group col-sm-6'>
                        <label htmlFor='newPasswordConfirmation'>Confirm Password: </label>
                        <input className='form-control' id='newPasswordConfirmation' type='password' autoComplete='off' value={this.props.newPasswordConfirmation} onChange={e => this.props.handleNewPasswordConfirmInput(e)} required></input>
                    </div>
                    <div className='d-sm-flex justify-content-between col-sm-12'>
                        <button className='d-lg-block'>Update Information</button>
                    </div>
                </form>
            </div>
        )
    }
}