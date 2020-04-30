import React from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import {Link} from 'react-router-dom';

class PostDetail extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            post: this.props.post,
        }
    }

    componentDidMount() {
        this.isRePost();
    }

    postHasImage(post) {
        if (post.image != null) {
            return (
                <div className="card-image waves-effect waves-block waves-light">
                    <br/>
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


    render() {
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
                            <Link to={"/profile/"+this.state.post.rePost.user}><span className="card-title grey-text text-darken-4">@{this.state.post.rePost.user}</span></Link>
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
                        {this.formatDate(this.state.post.timestamp)}
                    </p>
                    <Link to={"/profile/"+this.state.post.user}><span className="card-title grey-text text-darken-4">@{this.state.post.user}</span></Link>
                    <p>{this.state.post.text}</p>
                    {this.postHasImage(this.state.post)}
                    {rePostDiv}
                </div>
                <div className="card-action">
                    <div className="row">
                        <div className="col s4">
                            <a className="black-text"><i className="material-icons ">chat_bubble_outline</i></a>
                        </div>
                        <div className="col s4">
                            <a className="black-text"><i className="material-icons left">repeat</i>{this.state.post.sharedCount}</a>
                        </div>
                        <div className="col s4">
                            <a className="black-text"><i className="material-icons left">favorite_border</i>{this.state.post.likesCount}</a>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default PostDetail;