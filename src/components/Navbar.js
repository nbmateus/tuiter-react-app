import React from 'react';
import 'materialize-css/dist/css/materialize.css';
import M from 'materialize-css/dist/js/materialize';
import { NavLink } from 'react-router-dom'


class Navbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
        //M.Sidenav.init(document.querySelector('#idSidenav'), {});
        M.AutoInit();
    }

    render() {
        var navButtons = this.props.loggedIn ? (
            <div>
                <li>
                    <NavLink to={"/profile/" + this.props.currentUsername + "/"}>
                        <i className="material-icons left">account_circle</i>
                        {this.props.currentUsername}
                    </NavLink>
                </li>
                <li><NavLink to="/" onClick={this.props.appHandleLogOut}>Log Out</NavLink></li>
            </div>
        ) : (
                <div>
                    <li><NavLink to="/login">Log In</NavLink ></li >
                    <li><NavLink to="/signup">Sign Up</NavLink></li>
                </div >
            );


        return (
            <div>
                <div className="navbar-fixed">
                    <nav>
                        <div className="nav-wrapper indigo">
                            <div className="container">
                                <ul className="left">
                                    <NavLink to="/" className="brand-logo" >LOGO</NavLink>
                                </ul>
                                <a className="sidenav-trigger hide-on-larg" data-target="idSidenav">
                                    <i className="material-icons">menu</i>
                                </a>
                                <ul className="right hide-on-med-and-down">
                                    {navButtons}
                                </ul>
                            </div>
                        </div>
                    </nav>
                </div>
                <ul className="sidenav" id="idSidenav">
                    {navButtons}
                </ul>
            </div>
        )
    }
}

export default Navbar;