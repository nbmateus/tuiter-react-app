import React from 'react'
import PostList from './PostList'
import PostForm from './PostForm'

class Home extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            userLoggedIn: this.props.loggedIn,
            refresh: false,
        }
        this.updatePostList = this.updatePostList.bind(this)
    }

    componentDidUpdate() {
        if (this.state.userLoggedIn !== this.props.loggedIn) {
            this.setState({
                userLoggedIn: this.props.loggedIn
            })
        }
    }

    updatePostList(){
        this.setState({
            refresh: true
        })
    }

    render() {
        var homeview = this.state.userLoggedIn ? (
            <div className="container grey">
                <PostForm updatePostList={this.updatePostList}/>
                <div>
                    <PostList postListUrl="http://nbmateus.pythonanywhere.com/postings/index-main-post-list/" />
                </div>
            </div>
        ) : (
                <div>about the app</div>
            )
        return (homeview)
    }

}

export default Home;