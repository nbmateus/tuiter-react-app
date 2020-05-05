import React from 'react';
import PostDetail from './PostDetail';

class PostList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            postList: props.postList
        }
        this.updatePostList = this.updatePostList.bind(this)
    }

    updatePostList() {
        this.props.updatePostList()
    }


    componentDidUpdate() {
        if (this.state.postList !== this.props.postList) {
            this.setState({
                postList: this.props.postList
            })
        }
    }

    render() {

        return (
            <ul className="collection">
                {this.state.postList.map((post) => {
                    return (
                        <li key={post.id}>
                            <PostDetail
                                key={post.id}
                                post={post}
                                loggedIn={this.props.loggedIn}
                                loggedUsername={this.props.loggedUsername}
                                updatePostList={this.updatePostList}
                                deletePost={this.props.deletePost}
                            />
                        </li>
                    )
                })}
            </ul>
        )
    }
}

export default PostList;