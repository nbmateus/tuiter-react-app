import React from 'react'
import PostList from './PostList'

class Home extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            userLoggedIn: this.props.loggedIn
        }
    }

    componentDidUpdate() {
        if (this.state.userLoggedIn != this.props.loggedIn) {
            this.setState({
                userLoggedIn: this.props.loggedIn
            })
        }
    }

    render() {
        var homeview = this.state.userLoggedIn ? (
            <div className="container grey">
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