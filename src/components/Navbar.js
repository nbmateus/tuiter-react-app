import React from 'react';
import 'materialize-css/dist/css/materialize.css';
import { NavLink } from 'react-router-dom'
import Cookies from 'js-cookie';
import axios from 'axios';


class Navbar extends React.Component {
    constructor(props){
        super(props);
        this.state = {}
    }
    
    render() {

        var navButtons = this.props.loggedIn ? (
            <div>
                <li><NavLink to="" onClick={this.props.appHandleLogOut} >Log Out</NavLink></li>
            </div>

        ):(
            <div>
                <li><NavLink to = "/login">Log In</NavLink ></li >
                <li><NavLink to="/signup">Sign Up</NavLink></li>
            </div >
        );

        return (
            <nav>
                <div className="nav-wrapper indigo">
                    <div className="container">
                        <ul className="left">
                            <NavLink to="/" className="brand-logo" >LOGO</NavLink>
                        </ul>

                        <ul className="center">
                            <div className="container">
                                <li>
                                    <form>
                                        <div className="input-field" >
                                            <input id="search" type="search" />
                                            <label className="label-icon" htmlFor="search"><i className="material-icons">search</i></label>
                                            <i className="material-icons">close</i>
                                        </div>
                                    </form>
                                </li>
                            </div>
                        </ul>

                        <ul className="right hide-on-med-and-down">
                            {navButtons}
                        </ul>
                    </div>
                </div>
            </nav>
        )
    }
}

export default Navbar;