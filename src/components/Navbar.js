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
            showMobileSearchbar: false,

        }
    }

    componentDidMount() {
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

        M.Autocomplete.init(document.querySelector('#searchBoxInput2'), {
            data: {},
            limit: 10,
            onAutocomplete: () => {
                this.props.history.push('/profile/' + document.querySelector('#searchBoxInput2').value)
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
            if (this.state.showMobileSearchbar) {
                M.Autocomplete.init(document.querySelector('#searchBoxInput2'), {
                    data: {},
                    limit: 10,
                    onAutocomplete: () => {
                        this.props.history.push('/profile/' + document.querySelector('#searchBoxInput2').value)
                        this.toggleMobileSearchBar();
                        this.setState({
                            searchBoxInput: ""
                        })
                    }
                });
            } else {
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

        } else {

            if (this.state.showMobileSearchbar) {
                M.Autocomplete.getInstance(document.querySelector('#searchBoxInput2')).updateData(this.state.autocompleteData);
            } else {
                M.Autocomplete.getInstance(document.querySelector('#searchBoxInput')).updateData(this.state.autocompleteData);
            }


        }

        if (this.state.userLoggedIn !== this.props.loggedIn) {
            this.setState({
                userLoggedIn: this.props.loggedIn
            })
        }
    }

    handleSearchInput = (e) => {
        this.setState({
            searchBoxInput: e.target.value
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

    toggleMobileSearchBar() {
        this.setState({
            showMobileSearchbar: !this.state.showMobileSearchbar
        }, () => {
            if (this.state.showMobileSearchbar) {
                document.getElementById('searchBoxInput2').focus();
            }
        })
    }

    render() {

        var navdropdownbtn = this.state.userLoggedIn ? (
            <li>
                <a id="idDropdownTrigger" className="dropdown-trigger" href="#!" data-target="dropdown1">
                    <i className="material-icons left">account_circle</i>
                    {this.props.currentUsername}
                    <i className="material-icons right">arrow_drop_down</i>
                </a>
                <ul id="dropdown1" className="dropdown-content">
                        <li><NavLink to={"/profile/" + this.props.currentUsername + "/"}>My Profile</NavLink></li>
                        <li><NavLink to="/">Home</NavLink></li>
                        <li><NavLink to="/settings">Settings</NavLink></li>
                        <li className="divider"></li>
                        <li><a href="/#" onClick={(e) => {
                            e.preventDefault()
                            this.props.appHandleLogOut()
                        }}>Log Out</a></li>
                    </ul>
            </li>
        ) : (
                <React.Fragment>
                    <li><NavLink to="/" >Home</NavLink></li>
                    <li><NavLink to="/login">Log In</NavLink ></li >
                    <li><NavLink to="/signup">Sign Up</NavLink></li>
                </React.Fragment>
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
                <li className="sidenav-close"><a href="/#" onClick={(e) => {
                    e.preventDefault();
                    this.props.appHandleLogOut();
                }}>Log Out</a></li>

            </div>
        ) : (
                <div>
                    <li className="sidenav-close"><NavLink to="/" >Home</NavLink></li>
                    <li className="sidenav-close"><NavLink to="/login">Log In</NavLink ></li >
                    <li className="sidenav-close"><NavLink to="/signup">Sign Up</NavLink></li>
                </div>
            )

        var mobileSearchbarElement = this.state.showMobileSearchbar ? (
            <nav>
                <div className="nav-wrapper teal">
                    <div className="container">
                        <ul className="left hide-on-large-only">
                            <li>
                                <i className="material-icons">search</i>
                            </li>
                        </ul>
                        <ul className="center hide-on-large-only">
                            <li>
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    this.setState({
                                        searchBoxInput: ""
                                    })
                                    this.props.history.push('/search/' + this.state.searchBoxInput)
                                }}>
                                    <div className="input-field">
                                        <input className="autocomplete" id="searchBoxInput2" value={this.state.searchBoxInput} placeholder="Search users..." type="search" required onChange={this.handleSearchInput} />
                                        <i className="material-icons right" onClick={() => {
                                            this.setState({ searchBoxInput: "" });
                                            this.toggleMobileSearchBar();
                                        }}>close</i>
                                    </div>
                                </form>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        ) : (
                <div></div>
            )

        return (
            <div>
                <div className="navbar-fixed">
                    <nav>
                        <div className="nav-wrapper teal">
                            <div className="container2">
                                <ul className="left">
                                    <NavLink to="/" className="brand-logo" >Tuiter</NavLink>
                                </ul>
                                <a href="/#" className="sidenav-trigger hide-on-larg" data-target="idSidenav">
                                    <i className="material-icons">menu</i>
                                </a>
                                <ul className="hide-on-large-only right" style={{ paddingRight: "20px" }}>
                                    <i className="material-icons" onClick={() => {
                                        this.toggleMobileSearchBar()
                                    }}>search</i>
                                </ul>

                                <ul className="right hide-on-med-and-down">
                                    <li>
                                        <form onSubmit={(e) => {
                                            e.preventDefault();
                                            this.setState({
                                                searchBoxInput: ""
                                            })
                                            this.props.history.push('/search/' + this.state.searchBoxInput)
                                        }}>
                                            <div className="input-field">

                                                <input className="autocomplete" id="searchBoxInput" value={this.state.searchBoxInput} placeholder="Search users..." type="search" required onChange={this.handleSearchInput} />
                                                <label className="label-icon" htmlFor="searchBoxInput"><i className="material-icons">search</i></label>
                                                <i className="material-icons" onClick={() => { this.setState({ searchBoxInput: "" }) }}>close</i>
                                            </div>
                                        </form>
                                    </li>
                                    {navdropdownbtn}
                                </ul>
                            </div>
                        </div>
                    </nav>
                    {mobileSearchbarElement}
                </div>
                <ul className="sidenav" id="idSidenav">
                    {sidenavdropdownbtn}
                </ul>
            </div>
        )
    }
}

export default Navbar;