import React from 'react';
import axios from 'axios';

class SignUp extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            username: "",
            email: "",
            password1: "",
            password2: "",
            formError: "",
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://nbmateus.pythonanywhere.com/accounts/registration/', {
            username: this.state.username,
            email: this.state.email,
            password1: this.state.password1,
            password2: this.state.password2
        })
            .then(response => {
                this.props.history.push('/registration-complete')

            })
            .catch(error => {
                var errors = error.response.data;
                var formError = '';
                if (errors.username) {
                    formError = "The username already exists or contains characteres that aren't allowed.";
                } else if (errors.email) {
                    formError = "The email address is not valid or a user is already registered with this email address.";
                } else if (errors.password1) {
                    formError = "The password is too common or too short. It must contain at least 8 characters."
                } else if (errors.non_field_errors) {
                    formError = "Passwords don't match."
                } else {
                    formError = 'idk what is going on, lol'
                }
                this.setState({
                    formError: formError
                })


            })
    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        });
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
                <div className="card-panel grey lighten-4">
                    <span className="black-text">
                        <form onSubmit={this.handleSubmit}>
                            {error}
                            <div className="input-field col s6">
                                <input id="username" type="text" className="validate" onChange={this.handleChange} required />
                                <label htmlFor="username">Username</label>
                            </div>
                            <div className="input-field col s6">
                                <input id="email" type="email" className="validate" onChange={this.handleChange} required />
                                <label htmlFor="email">Email</label>
                            </div>
                            <div className="input-field col s6">
                                <input id="password1" type="password" className="validate" onChange={this.handleChange} required />
                                <label htmlFor="password1">Password</label>
                            </div>
                            <div className="input-field col s6">
                                <input id="password2" type="password" className="validate" onChange={this.handleChange} required />
                                <label htmlFor="password2">Confirm Password</label>
                            </div>
                            <br />
                            <br />
                            <button className="waves-effect waves-light btn-small">Sign Up</button>
                        </form>
                    </span>
                </div>
        )
    }
}

export default SignUp;