import React from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import { Link } from 'react-router-dom';
import M from 'materialize-css'
import PostForm from './PostForm';
import default_pfp from '../assets/default_pfp.jpg'

class PostDetail extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            post: this.props.post,
            iDidLikeThisPost: false,
            confirmDelete: false,
            userProfilePicture: null,
        }
    }

    componentDidMount() {
        M.Modal.init(document.querySelectorAll('.modal'), {})
        M.Materialbox.init(document.querySelectorAll('.materialboxed'), {});
        this.isRePost();
        this.getUserprofilePicture();
        if (this.props.loggedUsername !== "") {
            this.didILikeThisPost();
        }

    }

    getUserprofilePicture() {
        axios.get('http://nbmateus.pythonanywhere.com/accounts/profile/' + this.state.post.user + '/')
            .then(response => {
                this.setState({
                    userProfilePicture: response.data.profilePicture
                })
            })
            .catch(error => {

            })
    }

    didILikeThisPost() {
        axios.get('http://nbmateus.pythonanywhere.com/postings/did-i-like-post/' + this.state.post.id + '/', {
            headers: {
                Authorization: Cookies.get('authtoken')
            }
        })
            .then(response => {
                this.setState({
                    iDidLikeThisPost: response.data.didILikePost
                })
            })
            .catch(error => {

            })
    }

    postHasImage(post) {
        if (post.image !== null) {
            return (
                <div className="card-image waves-effect waves-block waves-light">
                    <div className="card-content container">
                        <img alt="" src={post.image} />
                    </div>
                    <br />
                </div>
            )
        }
        else {
            return (<div></div>)
        }
    }




    formatDate(date) {
        var options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true, };
        return new Date(date).toLocaleDateString('en-US', options);
    }

    isRePost() {
        var completePost = this.state.post;
        if (this.state.post.rePost !== null) {
            axios.get('http://nbmateus.pythonanywhere.com/postings/post-detail/' + this.state.post.rePost + '/', {
                headers: {
                    Authorization: Cookies.get('authtoken')
                }
            })
                .then(response => {
                    completePost.rePost = response.data
                    this.setState({
                        post: completePost
                    })
                })
                .catch(error => {
                    completePost.rePost = "private_post"
                    this.setState({
                        post: completePost
                    })
                })
        }

    }

    doLikePost() {
        if (this.state.iDidLikeThisPost) {
            axios.delete('http://nbmateus.pythonanywhere.com/postings/post-detail/' + this.state.post.id + '/like/', {
                headers: {
                    Authorization: Cookies.get('authtoken')
                }
            })
                .then(response => {
                    var postUpdated = this.state.post;
                    postUpdated.likesCount -= 1;
                    this.setState({
                        iDidLikeThisPost: false,
                        post: postUpdated
                    })
                })
                .catch(error => {

                })
        } else {
            axios.post('http://nbmateus.pythonanywhere.com/postings/post-detail/' + this.state.post.id + '/like/', {}, {
                headers: {
                    Authorization: Cookies.get('authtoken')
                }
            })
                .then(response => {
                    var postUpdated = this.state.post;
                    postUpdated.likesCount += 1;
                    this.setState({
                        iDidLikeThisPost: true,
                        post: postUpdated
                    })
                })
                .catch(error => {

                })
        }
    }

    confirmDeletePost() {
        this.setState({
            confirmDelete: true
        }, () => {
            M.Tooltip.init(document.querySelector('#delPostTooltip' + this.state.post.id), {});
            M.Tooltip.getInstance(document.querySelector('#delPostTooltip' + this.state.post.id)).open();
        })
    }

    render() {

        var deleteBtn = <div></div>
        if (this.props.loggedUsername === this.state.post.user) {
            deleteBtn = this.state.confirmDelete ? (
                <div className="right">
                    <a href="/#" className="red-text">
                        <i id={'delPostTooltip' + this.state.post.id} className="tooltipped right material-icons" data-position="top" data-tooltip="Click it again to delete this post" onClick={(e) => {
                            e.preventDefault();
                            M.Tooltip.getInstance(document.querySelector('#delPostTooltip' + this.state.post.id)).close();
                            this.props.deletePost(this.state.post.id)
                        }}>delete</i>
                    </a>
                    <br />
                </div>
            ) : (
                    <div className="right">
                        <a href="/#" className="grey-text">
                            <i className="right material-icons" onClick={(e) => {
                                e.preventDefault();
                                this.confirmDeletePost()
                            }}>delete</i>
                        </a>
                        <br />
                    </div>
                )
        }


        var rePostDiv = <div></div>

        if (this.state.post.rePost !== null) {
            rePostDiv = this.state.post.rePost === "private_post" ? (
                <div className="card grey darken-3">
                    <div className="card-content">
                        <p className="white-text"><i className="material-icons">https</i> This shared content is not visible for you because it belongs to a private profile.</p>
                    </div>
                </div>
            ) : (
                    <div className="card">
                        <div className="card-content">
                            <Link to={"/profile/" + this.state.post.rePost.user}><span className="card-title grey-text text-darken-4"><b>@{this.state.post.rePost.user}</b></span></Link>
                            <p>{this.state.post.rePost.text}</p>
                            {this.postHasImage(this.state.post.rePost)}
                        </div>
                    </div>
                )
        }

        var favButton = this.state.iDidLikeThisPost ? (
            <i className="material-icons left red-text" onClick={() => {
                if (this.props.loggedUsername !== "") {
                    this.doLikePost();
                }

            }}>favorite</i>
        ) : (
                <i className="material-icons left" onClick={() => {
                    if (this.props.loggedUsername !== "") {
                        this.doLikePost();
                    }
                }}>favorite_border</i>
            )

        var repostBtn = this.props.loggedUsername !== "" ? (
            <i className="material-icons left modal-trigger" href={"#modalRePost" + this.state.post.id}>repeat</i>
        ) : (
                <i className="material-icons left">repeat</i>
            )

        var userPfpElement = this.state.userProfilePicture !== null ? (
            <img alt="" width="50" height="50" className="circle" src={this.state.userProfilePicture} />
        ) : (
                <img alt="" width="50" height="50" className="circle" src={default_pfp} />
            )

        return (
            <div className="card">
                <div className="card-content">
                    <div className="row ">
                        <div className="col s11">
                            <Link to={"/profile/" + this.state.post.user}>
                                <b className=" grey-text text-darken-4"><h5 className="valign-wrapper">{userPfpElement}&nbsp;&nbsp;{"@"+this.state.post.user}</h5></b>
                            </Link>
                        </div>
                        <div className="col s1">
                            {deleteBtn}
                        </div>
                    </div>
                    <div>{this.state.post.text}</div>
                    {this.postHasImage(this.state.post)}
                    {rePostDiv}
                    <br />
                    <p className="grey-text right">
                        {this.formatDate(this.state.post.timestamp)}
                    </p>
                </div>
                <div className="card-action">
                    <div className="row">
                        <div className="col s4">
                            <Link to={"/post-detail/" + this.state.post.id} className="black-text"><i className="material-icons">chat_bubble_outline</i></Link>
                        </div>
                        <div className="col s4">
                            <a href="/#" className="black-text" onClick={(e) => e.preventDefault()}>{repostBtn}{this.state.post.sharedCount}</a>
                        </div>
                        <div className="col s4">
                            <a href="/#" className="black-text" onClick={(e) => e.preventDefault()}>{favButton}{this.state.post.likesCount}</a>
                        </div>
                    </div>
                </div>
                <div id={"modalRePost" + this.state.post.id} className="modal">
                    <PostForm rePost={this.state.post} updatePostList={() => { return null }} />
                </div>
            </div>

        )
    }
}

export default PostDetail;