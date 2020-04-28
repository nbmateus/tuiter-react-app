import React from 'react';
import Cookies from 'js-cookie';
import Navbar from './components/Navbar';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Footer from './components/Footer';
import Home from './components/Home';
import ActivateAccount from './components/ActivateAccount';
import EmailVerification from './components/EmailVerification';
import Profile from './components/Profile';
import axios from 'axios';
import { BrowserRouter, Route } from 'react-router-dom';

class App extends React.Component {

	constructor() {
		super()
		this.handleLogIn = this.handleLogIn.bind(this);
		this.handleLogOut = this.handleLogOut.bind(this);
		this.state = {
			userLoggedIn: false,
			username: '',
		};
	}

	componentDidMount() {
		
		if (Cookies.get('authtoken')) {
			this.handleLogIn()
		}
	}
	

	handleLogOut() {
		axios.post('http://nbmateus.pythonanywhere.com/accounts/logout/', {}, {
			headers: {
				Authorization: Cookies.get('authtoken')
			}
		})
			.then(response => {
				console.log("CERRE SESION ", response)
				Cookies.remove('authtoken');
				this.setState({
					userLoggedIn: false
				});

			})
			.catch(error => {
				console.log("ERROR ", error.response);
			})

	}

	handleLogIn() {
		console.log("SETEO STATE LOGGEDIN")
		axios.get('http://nbmateus.pythonanywhere.com/accounts/user/',{
			headers: {
				Authorization: Cookies.get('authtoken')
			}})
			.then(response => {
				this.setState({
					userLoggedIn: true,
					username: response.data.username
				});
			})
			.catch(error => {
				console.log(error.response);
			})
	}

	render() {
		return (
			<BrowserRouter>
				<div className="App grey">
					<Navbar loggedIn={this.state.userLoggedIn} currentUsername={this.state.username} appHandleLogOut={this.handleLogOut} />
					<Route exact path='/' render={(props) => <Home {...props} loggedIn={this.state.userLoggedIn} />} />
					<Route exact path='/signup' component={SignUp} />
					<Route exact path='/login' render={(props) => <SignIn {...props} handleLogIn={this.handleLogIn} />} />
					<Route exact path='/account-verified' component={ActivateAccount} />
					<Route exact path='/registration-complete' component={EmailVerification} />
					<Route exact path='/profile/:profileUsername' render={(props) => <Profile {...props} loggedIn={this.state.userLoggedIn} loggedUsername={this.state.username} />} />
					<Footer />
				</div>
			</BrowserRouter>
		);
	}

}

export default App;
