import React from 'react';
import 'materialize-css/dist/css/materialize.css';
import M from 'materialize-css/dist/js/materialize';
import { NavLink } from 'react-router-dom'
import axios from 'axios';


class Navbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userLoggedIn: this.props.loggedIn,
            autocompleteInstance: null,
            searchBoxInput: "",
            autocompleteData: {},

        }
    }

    componentDidMount(){
        M.Dropdown.init(document.querySelector('#idDropdownTrigger'), {
            coverTrigger: false,
        });

        M.Autocomplete.init(document.querySelector('#searchBoxInput'), {
            data: {},
            limit: 10,
            onAutocomplete: () => {
                this.props.history.push('/profile/' + document.querySelector('#searchBoxInput').value)
                this.setState({
                    searchBoxInput: ""
                })
            }
        });   
    }

    componentDidUpdate() {
        M.Dropdown.init(document.querySelector('#idDropdownTrigger'), {
            coverTrigger: false,
        })
        
        if (this.state.searchBoxInput === "") {
            M.Autocomplete.init(document.querySelector('#searchBoxInput'), {
                data: {},
                limit: 10,
                onAutocomplete: () => {
                    this.props.history.push('/profile/' + document.querySelector('#searchBoxInput').value)
                    this.setState({
                        searchBoxInput: ""
                    })
                }
            });
        } else {
            M.Autocomplete.getInstance(document.querySelector('#searchBoxInput')).updateData(this.state.autocompleteData);
        }

        if (this.state.userLoggedIn !== this.props.loggedIn) {
            this.setState({
                userLoggedIn: this.props.loggedIn
            })
        }
    }

    handleSearchInput = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        }, () => {
            if (this.state.searchBoxInput !== "") {
                axios.get('http://nbmateus.pythonanywhere.com/accounts/profile-list/?search=' + this.state.searchBoxInput)
                    .then(response => {
                        var autocompleteResults = {};
                        for (var i = 0; i < response.data.results.length; i++) {
                            autocompleteResults[response.data.results[i].user] = null;
                        }
                        this.setState({
                            autocompleteData: autocompleteResults
                        })

                    })
                    .catch(error => {

                    })
            }
        })
    }

    render() {

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
                <ul>
                    <li><NavLink to="/login">Log In</NavLink ></li >
                    <li><NavLink to="/signup">Sign Up</NavLink></li>
                </ul>
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
                <li className="sidenav-close"><NavLink to="/" >Home</NavLink></li>
                <li className="sidenav-close"><NavLink to="/settings" >Settings</NavLink></li>
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
                        <li><NavLink to="/">Home</NavLink></li>
                        <li><NavLink to="/settings">Settings</NavLink></li>
                        <li className="divider"></li>
                        <li><NavLink to="/" onClick={this.props.appHandleLogOut}>Log Out</NavLink></li>
                    </ul>
                    <nav>
                        <div className="nav-wrapper teal">
                            <div className="container">
                                <ul className="left">
                                    <NavLink to="/" className="brand-logo" >LOGO</NavLink>
                                </ul>
                                <a className="sidenav-trigger hide-on-larg" data-target="idSidenav">
                                    <i className="material-icons">menu</i>
                                </a>
                                <ul className="right hide-on-med-and-down">
                                    <li>
                                        <form onSubmit={(e)=>{
                                            e.preventDefault();
                                            this.props.history.push('/search/'+this.state.searchBoxInput)
                                            }}>
                                            <div className="input-field">
                                                <input className="autocomplete" id="searchBoxInput" value={this.state.searchBoxInput} placeholder="Search users..." type="search" required onChange={this.handleSearchInput}/>
                                                <label className="label-icon" htmlFor="searchBoxInput"><i className="material-icons">search</i></label>
                                                <i className="material-icons" onClick={() => { this.setState({ searchBoxInput: "" }) }}>close</i>
                                            </div>
                                        </form>
                                    </li>
                                    <li>
                                        {navdropdownbtn}
                                    </li>
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