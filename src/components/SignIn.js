import React from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom'


class SignIn extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            formUsername: '',
            formPassword: '',
            formError: '',
        };
    }

    componentDidMount(){
        window.scrollTo(0, 0)
    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.setState({
            formError: "loading"
        })
        const data = this.state.formUsername.includes('@') ? (
            { email: this.state.formUsername, password: this.state.formPassword }
        ) : (
                { username: this.state.formUsername, password: this.state.formPassword }
            )

        axios.post('https://nbmateus.pythonanywhere.com/accounts/login/', data)
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

        return (
            <div className="card-panel">
                <span className="black-text">
                    <h5 className="center">Log In</h5>
                    <form onSubmit={this.handleSubmit}>
                        <div className="input-field col s6">
                            <input id="formUsername" type="text" className="validate" onChange={this.handleChange} required />
                            <label htmlFor="formUsername">Username or Email</label>
                        </div>
                        <div className="input-field col s6">
                            <input id="formPassword" type="password" className="validate" onChange={this.handleChange} required />
                            <label htmlFor="formPassword">Password</label>
                        </div>
                        <div className="center">
                            <Link to="/password-recovery">Forgot Password?</Link>
                        </div>
                        <br />
                        {errorElement}
                        <button className="waves-effect waves-light btn-small" style={{ width: "100%" }}>Log In</button>
                    </form>
                </span>
            </div>
        )
    }
}

export default SignIn;