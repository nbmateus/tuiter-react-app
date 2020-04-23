import React from 'react';
import { Link } from 'react-router-dom'
//import axios from 'axios';
class ActivateAccount extends React.Component {

    render() {
        return (
            <div className="card blue-grey container darken-1">
                <div className="card-content white-text center">
                    <span className="card-title">ACCOUNT ACTIVATED!</span>
                    <p>Your account was successfully activated!</p>
                </div>
                <div className="card-action">
                    <Link to="/">Home</Link>
                    <Link to="/login">Log In</Link>
                </div>
            </div>
        )
    }
}

export default ActivateAccount;