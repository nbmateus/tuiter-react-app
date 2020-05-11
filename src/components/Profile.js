import React from 'react';
import axios from 'axios';
import PostList from './PostList';
import Cookies from 'js-cookie';
import PostForm from './PostForm';
import default_pfp from '../assets/default_pfp.jpg'

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
            imFollowingThisUser: null,

        }
        this.updatePostList = this.updatePostList.bind(this)
        this.deletePost = this.deletePost.bind(this)
    }

    componentDidUpdate(prevProps) {
        if (prevProps.match.params.profileUsername !== this.props.match.params.profileUsername || prevProps.loggedUsername !== this.props.loggedUsername) {
            this.setState({
                profile: {},
                profileDoesNotExist: false,
                postList: [],
                postListNextPage: null,
                postListVisible: true,
                postListLoaded: false,
                imFollowingThisUser: null

            }, () => { this.getProfile() })
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
                    profileDoesNotExist: false,
                    imFollowingThisUser: null,
                }, () => {
                    window.scrollTo(0, 0)
                    this.getPostList();
                    
                    if (this.props.loggedUsername.length > 0 && this.state.profile.user !== this.props.loggedUsername) {
                        this.amIFollowingThisUser();
                    }

                })
            })
            .catch(error => {
                this.setState({
                    profileDoesNotExist: true
                });
            })
    }

    amIFollowingThisUser() {
        axios.get('http://nbmateus.pythonanywhere.com/accounts/am-i-following-user/' + this.state.profile.user + '/', {
            headers: {
                Authorization: Cookies.get('authtoken')
            }
        })
            .then(response => {
                this.setState({
                    imFollowingThisUser: response.data.amIFollowingUser
                })
            })
            .catch(error => {

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

    handleFollowBtn() {
        if (this.state.imFollowingThisUser) {
            axios.delete('http://nbmateus.pythonanywhere.com/accounts/profile/' + this.state.profile.user + '/follow/', {
                headers: {
                    Authorization: Cookies.get('authtoken')
                }
            })
                .then(response => {
                    var profileUpdated = this.state.profile;
                    profileUpdated.followersCount -= 1;
                    this.setState({
                        imFollowingThisUser: false,
                        profile: profileUpdated
                    })
                })
                .catch(error => {

                })
        } else if (!this.state.imFollowingThisUser) {
            axios.post('http://nbmateus.pythonanywhere.com/accounts/profile/' + this.state.profile.user + '/follow/', {}, {
                headers: {
                    Authorization: Cookies.get('authtoken')
                }
            })
                .then(response => {
                    var profileUpdated = this.state.profile;
                    profileUpdated.followersCount += 1;
                    this.setState({
                        imFollowingThisUser: true,
                        profile: profileUpdated
                    })
                })
                .catch(error => {

                })
        }
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

        var profilePictureElement = !this.state.profileDoesNotExist && this.state.profile.profilePicture !== null ? (
            <img alt="" height="150" width="150" className="circle" src={this.state.profile.profilePicture} />
        ) : (
                <img alt="" height="150" width="150" className="circle" src={default_pfp} />
            )

        var followBtn = <div></div>
        if (this.state.imFollowingThisUser !== null && this.state.postListVisible) {
            followBtn = this.state.imFollowingThisUser ? (
                <div className="waves-effect waves-light btn grey lighten-2 black-text" onClick={() => this.handleFollowBtn()}>Unfollow</div>
            ) : (
                    <div className="waves-effect waves-light btn" onClick={() => this.handleFollowBtn()}>Follow</div>
                )
        }


        var profileview = this.state.profileDoesNotExist ? (
            <div className="container">
                <div className="card">
                    <div className="center">
                        <br />
                        <br />
                        {profilePictureElement}
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
                            {profilePictureElement}
                            <br />
                            <span className="card-title"><h4>{this.state.profile.fullname}</h4></span>

                            <span className="card-title"><h5>@{this.state.profile.user}</h5></span>
                            {followBtn}
                        </div>
                        <div className="card-content">
                            <span className="card-title">{this.state.profile.description}</span>
                        </div>
                        <div className="card-action">
                            <div className="row center">
                                <div className="col s4">
                                    <a href="/#" >Followers<br />{this.state.profile.followersCount}</a>
                                </div>
                                <div className="col s4">
                                    <a href="/#" >Following<br />{this.state.profile.followingCount}</a>
                                </div>
                                <div className="col s4">
                                    <a href="/#" >Liked Posts</a>
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