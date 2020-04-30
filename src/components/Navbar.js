import React from 'react';
import 'materialize-css/dist/css/materialize.css';
import M from 'materialize-css/dist/js/materialize';
import { NavLink } from 'react-router-dom'


class Navbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userLoggedIn: this.props.loggedIn
        }
    }

    componentDidMount() {
        /*M.Dropdown.init(document.querySelector('#idDropdownTrigger'), {
            coverTrigger: false,
        });*/
        //M.Sidenav.init(document.querySelectorAll('.sidenav'), {});
        //M.AutoInit();
    }

    componentDidUpdate() {
        M.Dropdown.init(document.querySelector('#idDropdownTrigger'), {
            coverTrigger: false,
		})
        if (this.state.userLoggedIn !== this.props.loggedIn) {
            this.setState({
                userLoggedIn: this.props.loggedIn
            })
        }
    }

    render() {
        /*var navbarBtns = this.props.loggedIn ? (
            <div>
                <li>
                    <a className="dropdown-trigger" href="#!" data-target="usernameDropdown">
                        <i className="material-icons left">account_circle</i>
                        {this.props.currentUsername}
                        <i className="material-icons right">arrow_drop_down</i>
                    </a>
                </li>
            </div>
        ) : (
                <div>
                    <li className="sidenav-close"><NavLink to="/login">Log In</NavLink ></li >
                    <li className="sidenav-close"><NavLink to="/signup">Sign Up</NavLink></li>
                </div >
            )

        var sidenavBtns = this.props.loggedIn ? (
            <div>
                <li className="sidenav-close">
                    <NavLink to={"/profile/" + this.props.currentUsername + "/"}>
                        <i className="material-icons left">account_circle</i>
                        {this.props.currentUsername}
                    </NavLink>
                </li>
                <li className="divider"></li>
                <li className="sidenav-close"><NavLink to="/" onClick={this.props.appHandleLogOut}>Log Out</NavLink></li>
            </div>
        ) : (
                <div>
                    <li className="sidenav-close"><NavLink to="/login">Log In</NavLink ></li >
                    <li className="sidenav-close"><NavLink to="/signup">Sign Up</NavLink></li>
                </div >
            );


        return (
            <div>
                <div className="navbar-fixed">
                    <ul id="usernameDropdown" className="dropdown-content">
                        <li><NavLink to={"/profile/" + this.props.currentUsername + "/"}>My Profile</NavLink></li>
                        <li><NavLink to="/" onClick={this.props.appHandleLogOut}>Log Out</NavLink></li>
                    </ul>
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
                                    {navbarBtns}
                                </ul>
                            </div>
                        </div>
                    </nav>
                </div>
                <ul className="sidenav" id="idSidenav">
                    {sidenavBtns}
                </ul>
            </div>
        )*/

        var navdropdownbtn = this.state.userLoggedIn ? (
            <div>
                <li>
                    <a id="idDropdownTrigger" className="dropdown-trigger" href="#!" data-target="dropdown1">
                        <i className="material-icons left">account_circle</i>
                        {this.props.currentUsername}
                        <i className="material-icons right">arrow_drop_down</i>
                    </a>
                </li>
            </div>
        ) : (
                <div>
                    <li><NavLink to="/login">Log In</NavLink ></li >
                    <li><NavLink to="/signup">Sign Up</NavLink></li>
                </div>
            )
        

        var sidenavdropdownbtn = this.state.userLoggedIn ? (
            <div>
                <li className="sidenav-close">
                    <NavLink to={"/profile/" + this.props.currentUsername + "/"}>
                        <i className="material-icons left">account_circle</i>
                        {this.props.currentUsername}
                    </NavLink>
                </li>
                <li className="divider"></li>
                <li className="sidenav-close"><NavLink to="/" onClick={this.props.appHandleLogOut}>Log Out</NavLink></li>

            </div>
        ) : (
                <div>
                    <li className="sidenav-close"><NavLink to="/login">Log In</NavLink ></li >
                    <li className="sidenav-close"><NavLink to="/signup">Sign Up</NavLink></li>
                </div>
            )

        return (
            <div>
                <div className="navbar-fixed">
                    <ul id="dropdown1" className="dropdown-content">
                        <li><NavLink to={"/profile/" + this.props.currentUsername + "/"}>My Profile</NavLink></li>
                        <li><NavLink to="/" onClick={this.props.appHandleLogOut}>Log Out</NavLink></li>
                    </ul>
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

                                    {navdropdownbtn}
                                </ul>
                            </div>
                        </div>
                    </nav>
                </div>
                <ul className="sidenav" id="idSidenav">
                    {sidenavdropdownbtn}
                </ul>
            </div>
        )
    }
}

export default Navbar;