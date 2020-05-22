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
            signUpSuccess: false,
        }
    }

    componentDidMount(){
        window.scrollTo(0, 0)
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.setState({
            formError: "loading"
        })
        axios.post('https://nbmateus.pythonanywhere.com/accounts/registration/', {
            username: this.state.username,
            email: this.state.email,
            password1: this.state.password1,
            password2: this.state.password2
        })
            .then(response => {
                this.setState({
                    signUpSuccess: true,
                })

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
                    formError = error.response.statusText
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
        var errorElement = <br />
        if (this.state.formError !== "") {
            errorElement = this.state.formError === "loading" ? (
                <div>
                    <div className="progress">
                        <div className="indeterminate"></div>
                    </div>
                    <br />
                </div>
            ) : (
                    <div>
                        <h6 className="red-text">{this.state.formError}</h6 >
                        <br />
                    </div >
                )
        }


        var signUpView = this.state.signUpSuccess ? (
            <div className="card-panel grey darken-3 ">
                <span className="white-text">
                    <h5 className="center">Check your email!</h5>
                    <h6 className="center">An email has been sent to <b>{this.state.email}</b> to activate your account.</h6>
                </span>
            </div>
        ) : (
                <div className="card-panel">
                    <span className="black-text">
                        <h5 className="center">Sign Up</h5>
                        <form onSubmit={this.handleSubmit}>
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
                            {errorElement}
                            <button className="waves-effect waves-light btn-small" style={{ width: "100%" }}>Sign Up</button>
                        </form>
                    </span>
                </div>
            )

        return signUpView
    }
}

export default SignUp;