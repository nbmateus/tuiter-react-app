import React from 'react';
import { Link } from 'react-router-dom'

class ActivateAccount extends React.Component {

    render() {
        return (
            <div className="card-panel grey darken-3 ">
                <span className="white-text">
                    <h5 className="center">Account Activated!</h5>
                    <h6 className="center">Your account was successfully activated!</h6>
                    <br/>
                    <div className="row center">
                        <div className="col s6">
                            <Link to="/login"><button className="waves-effect waves-light btn-small">Log In</button></Link>
                        </div>
                        <div className="col s6">
                        <Link to="/"><button className="waves-effect waves-light btn-small">Home</button></Link>
                        </div>
                    </div>
                </span>
            </div>
        )
    }
}

export default ActivateAccount;