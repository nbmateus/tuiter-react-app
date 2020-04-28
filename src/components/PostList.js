import React from 'react';
import PostDetail from './PostDetail';
import axios from 'axios';
import Cookies from 'js-cookie';

class PostList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            posts: [],
            postListUrl: this.props.postListUrl,
            postListNextPage: null,
            contentIsVisible: true,
        }
    }

    componentDidMount() {
        this.setState({
            postListUrl: this.props.postListUrl
        }, () => {
            this.getPostList()
        })
    }

    componentDidUpdate(prevProps) {
        if (this.state.postListUrl !== this.props.postListUrl) {
            this.setState({
                posts: [],
                postListUrl: this.props.postListUrl,
                postListNextPage: null,
                contentIsVisible: true,
            }, () => {
                this.getPostList();
            })
        }
    }

    getPostList() {
        axios.get(this.state.postListUrl, {
            headers: {
                Authorization: Cookies.get('authtoken')
            }
        })
            .then(response => {
                this.setState({
                    posts: response.data.results,
                    postListNextPage: response.data.next
                })
            })
            .catch(error => {
                this.setState({
                    contentIsVisible: false
                })
            })
    }

    loadNextPage() {
        axios.get(this.state.postListNextPage, {
            headers: {
                Authorization: Cookies.get('authtoken')
            }
        })
            .then(response => {
                const array = [...this.state.posts, ...response.data.results]
                this.setState({
                    postListNextPage: response.data.next,
                    posts: array
                })
            })
            .catch(error => {
                console.log("ERROR ", error.response)
            })
    }


    render() {

        var mainPostListView = this.state.contentIsVisible ? (
            <ul className="collection">
                {this.state.posts.map((post) => {
                    return (
                        <li key={post.id}>
                            <PostDetail key={post.id} post={post} />
                        </li>
                    )
                })}
            </ul>
        ) : (
                <div className="card grey">
                    <div className="card-content white-text center">
                        <h4><i className="material-icons">https</i>This profile is private.</h4>
                    </div>
                </div>
            )


        var loadMore = this.state.postListNextPage == null ? (
            <div></div>
        ) : (
                <div className="center">
                    <a className="waves-effect waves-light btn-small" onClick={() => this.loadNextPage()}>Load More</a>
                </div>
            )

        return (
            <div>
                {mainPostListView}
                {loadMore}

            </div>
        )
    }
}

export default PostList;