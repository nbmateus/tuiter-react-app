import React from 'react'
import PostList from './PostList'
import PostForm from './PostForm'
import axios from 'axios'
import Cookies from 'js-cookie'

class Home extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            userLoggedIn: this.props.loggedIn,
            loggedUsername: props.loggedUsername,
            postList: [],
            postListNextPage: null,
            listLoaded: false,

        }
        this.updatePostList = this.updatePostList.bind(this)
        this.deletePost = this.deletePost.bind(this)
    }

    componentDidMount() {
        if (this.state.userLoggedIn) {
            this.getPostList()
        }
    }


    componentDidUpdate() {
        if (this.state.userLoggedIn !== this.props.loggedIn) {
            this.setState({
                userLoggedIn: this.props.loggedIn
            })
        }
        if (this.state.userLoggedIn && !this.state.listLoaded) {
            this.getPostList()
        }
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
        axios.get('http://nbmateus.pythonanywhere.com/postings/index-main-post-list/', {
            headers: {
                Authorization: Cookies.get('authtoken')
            }
        })
            .then(response => {
                this.setState({
                    postList: response.data.results,
                    postListNextPage: response.data.next,
                    listLoaded: true
                })
            })
            .catch(error => {


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

    render() {
        var loadMore = this.state.postListNextPage == null ? (
            <div></div>
        ) : (
                <div className="center">
                    <button className="waves-effect waves-light btn-small" onClick={() => this.loadNextPage()}>Load More</button>
                </div>
            )

        var homeview = this.state.userLoggedIn && this.state.postList ? (
            <div className="grey">
                <PostForm updatePostList={this.updatePostList} />

                <PostList
                    postList={this.state.postList}
                    loggedIn={this.props.loggedIn}
                    loggedUsername={this.props.loggedUsername}
                    updatePostList={this.updatePostList}
                    deletePost={this.deletePost}
                />

                <br />
                {loadMore}
                <br />
            </div>
        ) : (
                <div>about the app</div>
            )
        return (homeview)
    }

}

export default Home;