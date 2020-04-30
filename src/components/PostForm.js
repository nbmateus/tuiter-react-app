import React from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'

class PostForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            text: "",
            mainPost: null,
            rePost: null,
            postStatus: null,
        }
    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://nbmateus.pythonanywhere.com/postings/create-post/', {
            text: this.state.text,
            mainPost: this.state.mainPost,
            rePost: this.state.rePost
        }, {
            headers: {
                Authorization: Cookies.get('authtoken')
            }
        })
            .then(response => {
                console.log("envie post")
                this.setState({
                    text: "",
                    mainPost: null,
                    rePost: null,
                    postStatus: "Your post has been published!",
                },() => { 
                    console.log("voy a actualizar lista");
                    this.props.updatePostList() })

            })
            .catch(error => {
                console.log("ERROR ",error.response)
            })

    }

    render() {

        var postStatusMessage = this.state.postStatus !== null ? (
            <ul className="collection container">
                <a href="#!" className="collection-item active green lighten-2 center">{this.state.postStatus}</a>
            </ul>
        ) : (
            <div></div>
        )

        return (
            <div className="row">
                <div className="card">
                    <div className="card-content">
                        {postStatusMessage}
                        <form onSubmit={this.handleSubmit}>
                            <input placeholder="What are you thinking?..." value={this.state.text} id="text" type="text" className="validate" minLength="1" maxLength="300" onChange={this.handleChange} />
                            <br />
                            <br />
                            <button className="waves-effect waves-light btn-small">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default PostForm;