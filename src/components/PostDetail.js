import React from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import { Link } from 'react-router-dom';
import M from 'materialize-css'
import Comments from './Comments'
import PostForm from './PostForm';

class PostDetail extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            post: this.props.post,
            comments: [],
            commentsNextPage: null,
        }
        this.updateCommentList = this.updateCommentList.bind(this)
        this.loadMoreComments = this.loadMoreComments.bind(this)
        this.deleteComment = this.deleteComment.bind(this)
    }

    componentDidMount() {
        M.Modal.init(document.querySelectorAll('.modal'), {})
        this.isRePost();
    }

    postHasImage(post) {
        if (post.image != null) {
            return (
                <div className="card-image waves-effect waves-block waves-light">
                    <br />
                    <img alt="" src={this.state.post.image} />
                </div>)
        }
        else {
            return (<div></div>)
        }
    }




    formatDate(date) {
        var options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: false, };
        return new Date(date).toLocaleDateString([], options);
    }

    isRePost() {
        var completePost = this.state.post;
        if (this.state.post.rePost != null) {
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

    getComments() {
        console.log("getComments")
        axios.get(this.state.post.comments, {
            headers: {
                Authorization: Cookies.get('authtoken')
            }
        })
            .then(response => {
                console.log("RESPONSE ", response.data)
                this.setState({
                    comments: response.data.results,
                    commentsNextPage: response.data.next
                })
            })
            .catch(error => {

            })
    }

    updateCommentList() {
        this.getComments()
    }

    deleteComment(commentId) {
        axios.delete('http://nbmateus.pythonanywhere.com/postings/post-detail/' + commentId + '/', {
            headers: {
                Authorization: Cookies.get('authtoken')
            }
        })
            .then(response => {
                this.updateCommentList()
            })
            .catch(error => {

            })
    }

    loadMoreComments() {
        axios.get(this.state.commentsNextPage, {
            headers: {
                Authorization: Cookies.get('authtoken')
            }
        })
            .then(response => {
                this.setState({
                    comments: [...this.state.comments, ...response.data.results],
                    commentsNextPage: response.data.next
                })
            })
            .catch(error => {

            })
    }

    render() {

        var deleteBtn = this.props.loggedUsername === this.state.post.user ? (
            <i className="material-icons modal-trigger" href={"#" + this.state.post.id + "deletePost"}>delete</i>
        ) : (
                <i></i>
            )

        var rePostDiv = <div></div>

        if (this.state.post.rePost != null) {
            rePostDiv = this.state.post.rePost === "private_post" ? (
                <div className="card grey">
                    <div className="card-content">
                        <p className="white-text"><i className="material-icons">https</i> This shared content is not visible for you because it belongs to a private profile.</p>
                    </div>
                </div>
            ) : (
                    <div className="card">
                        <div className="card-content">
                            <Link to={"/profile/" + this.state.post.rePost.user}><span className="card-title grey-text text-darken-4">@{this.state.post.rePost.user}</span></Link>
                            <p>{this.state.post.rePost.text}</p>
                            {this.postHasImage(this.state.post)}
                        </div>
                    </div>
                )
        }

        return (
            <div className="card">
                <div className="card-content">
                    <p className="grey-text right">
                        {this.formatDate(this.state.post.timestamp)} {deleteBtn}
                    </p>
                    <Link to={"/profile/" + this.state.post.user}><span className="card-title grey-text text-darken-4">@{this.state.post.user}</span></Link>
                    <div>{this.state.post.text}</div>
                    {this.postHasImage(this.state.post)}
                    {rePostDiv}
                </div>
                <div className="card-action">
                    <div className="row">
                        <div className="col s4">
                            <a className="black-text"><i className="material-icons modal-trigger" href={"#" + this.state.post.id + "comments"} onClick={() => this.getComments()}>chat_bubble_outline</i></a>
                        </div>
                        <div className="col s4">
                            <a className="black-text"><i className="material-icons left modal-trigger" href={"#modalRePost" + this.state.post.id}>repeat</i>{this.state.post.sharedCount}</a>
                        </div>
                        <div className="col s4">
                            <a className="black-text"><i className="material-icons left">favorite_border</i>{this.state.post.likesCount}</a>
                        </div>
                    </div>
                </div>
                <Comments
                    post={this.state.post}
                    comments={this.state.comments}
                    updateCommentList={this.updateCommentList}
                    moreCommentsAvailable={this.state.commentsNextPage != null}
                    loadMoreComments={this.loadMoreComments}
                    deleteComment={this.deleteComment}
                    loggedUsername={this.props.loggedUsername}
                />
                <div id={"modalRePost" + this.state.post.id} className="modal">
                    <PostForm rePost={this.state.post.id} updatePostList={() => { return null }} />
                    <div className="card-content">
                        <p className="grey-text right">
                            {this.formatDate(this.state.post.timestamp)}
                        </p>
                        <span className="card-title grey-text text-darken-4">@{this.state.post.user}</span>
                        <p>{this.state.post.text}</p>
                        {this.postHasImage(this.state.post)}
                        {rePostDiv}
                    </div>
                </div>
                <div id={this.state.post.id + "deletePost"} className="modal">
                    <div className="modal-content center">
                        <h4>Are you sure that you want to delete this post?</h4>
                    </div>
                    <div className="modal-footer">
                        <div className="row">
                            <div className="col s6 center">
                                <button className="modal-close waves-effect waves-light btn" onClick={() => { this.props.deletePost(this.state.post.id) }}>Yes</button>
                            </div>
                            <div className="col s6 center">
                                <button className="modal-close waves-effect waves-light btn">No</button>
                            </div>
                        </div>
                    </div>
                    <br />
                </div>
            </div>

        )
    }
}

export default PostDetail;