import React from 'react';
import axios from 'axios';
import PostList from './PostList';

class Profile extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            profile: {},
            profileDoesNotExist: false,
        }
    }

    /*componentWillReceiveProps(nextProps) {
        if(nextProps.match.params.profileUsername != this.state.profile.user){
          this.getProfile()
        }
    }*/

    componentDidUpdate(prevProps) {
        if (this.state.profile.user !== this.props.match.params.profileUsername) {
            this.getProfile()
        }
      }

    componentDidMount() {
        this.getProfile();
    }


    getProfile(){
        axios.get('http://nbmateus.pythonanywhere.com/accounts/profile/' + this.props.match.params.profileUsername + '/')
        .then(response => {
            this.setState({
                profile: response.data,
                profileDoesNotExist: false
            })
        })
        .catch(error => {
            console.log("ERROR ", error.response)
            this.setState({
                profileDoesNotExist: true
            });
        })
    }

    render() {
        var mainPostListView = this.state.profile.mainPostList ? (
            <div>
                <PostList postListUrl={this.state.profile.mainPostList} />
            </div>
        ) : (
                <div></div>
            )

        var profileview = this.state.profileDoesNotExist ? (
            <div className="container">
                <div className="card">
                    <div className="center">
                        <br />
                        <br />
                        <img alt="" width="100" className="circle responsive-img" src="https://discordapp.com/assets/322c936a8c8be1b803cd94861bdfa868.png" />
                        <br />
                        <br />
                        <span className="card-title">@{this.props.match.params.profileUsername}</span>
                    </div>
                    <div className="card-content">
                        <span className="card-title center">This account doesn't exist!</span>
                    </div>

                </div>
            </div>

        ) : (
                <div className="container grey">
                    <div className="card">
                        <div className="center">
                            <br />
                            <br />
                            <img alt="" width="100" className="circle responsive-img" src="https://discordapp.com/assets/322c936a8c8be1b803cd94861bdfa868.png" />
                            <br />
                            <span className="card-title"><h4>{this.state.profile.fullname}</h4></span>

                            <span className="card-title"><h5>@{this.state.profile.user}</h5></span>
                        </div>
                        <div className="card-content">
                            <span className="card-title">{this.state.profile.description}</span>
                        </div>
                        <div className="card-action">
                            <div className="row center">
                                <div className="col s4">
                                    <a href="#">Followers<br />{this.state.profile.followersCount}</a>
                                </div>
                                <div className="col s4">
                                    <a href="#">Following<br />{this.state.profile.followingCount}</a>
                                </div>
                                <div className="col s4">
                                    <a href="#">Liked Posts</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    {mainPostListView}
                </div>
            )

        return (
            profileview
        )
    }
}

export default Profile;