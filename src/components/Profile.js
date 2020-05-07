import React from 'react';
import axios from 'axios';
import PostList from './PostList';
import Cookies from 'js-cookie';
import PostForm from './PostForm';

class Profile extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            profile: {},
            profileDoesNotExist: false,
            postList: [],
            postListNextPage: null,
            postListVisible: true,
            postListLoaded: false,

        }
        this.updatePostList = this.updatePostList.bind(this)
        this.deletePost = this.deletePost.bind(this)
    }

    componentDidUpdate(prevProps) {
        if (prevProps.match.params.profileUsername !== this.props.match.params.profileUsername) {
            this.setState({
                profile: {},
                profileDoesNotExist: false,
                postList: [],
                postListNextPage: null,
                postListVisible: true,
                postListLoaded: false,
            },() => {this.getProfile()})
            
        }
    }

    componentDidMount() {
        this.getProfile();
    }


    getProfile() {
        axios.get('http://nbmateus.pythonanywhere.com/accounts/profile/' + this.props.match.params.profileUsername + '/')
            .then(response => {
                this.setState({
                    profile: response.data,
                    profileDoesNotExist: false
                }, () => {
                    window.scrollTo(0, 0)
                    this.getPostList();
                })
            })
            .catch(error => {
                this.setState({
                    profileDoesNotExist: true
                });
            })
    }


    loadNextPage() {
        axios.get(this.state.postListNextPage, {
            headers: {
                Authorization: Cookies.get('authtoken')
            }
        })
            .then(response => {
                this.setState({
                    postListNextPage: response.data.next,
                    postList: [...this.state.postList, ...response.data.results]
                })
            })
            .catch(error => {
            })
    }

    getPostList() {
        axios.get(this.state.profile.mainPostList, {
            headers: {
                Authorization: Cookies.get('authtoken')
            }
        })
            .then(response => {
                this.setState({
                    postList: response.data.results,
                    postListNextPage: response.data.next,
                    postListLoaded: true
                })
            })
            .catch(error => {
                this.setState({
                    postListVisible: false
                })

            })
    }

    updatePostList() {
        this.getPostList()
    }

    deletePost(postId) {
        axios.delete('http://nbmateus.pythonanywhere.com/postings/post-detail/' + postId + '/', {
            headers: {
                Authorization: Cookies.get('authtoken')
            }
        })
            .then(response => {
                this.updatePostList()
            })
            .catch(error => {

            })
    }


    render() {

        var loadMore = this.state.postListNextPage == null ? (
            <div></div>
        ) : (
                <div className="center">
                    <button className="waves-effect waves-light btn-small" onClick={() => this.loadNextPage()}>Load More</button>
                </div>
            )

        var postFormView = this.props.loggedUsername === this.state.profile.user ? (
            <PostForm updatePostList={this.updatePostList} />
        ) : (
                <div></div>
            )

        var mainPostListView;

        if (this.state.postListVisible) {
            mainPostListView = this.state.postListLoaded ? (
                <div>
                    {postFormView}
                    <div>
                        <PostList
                            postList={this.state.postList}
                            loggedIn={this.props.userLoggedIn}
                            loggedUsername={this.props.loggedUsername}
                            updatePostList={this.updatePostList}
                            deletePost={this.deletePost}
                        />
                    </div>
                </div>
            ) : (
                    <div className="progress" >
                        <div className="indeterminate"></div>
                    </div >
                )

        } else {
            mainPostListView = (
                <div className="card grey darken-2">
                    <div className="card-content white-text center">
                        <h4><i className="material-icons">https</i>This profile is private.</h4>
                    </div>
                </div>
            )
        }





        var profileview = this.state.profileDoesNotExist ? (
            <div className="container">
                <div className="card">
                    <div className="center">
                        <br />
                        <br />
                        <img alt="" width="100" className="circle responsive-img" src="https://f0.pngfuel.com/png/178/595/black-profile-icon-illustration-user-profile-computer-icons-login-user-avatars-png-clip-art.png" />
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
                            <img alt="" width="100" className="circle responsive-img" src="https://f0.pngfuel.com/png/178/595/black-profile-icon-illustration-user-profile-computer-icons-login-user-avatars-png-clip-art.png" />
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
                    <br />
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