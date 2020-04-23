import React from 'react';
import {Link} from 'react-router-dom';

class EmailVerification extends React.Component{

    render(){
        return(
            <div className="card blue-grey container darken-1">
                <div className="card-content white-text center">
                    <span className="card-title">CHECK YOUR EMAIL</span>
                    <p>We sent you an email to verify your account.</p>
                </div>
                <div className="card-action">
                    <Link to="/">Home</Link>
                </div>
            </div>
        )
    }
}

export default EmailVerification;