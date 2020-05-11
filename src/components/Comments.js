import React from 'react'
import { Link } from 'react-router-dom'
import CommentDetail from './CommentDetail'
import PostForm from './PostForm'


class Comments extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            post: props.post,
            comments: props.comments,
            moreCommentsAvailable: props.moreCommentsAvailable
        }
        this.formatDate = this.formatDate.bind(this)
    }

    componentDidUpdate() {
        if (this.state.comments !== this.props.comments || this.state.moreCommentsAvailable !== this.props.moreCommentsAvailable) {
            this.setState({
                comments: this.props.comments,
                moreCommentsAvailable: this.props.moreCommentsAvailable
            })
        }
    }

    formatDate(date) {
        var options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: false, };
        return new Date(date).toLocaleDateString([], options);
    }

    loadMoreComments() {
        this.props.loadMoreComments();
    }

    render() {

        var loadMoreComments = !this.state.moreCommentsAvailable ? (
            <div></div>
        ) : (
                <div className="center">
                    <button className="waves-effect waves-light btn-small" onClick={() => this.loadMoreComments()}>Load More</button>
                </div>
            )

        return (
            <div className="modal white" id={this.state.post.id + "comments"}>
                <div className="card-content">
                    <p className="grey-text right">
                        {this.formatDate(this.state.post.timestamp)}
                    </p>
                    <Link to={"/profile/" + this.state.post.user}><span className="card-title grey-text text-darken-4">@{this.state.post.user}</span></Link>
                    <div className="modal-trigger" href={"#" + this.state.post.id + "comments"}>{this.state.post.text}</div>
                </div>
                <div className="card-action">
                    <div className="row">
                        <div className="col s4">
                            <a href="/#" className="black-text"><i className="material-icons ">chat_bubble_outline</i></a>
                        </div>
                        <div className="col s4">
                            <a href="/#" className="black-text"><i className="material-icons left">repeat</i>{this.state.post.sharedCount}</a>
                        </div>
                        <div className="col s4">
                            <a href="/#" className="black-text"><i className="material-icons left">favorite_border</i>{this.state.post.likesCount}</a>
                        </div>
                    </div>
                </div>
                <div>
                    <PostForm updatePostList={this.props.updateCommentList} mainPost={this.state.post.id} />
                </div>
                <div>
                    <ul className="collection">
                        {this.state.comments.map((comment) => {
                            return (
                                <CommentDetail
                                    key={comment.id}
                                    comment={comment}
                                    formatDate={this.formatDate}
                                    deleteComment={this.props.deleteComment}
                                    loggedUsername={this.props.loggedUsername}
                                />
                            )
                        })}
                    </ul>
                </div>
                {loadMoreComments}
            </div>
        )
    }
}

export default Comments;