import React from 'react'
import axios from 'axios'

class PasswordRecoveryEmail extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            email: "",
            message: null,
        }
    }

    handleChange = (e) => {
        this.setState({
            email: e.target.value
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.setState({
            message: "loading"
        })
        axios.post('https://nbmateus.pythonanywhere.com/accounts/password/reset/', {
            email: this.state.email
        })
            .then(response => {
                this.setState({
                    email: "",
                    message: "An email has been sent to " + this.state.email
                })
            })
            .catch(error => {
            })
    }

    render() {

        var messageElement = <div></div>
        if (this.state.message !== null) {
            messageElement = this.state.message === "loading" ? (
                <div className="progress">
                    <div className="indeterminate"></div>
                </div>
            ) : (
                    <div>
                        <h6 className="green-text center">{this.state.message}</h6>
                        <br />
                    </div>
                )
        }

        return (
            <div className="card-panel">
                <span className="black-text">
                <h5 className="center">Password Recovery</h5>
                    <form onSubmit={this.handleSubmit}>
                        <div className="input-field col s6">
                            <input id="email" type="email" className="validate" value={this.state.email} onChange={this.handleChange} required />
                            <label htmlFor="email">Email</label>
                        </div>
                        <br />
                        {messageElement}
                        <button className="waves-effect waves-light btn-small" style={{ width: "100%" }}>Recover Password</button>
                    </form>
                </span>
            </div>
        )
    }
}

export default PasswordRecoveryEmail;