import React from 'react';
import PostDetail from './PostDetail';

class PostList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            posts: this.props.postList
        }
    }



    render() {
        return (
            <ul className="collection">
                {this.state.posts.map((post) => {
                    return (
                        <li key={post.id}>
                            <PostDetail key={post.id} post={post} />
                        </li>
                    )
                })}
            </ul>
        )
    }
}

export default PostList;