import React from 'react'
import { Link } from 'react-router-dom'
import M from 'materialize-css'
import axios from 'axios'
import Cookies from 'js-cookie'
import PostForm from './PostForm'
import default_pfp from '../assets/default_pfp.jpg'

class CommentDetail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            comment: props.comment,
            confirmDelete: false,
            iDidLikeThisComment: false,
            userProfilePicture: null,
            deletingComment: false,
        }
    }

    componentDidMount() {
        this.getUserprofilePicture();
        if (this.props.loggedUsername !== "") {
            this.didILikeThisComment();
        }

    }

    getUserprofilePicture() {
        axios.get('http://nbmateus.pythonanywhere.com/accounts/profile/' + this.state.comment.user + '/')
            .then(response => {
                this.setState({
                    userProfilePicture: response.data.profilePicture
                })
            })
            .catch(error => {

            })
    }

    didILikeThisComment() {
        axios.get('http://nbmateus.pythonanywhere.com/postings/did-i-like-post/' + this.state.comment.id + '/', {
            headers: {
                Authorization: Cookies.get('authtoken')
            }
        })
            .then(response => {
                this.setState({
                    iDidLikeThisComment: response.data.didILikePost
                })
            })
            .catch(error => {

            })
    }

    doLikeComment() {
        if (this.state.iDidLikeThisComment) {
            axios.delete('http://nbmateus.pythonanywhere.com/postings/post-detail/' + this.state.comment.id + '/like/', {
                headers: {
                    Authorization: Cookies.get('authtoken')
                }
            })
                .then(response => {
                    var commentUpdated = this.state.comment;
                    commentUpdated.likesCount -= 1;
                    this.setState({
                        iDidLikeThisComment: false,
                        comment: commentUpdated
                    })
                })
                .catch(error => {

                })
        } else {
            axios.post('http://nbmateus.pythonanywhere.com/postings/post-detail/' + this.state.comment.id + '/like/', {}, {
                headers: {
                    Authorization: Cookies.get('authtoken')
                }
            })
                .then(response => {
                    var commentUpdated = this.state.comment;
                    commentUpdated.likesCount += 1;
                    this.setState({
                        iDidLikeThisComment: true,
                        post: commentUpdated
                    })
                })
                .catch(error => {

                })
        }
    }

    confirmDeleteComment() {
        this.setState({
            confirmDelete: true
        }, () => {
            M.Tooltip.init(document.querySelector('#delCommentTooltip' + this.state.comment.id), {});
            M.Tooltip.getInstance(document.querySelector('#delCommentTooltip' + this.state.comment.id)).open();
        })
    }

    deleteComment = (e) => {
        e.preventDefault();
        this.setState({
            deletingComment: true,
        })
        M.Tooltip.getInstance(document.querySelector('#delCommentTooltip' + this.state.comment.id)).close();
        this.props.deleteComment(this.state.comment.id)
    }

    render() {

        var favButton = this.state.iDidLikeThisComment ? (
            <i className="material-icons left red-text" onClick={(e) => {
                e.preventDefault();
                if (this.props.loggedUsername !== "") {
                    this.doLikeComment();
                }
            }}>favorite</i>
        ) : (
                <i className="material-icons left" onClick={(e) => {
                    e.preventDefault();
                    if (this.props.loggedUsername !== "") {
                        this.doLikeComment();
                    }
                }}>favorite_border</i>
            )

        var repostBtn = this.props.loggedUsername !== "" ? (
            <i className="material-icons left modal-trigger" href={"#modalRePostComment" + this.state.comment.id}>repeat</i>
        ) : (
                <i className="material-icons left" onClick={(e) => e.preventDefault()}>repeat</i>
            )

        var imageElement = this.state.comment.image !== null ? (
            <div className="materialboxed card-image waves-effect waves-block waves-light">
                <div className="card-content container">
                    <img alt="" src={this.state.comment.image} />
                </div>

            </div>
        ) : (
                <div></div>
            )
        

        var deleteBtn = <div></div>
        if (this.state.deletingComment) {
            deleteBtn = (
                <div className="preloader-wrapper small active">
                    <div className="spinner-layer spinner-teal-only">
                        <div className="circle-clipper left">
                            <div className="circle"></div>
                        </div><div className="gap-patch">
                            <div className="circle"></div>
                        </div><div className="circle-clipper right">
                            <div className="circle"></div>
                        </div>
                    </div>
                </div>
            )
        } else if (this.props.loggedUsername === this.state.comment.user) {
            deleteBtn = this.state.confirmDelete ? (
                <div className="right">
                    <a href="/#" className="red-text">
                        <i id={'delCommentTooltip' + this.state.comment.id} className="tooltipped right material-icons" data-position="top" data-tooltip="Click it again to delete this comment" onClick={this.deleteComment}>delete</i>
                    </a>
                    <br />
                </div>
            ) : (
                    <div className="right">
                        <a href="/#" className="grey-text">
                            <i className="right material-icons" onClick={(e) => {
                                e.preventDefault();
                                this.confirmDeleteComment()
                            }}>delete</i>
                        </a>
                        <br />
                    </div>
                )
        }

        var userPfpElement = this.state.userProfilePicture !== null ? (
            <img alt="" width="50" height="50" className="circle" src={this.state.userProfilePicture} />
        ) : (
                <img alt="" width="50" height="50" className="circle" src={default_pfp} />
            )


        return (
            <li className="collection-item card">
                <blockquote style={{ borderLeft: "5px solid #009688" }}>
                    <div>
                        <div className="row ">
                            <div className="col s11">
                                <Link to={"/profile/" + this.state.comment.user}>
                                    <b className=" grey-text text-darken-4"><h5 className="valign-wrapper">{userPfpElement}&nbsp;&nbsp;{"@" + this.state.comment.user}</h5></b>
                                </Link>
                            </div>
                            <div className="col s1">
                                {deleteBtn}
                            </div>
                        </div>
                        <p>{this.state.comment.text}</p>
                        {imageElement}
                        <p className="grey-text right">
                            {this.props.formatDate(this.state.comment.timestamp)}
                        </p>
                        <br />
                        <br />
                    </div>
                    <div >
                        <div className="row">
                            <div className="col s6">
                                <a href="/#" className="black-text" onClick={(e) => e.preventDefault()}>{repostBtn}{this.state.comment.sharedCount}</a>
                            </div>
                            <div className="col s6">
                                <a href="/#" className="black-text" onClick={(e) => e.preventDefault()}>{favButton}{this.state.comment.likesCount}</a>
                            </div>
                        </div>
                    </div>
                </blockquote>
                <div id={"modalRePostComment" + this.state.comment.id} className="modal">
                    <PostForm rePost={this.state.comment} updatePostList={() => { return null }} />
                </div>
            </li>
        )
    }
}

export default CommentDetail;