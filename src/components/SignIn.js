import React from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';


class SignIn extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            formUsername: '',
            formPassword: '',
            formError: '',
        };
    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const data = this.state.formUsername.includes('@') ? (
            { email: this.state.formUsername, password: this.state.formPassword }
        ) : (
                { username: this.state.formUsername, password: this.state.formPassword }
            )

        axios.post('http://nbmateus.pythonanywhere.com/accounts/login/', data)
            .then(response => {
                Cookies.set('authtoken', "Token " + response.data.key);
                this.props.handleLogIn();
                this.props.history.push('/');

            })
            .catch(error => {
                if (error.response.data.non_field_errors) {
                    this.setState({
                        formError: error.response.data.non_field_errors
                    })
                }

            })

    }

    render() {

        const error = this.state.formError.length ? (
            <ul className="collection container">
                <a href="#!" className="collection-item active red lighten-2 center">{this.state.formError}</a>
            </ul>
        ) : (
                <br />
            )

        return (
            <div className="container">
                <div className="card-panel grey lighten-4">
                    <span className="black-text">
                        <form onSubmit={this.handleSubmit}>
                            {error}
                            <div className="input-field col s6">
                                <input id="formUsername" type="text" className="validate" onChange={this.handleChange} required />
                                <label htmlFor="formUsername">Username or Email</label>
                            </div>
                            <div className="input-field col s6">
                                <input id="formPassword" type="password" className="validate" onChange={this.handleChange} required />
                                <label htmlFor="formPassword">Password</label>
                            </div>
                            <br />
                            <br />
                            <button className="waves-effect waves-light btn-small">Log In</button>
                        </form>
                    </span>
                </div>
            </div>
        )
    }
}

export default SignIn;