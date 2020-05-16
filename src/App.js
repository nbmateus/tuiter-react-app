import React from 'react';
import Cookies from 'js-cookie';
import Navbar from './components/Navbar';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import ProfileSettings from './components/ProfileSettings';
import Home from './components/Home';
import ActivateAccount from './components/ActivateAccount';
import EmailVerification from './components/EmailVerification';
import Profile from './components/Profile';
import Search from './components/Search';
import Comments from './components/Comments'
import axios from 'axios';
import { BrowserRouter, Route } from 'react-router-dom';
import M from 'materialize-css/dist/js/materialize';

class App extends React.Component {

	constructor(props) {
		super(props)
		this.handleLogIn = this.handleLogIn.bind(this);
		this.handleLogOut = this.handleLogOut.bind(this);
		this.state = {
			userLoggedIn: false,
			username: '',
		};
	}

	componentDidMount() {
		//M.AutoInit();
		M.Dropdown.init(document.querySelector('#idDropdownTrigger'), {
			coverTrigger: false,
		})
		M.Sidenav.init(document.querySelectorAll('.sidenav'), {});
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
				Cookies.remove('authtoken');
				this.setState({
					userLoggedIn: false,
					username: ""
				});

			})
			.catch(error => {

			})

	}

	handleLogIn() {
		axios.get('http://nbmateus.pythonanywhere.com/accounts/user/', {
			headers: {
				Authorization: Cookies.get('authtoken')
			}
		})
			.then(response => {
				this.setState({
					userLoggedIn: true,
					username: response.data.username
				});
			})
			.catch(error => {

			})
	}

	render() {

		return (
			<BrowserRouter>
				<div className="App grey">
					<Route path='/' render={(props) => <Navbar {...props} loggedIn={this.state.userLoggedIn} currentUsername={this.state.username} appHandleLogOut={this.handleLogOut} />} />
					<div className="container2">
						<Route exact path='/' render={(props) => <Home {...props} loggedIn={this.state.userLoggedIn} loggedUsername={this.state.username} />} />
						<Route exact path='/signup' component={SignUp} />
						<Route exact path='/login' render={(props) => <SignIn {...props} handleLogIn={this.handleLogIn} />} />
						<Route exact path='/account-verified' component={ActivateAccount} />
						<Route exact path='/registration-complete' component={EmailVerification} />
						<Route exact path='/profile/:profileUsername' render={
							(props) =>
								<Profile
									{...props}
									loggedIn={this.state.userLoggedIn}
									loggedUsername={this.state.username}
								/>}
						/>

						<Route exact path='/settings/' render={(props) =>
							<ProfileSettings
								{...props}
								loggedUsername={this.state.username}
							/>

						}
						/>
						<Route exact path='/search/:search_input' render={(props) => <Search {...props} />} />
						<Route exact path='/post-detail/:postId' render={(props) => <Comments {...props} loggedUsername={this.state.username}/>}/>
					</div>
				</div >
			</BrowserRouter>
		);
	}

}

export default App;
