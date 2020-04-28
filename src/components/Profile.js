import React from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import PostList from './PostList';

class Profile extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            profile: {},
            error: false,
            mainPostList: null,
            nextPage: null,
            contentIsVisible: true,
        }
    }

    componentDidMount() {
        axios.get('http://nbmateus.pythonanywhere.com/accounts/profile/' + this.props.match.params.profileUsername + '/')
            .then(response => {
                this.setState({
                    profile: response.data
                })
                this.getMainPostList()
            })
            .catch(error => {
                console.log("ERROR ", error.response)
                this.setState({
                    error: true
                });
            })
    }

    getMainPostList() {
        axios.get(this.state.profile.mainPostList, {
            headers: {
                Authorization: Cookies.get('authtoken')
            }
        })
            .then(response => {
                this.setState({
                    mainPostList: response.data.results,
                    nextPage: response.data.next
                })
            })
            .catch(error => {
                console.log("ERROR: ", error.response);
                this.setState({
                    contentIsVisible: false
                })
            })
    }

    loadNextPage(){
        console.log("next page link ", this.state.nextPage)
        axios.get(this.state.nextPage, {
            headers: {
                Authorization: Cookies.get('authtoken')
            }})
            .then(response => {
                const array = [...this.state.mainPostList, ...response.data.results]
                this.setState({
                    nextPage: response.data.next,
                    mainPostList: array
                })
            })
            .catch(error => {
                console.log("ERROR ", error.response)
            })
    }


    render() {
        var loadMore = <div></div>
        loadMore = (this.state.mainPostList != null && this.state.nextPage == null) ? (
            <div>
                no hay mas nada
            </div>
        ) : (
                <div className="center">
                    <a className="waves-effect waves-light btn-small" onClick={ () => this.loadNextPage()}>Load More</a>
                </div>
            )

        const mainPostListView = this.state.contentIsVisible && this.state.mainPostList != null ? (
            <div>
                <PostList postList={this.state.mainPostList} />
            </div>
        ) : (

                <div className="card grey">
                    <div className="card-content white-text center">
                        <h4><i className="material-icons">https</i>This profile is private</h4>
                    </div>
                </div>
            )


        const profileview = this.state.error ? (
            <div className="container">
                <div className="card">
                    <div className="center">
                        <img width="100" className="circle responsive-img" src="https://discordapp.com/assets/322c936a8c8be1b803cd94861bdfa868.png" />
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
                            <img width="100" className="circle responsive-img" src="https://discordapp.com/assets/322c936a8c8be1b803cd94861bdfa868.png" />
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

                    {loadMore}
                    <br />
                </div>
            )

        return (
            profileview
        )
    }
}

export default Profile;