import React from 'react';
import axios from 'axios';
import PostList from './PostList';
import Cookies from 'js-cookie';
import PostForm from './PostForm';
import default_pfp from '../assets/default_pfp.jpg'
import SearchResult from './SearchResult'
import { Link } from 'react-router-dom'

class Profile extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            profile: {},
            followers: [],
            followersNextPage: null,
            loadingFollowersgNextPage: false,
            following: [],
            followingNextPage: null,
            loadingFollowingNextPage: false,
            profileDoesNotExist: false,
            postList: [],
            postListNextPage: null,
            postListVisible: true,
            componentLoaded: false,
            imFollowingThisUser: null,
            loadingNextPage: false,

        }
        this.updatePostList = this.updatePostList.bind(this)
        this.deletePost = this.deletePost.bind(this)
    }

    componentDidUpdate(prevProps) {
        if (prevProps.match.params.profileUsername !== this.props.match.params.profileUsername || prevProps.loggedUsername !== this.props.loggedUsername) {
            this.setState({
                profile: {},
                followers: [],
                following: [],
                profileDoesNotExist: false,
                postList: [],
                postListNextPage: null,
                postListVisible: true,
                componentLoaded: false,
                imFollowingThisUser: null,


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
                    this.getFollowers();
                    this.getFollowing();
                    this.getPostList();

                    if (this.props.loggedUsername.length > 0 && this.state.profile.user !== this.props.loggedUsername) {
                        this.amIFollowingThisUser();
                    }

                })
            })
            .catch(error => {
                this.setState({
                    profileDoesNotExist: true,
                    componentLoaded: true,
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
        this.setState({
            loadingNextPage: true
        })
        axios.get(this.state.postListNextPage, {
            headers: {
                Authorization: Cookies.get('authtoken')
            }
        })
            .then(response => {
                this.setState({
                    postListNextPage: response.data.next,
                    postList: [...this.state.postList, ...response.data.results],
                    loadingNextPage: false,
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
                    componentLoaded: true,
                })
            })
            .catch(error => {
                this.setState({
                    postListVisible: false,
                    componentLoaded: true,
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

    getFollowers() {
        axios.get(this.state.profile.followers, {
            headers: {
                Authorization: Cookies.get('authtoken')
            }
        })
            .then(response => {
                this.setState({
                    followers: response.data.results,
                    followersNextPage: response.data.next,
                })
            })
            .catch(error => {

            })
    }

    getFollowing() {
        axios.get(this.state.profile.following, {
            headers: {
                Authorization: Cookies.get('authtoken')
            }
        })
            .then(response => {
                this.setState({
                    following: response.data.results,
                    followingNextPage: response.data.next,
                })
            })
            .catch(error => {
            })
    }

    loadFollowersNextPage() {
        this.setState({
            loadingFollowersgNextPage: true,
        })
        axios.get(this.state.followersNextPage, {
            headers: {
                Authorization: Cookies.get('authtoken')
            }
        })
            .then(response => {
                this.setState({
                    followersNextPage: response.data.next,
                    followers: [...this.state.followers, ...response.data.results],
                    loadingFollowersgNextPage: false,
                })
            })
            .catch(error => {
                this.setState({
                    loadingFollowersgNextPage: false,
                })
            })
    }

    loadFollowingNextPage() {
        this.setState({
            loadingFollowingNextPage: true,
        })
        axios.get(this.state.followingNextPage, {
            headers: {
                Authorization: Cookies.get('authtoken')
            }
        })
            .then(response => {
                this.setState({
                    followingNextPage: response.data.next,
                    following: [...this.state.following, ...response.data.results],
                    loadingFollowingNextPage: false,
                })
            })
            .catch(error => {
                this.setState({
                    loadingFollowingNextPage: false,
                })
            })
    }


    render() {

        var loadMorePosts = <div></div>
        if (this.state.postListNextPage !== null) {
            loadMorePosts = this.state.loadingNextPage ? (
                <div className="progress">
                    <div className="indeterminate"></div>
                </div>
            ) : (
                    <div className="center">
                        <button className="waves-effect waves-light btn-small" onClick={() => this.loadNextPage()}>Load More</button >
                    </div >
                )
        }

        var loadMoreFollowers = <div></div>
        if (this.state.followersNextPage !== null) {
            loadMoreFollowers = this.state.loadingFollowersgNextPage ? (
                <div className="progress">
                    <div className="indeterminate"></div>
                </div>
            ) : (
                    <div className="center">
                        <button className="waves-effect waves-light btn-small" onClick={() => this.loadFollowersNextPage()}>Load More</button >
                    </div >
                )
        }

        var loadMoreFollowing = <div></div>
        if (this.state.followingNextPage !== null) {
            loadMoreFollowing = this.state.loadingFollowingNextPage ? (
                <div className="progress">
                    <div className="indeterminate"></div>
                </div>
            ) : (
                    <div className="center">
                        <button className="waves-effect waves-light btn-small" onClick={() => this.loadFollowingNextPage()}>Load More</button >
                    </div >
                )
        }

        var postFormView = this.props.loggedUsername === this.state.profile.user ? (
            <PostForm updatePostList={this.updatePostList} />
        ) : (
                <div></div>
            )


        var mainPostListView = this.state.postListVisible ? (
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
                <div className="card grey darken-2">
                    <div className="card-content white-text center">
                        <h4><i className="material-icons">https</i>This profile is private.</h4>
                    </div>
                </div>
            )


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

        var profileStats = this.state.postListVisible ? (
            <div className="row center">
                <div className="col s6">
                    <a href="#followersModal" className="teal-text modal-trigger"><b>Followers<br />{this.state.profile.followersCount}</b></a>
                    <div id="followersModal" className="modal">
                        <h5 className="center">Followers</h5>
                        <ul className="collection">
                            {this.state.followers.map((followers) => {
                                return (
                                    <SearchResult key={followers.id} {...this.props} result={followers} />
                                )
                            })}
                        </ul>
                        {loadMoreFollowers}
                    </div>
                </div>
                <div className="col s6">
                    <a href="#followingModal" className="teal-text modal-trigger"><b>Following<br />{this.state.profile.followingCount}</b></a>
                    <div id="followingModal" className="modal">
                        <h5 className="center">Following</h5>
                        <ul className="collection">

                            {this.state.following.map((following) => {
                                return (
                                    <SearchResult key={following.id} {...this.props} result={following} />
                                )
                            })}
                        </ul>
                        {loadMoreFollowing}
                    </div>
                </div>
            </div>
        ) : (
                <div className="row center">
                    <div className="col s6">
                        <a href="/#" className="teal-text" onClick={(e) => e.preventDefault()}><b>Followers<br />{this.state.profile.followersCount}</b ></a >
                    </div >
                    <div className="col s6">
                        <a href="/#" className="teal-text" onClick={(e) => e.preventDefault()}><b>Following<br />{this.state.profile.followingCount}</b></a>
                    </div>
                </div >
            )


        var profileview = this.state.profileDoesNotExist ? (
            <div className="grey darken-3">
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
                <div className="grey darken-3">
                    <div className="card">
                        <div className="center">
                            <br />
                            <br />
                            {profilePictureElement}
                            <br />
                            <span className="card-title"><h4>{this.state.profile.fullname}</h4></span>

                            <Link to={"/profile/" + this.state.profile.user} className="card-title"><h5>@{this.state.profile.user}</h5></Link>
                            {followBtn}
                        </div>
                        <div className="card-content">
                            <span className="card-title">{this.state.profile.description}</span>
                        </div>
                        <div className="card-action">
                            {profileStats}
                        </div>
                    </div>
                    {mainPostListView}
                    <br />
                    {loadMorePosts}
                    <br />
                </div>
            )

        var componentView = this.state.componentLoaded ? (
            profileview
        ) : (
                <div className="progress" >
                    <div className="indeterminate"></div>
                </div >
            )

        return componentView

    }
}

export default Profile;