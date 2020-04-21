import React from 'react';

class SignUp extends React.Component {
    
    handleSubmit = (e) => {
        e.preventDefault();
        console.log("me registre")
    }

    render() {

        return (
            <div className="container">
                <div className="card-panel grey lighten-4">
                    <span className="black-text">
                        <form onSubmit={this.handleSubmit}>
                            <input id="idRegUsername" type="text" className="validate" />
                            <label htmlFor="idRegUsername">Username</label>
                            <input id="idRegEmail" type="email" className="validate" />
                            <label htmlFor="idRegEmail">Email</label>
                            <input id="idRegPass1" type="password" className="validate" />
                            <label htmlFor="idRegPass1">Password</label>
                            <input id="idRegPass2" type="password" className="validate" />
                            <label htmlFor="idRegPass2">Confirm Password</label>
                            <br />
                            <br />
                            <button className="waves-effect waves-light btn-small">Sign Up</button>
                        </form>
                    </span>
                </div>
            </div>

        )
    }
}

export default SignUp;