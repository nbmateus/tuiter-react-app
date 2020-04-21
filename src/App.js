import React from 'react';
import Navbar from './components/Navbar';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Footer from './components/Footer';
//import axios from 'axios';
import { BrowserRouter, Route } from 'react-router-dom';

class App extends React.Component{

	componentDidMount(){
		/*console.log("Login")
		
		axios.post('http://nbmateus.pythonanywhere.com/accounts/login/', {username:"adminnbmateus",password:"adminpassnbmateus"})
        .then(response => {
            console.log("logged in: ", response.data);
		})
		.catch(error => {
			console.log("Error: ", error);
		});*/
		
		
		/*console.log("Get User")
		axios.get('http://nbmateus.pythonanywhere.com/accounts/user/', {headers: { Authorization: 'Token 76a39c5c59085cfa37fc7001f01b2be2678fe645' }})
        .then(response => {
            console.log("User: ", response.data);
		})
		.catch(error => {
			console.log("Error: ", error);
		});*/

		/*console.log("logout")
		axios.post('http://nbmateus.pythonanywhere.com/accounts/logout/', {headers: { Authorization: 'Token 76a39c5c59085cfa37fc7001f01b2be2678fe645' }})
        .then(response => {
            console.log("logged out: ", response.data);
		})
		.catch(error => {
			console.log("Error: ", error);
		});*/

		
	}
	

	render(){
		return (
			<BrowserRouter>
				<div className="App">
					<Navbar />
					<Route exact path='/signup' component={SignUp}/>
					<Route exact path='/login' component={SignIn}/>
					<Footer />
				</div>
			</BrowserRouter>
		);
	}
	
}

export default App;
