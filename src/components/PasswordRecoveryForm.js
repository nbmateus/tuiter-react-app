import React from 'react'
import axios from 'axios'

class PasswordRecoveryForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            message: null,
            newPassword: "",
            confirmNewPassword: ""
        }
    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.setState({
            message: "loading"
        })
        axios.post('https://nbmateus.pythonanywhere.com/accounts/password-reset/confirm/' + this.props.match.params.uid + '/' + this.props.match.params.token + '/', {
            uid: this.props.match.params.uid,
            token: this.props.match.params.token,
            new_password1: this.state.newPassword,
            new_password2: this.state.confirmNewPassword
        })
            .then(response => {
                this.setState({
                    message: "New password has been set!",
                    newPassword: "",
                    confirmNewPassword: "",

                })
            })
            .catch(error => {
                if (error.response.data.new_password2) {
                    this.setState({
                        message: error.response.data.new_password2,
                        newPassword: "",
                        confirmNewPassword: "",
                    })
                } else if (error.response.data.uid || error.response.data.token) {
                    this.setState({
                        message: "Invalid URL",
                        newPassword: "",
                        confirmNewPassword: "",
                    })
                }
            })
    }

    render() {

        var messageElement = <div></div>
        if (this.state.message !== null) {
            if (this.state.message === "loading") {
                messageElement = (
                    <div className="progress">
                        <div className="indeterminate"></div>
                    </div>
                )
            } else if (this.state.message === "New password has been set!") {
                messageElement = (
                    <div>
                        <h6 className="green-text center">{this.state.message}</h6 >
                        <br />
                    </div >
                )
            } else {
                messageElement = (
                    <div>
                        <h6 className="red-text center">{this.state.message}</h6 >
                        <br />
                    </div >
                )
            }
        }

        return (
            <div className="card-panel" >
                <span className="black-text">
                    <h5 className="center">Confirm Password Reset</h5>
                    <form onSubmit={this.handleSubmit}>
                        <div className="input-field col s6">
                            <input id="newPassword" type="password" className="validate" onChange={this.handleChange} required />
                            <label htmlFor="newPassword">New Password</label>
                        </div>
                        <div className="input-field col s6">
                            <input id="confirmNewPassword" type="password" className="validate" onChange={this.handleChange} required />
                            <label htmlFor="confirmNewPassword">Confirm New Password</label>
                        </div>
                        <br />
                        {messageElement}
                        <button className="waves-effect waves-light btn-small" style={{ width: "100%" }}>Set New Password</button>
                    </form>
                </span>
            </div>
        )
    }
}

export default PasswordRecoveryForm;