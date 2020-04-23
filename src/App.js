import React from 'react';
import Cookies from 'js-cookie';
import Navbar from './components/Navbar';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Footer from './components/Footer';
import ActivateAccount from './components/ActivateAccount';
import EmailVerification from './components/EmailVerification';
import axios from 'axios';
import { BrowserRouter, Route } from 'react-router-dom';

class App extends React.Component {

	constructor() {
		super()
		this.handleLogIn = this.handleLogIn.bind(this);
		this.handleLogOut = this.handleLogOut.bind(this);
		this.state = {
			userLoggedIn: false
		};
	}

	componentDidMount() {
		this.checkUserAuthentication();
	}

	checkUserAuthentication() {
		if (Cookies.get('authtoken')) {
			this.handleLogIn()
		}
	}

	handleLogOut() {
        axios.post('http://nbmateus.pythonanywhere.com/accounts/logout/',{},{
            headers:{
                Authorization: Cookies.get('authtoken')
            }
        })
        .then(response =>{
			console.log("CERRE SESION ", response)
			Cookies.remove('authtoken');
            this.setState({
                userLoggedIn: false
            });

        })
        .catch(error => {
            console.log("ERROR ",error.response);
        })

	}

	handleLogIn() {
		console.log("SETEO STATE LOGGEDIN")
		this.setState({
			userLoggedIn: true
		});
	}

	render() {
		var loggedIn = this.state.userLoggedIn ? (
			<div>LOGGED IN</div>
		) : (
				<div>NOT LOGGED IN</div>
			)
		return (
			<BrowserRouter>
				<div className="App">
					<Navbar loggedIn={this.state.userLoggedIn} appHandleLogOut={this.handleLogOut} />
					<Route exact path='/signup' component={SignUp} />
					<Route exact path='/login' render={(props) => <SignIn {...props} handleLogIn={this.handleLogIn} />} />
					{loggedIn}
					<Route exact path='/account-verified' component={ActivateAccount} />
					<Route exact path='/registration-complete' component={EmailVerification} />
					<Footer />
				</div>
			</BrowserRouter>
		);
	}

}

export default App;
