import React from 'react'
import { Link } from 'react-router-dom'

class CommentDetail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            comment: props.comment
        }
    }

    render() {

        var deleteBtn = this.props.loggedUsername === this.state.comment.user ? (
            <i className="material-icons" onClick={() => {this.props.deleteComment(this.state.comment.id)}}>delete</i>
        ) : (
                <i>asd</i>
            )

        return (
            <li className="collection-item grey lighten-2">
                <div>
                    <p className="grey-text right">
                        {this.props.formatDate(this.state.comment.timestamp)} {deleteBtn}
                    </p>
                    <Link to={"/profile/" + this.state.comment.user}><span className="card-title grey-text text-darken-4">@{this.state.comment.user}</span></Link>
                    <p>{this.state.comment.text}</p>
                </div>
                <div >
                    <div className="row">
                        <div className="col s6">
                            <a href="/#" className="black-text"><i className="material-icons left">repeat</i>{this.state.comment.sharedCount}</a>
                        </div>
                        <div className="col s6">
                            <a href="/#" className="black-text"><i className="material-icons left">favorite_border</i>{this.state.comment.likesCount}</a>
                        </div>
                    </div>
                </div>
            </li>
        )
    }
}

export default CommentDetail;