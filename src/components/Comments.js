import React from 'react'
import CommentDetail from './CommentDetail'
import PostForm from './PostForm'
import PostDetail from './PostDetail'
import axios from 'axios'
import Cookies from 'js-cookie'


class Comments extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            post: {},
            comments: [],
            commentsNextPage: null,
            componentLoaded: false,
        }
        this.formatDate = this.formatDate.bind(this)
        this.updateCommentList = this.updateCommentList.bind(this)
        this.deleteComment = this.deleteComment.bind(this)
        this.deletePost = this.deletePost.bind(this)
    }

    componentDidMount() {
        this.getPost()
    }

    componentDidUpdate() {

    }

    formatDate(date) {
        var options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true, };
        return new Date(date).toLocaleDateString('en-US', options);
    }

    getPost() {
        axios.get('http://nbmateus.pythonanywhere.com/postings/post-detail/' + this.props.match.params.postId + '/', {
            headers: {
                Authorization: Cookies.get('authtoken')
            }
        })
            .then(response => {
                this.setState({
                    post: response.data
                }, () => this.getComments())
            })
            .catch(error => {

            })
    }

    getComments() {
        axios.get(this.state.post.comments, {
            headers: {
                Authorization: Cookies.get('authtoken')
            }
        })
            .then(response => {
                this.setState({
                    comments: response.data.results,
                    commentsNextPage: response.data.next,
                    componentLoaded: true
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

        var loadMoreComments = this.state.commentsNextPage === null ? (
            <div></div>
        ) : (
                <div className="center">
                    <button className="waves-effect waves-light btn-small" onClick={() => this.loadMoreComments()}>Load More</button>
                </div>
            )

        var commentForm = this.props.loggedUsername !== "" ? (
            <PostForm updatePostList={this.updateCommentList} mainPost={this.state.post.id} />
        ) : (
                <div></div>
            )

        var componentView = this.state.componentLoaded ? (
            <div className="grey darken-3">
                <PostDetail
                    post={this.state.post}
                    loggedIn={this.props.loggedUsername !== ""}
                    loggedUsername={this.props.loggedUsername}
                    deletePost={this.props.deletePost}
                />
                <ul className="collection">
                    {this.state.comments.map((comment) => {
                        return (
                            <CommentDetail
                                key={comment.id}
                                comment={comment}
                                formatDate={this.formatDate}
                                deleteComment={this.deleteComment}
                                loggedUsername={this.props.loggedUsername}
                            />
                        )
                    })}
                </ul>
                {commentForm}
                {loadMoreComments}
            </div>
        ) : (
                <div className="progress">
                    <div className="indeterminate"></div>
                </div>
            )

        return (
            componentView
        )
    }
}

export default Comments;