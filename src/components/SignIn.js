import React from 'react';

class SignIn extends React.Component {

    handleSubmit = (e) => {
        e.preventDefault();
        console.log("inicie sesion")
    }

    render() {

        return (
            <div className="container">
                <div className="card-panel grey lighten-4">
                    <span className="black-text">
                        <form onSubmit={this.handleSubmit}>
                            <input id="idRegUsername" type="text" className="validate" />
                            <label htmlFor="idRegUsername">Username or Email</label>
                            <input id="idRegPass1" type="password" className="validate" />
                            <label htmlFor="idRegPass1">Password</label>
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