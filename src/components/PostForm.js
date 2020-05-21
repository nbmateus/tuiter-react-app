import React from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import M from 'materialize-css'

class PostForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            text: "",
            image: null,
            mainPost: null,
            rePost: null,
            postStatus: null,
            postFormTitle: "Make a Post",
            postFormSubmitting: false,
        }
    }

    componentDidMount() {
        this.updateStateOnPropsChange()
    }

    componentDidUpdate() {
        this.updateStateOnPropsChange()
    }

    updateStateOnPropsChange() {
        if (this.state.postFormTitle !== "Your repost has been published!") {
            if (this.props.mainPost && this.props.mainPost !== this.state.mainPost) {
                this.setState({
                    mainPost: this.props.mainPost,
                    postFormTitle: "Make a Comment"
                })
            }
            if (this.props.rePost && this.props.rePost !== this.state.rePost) {
                this.setState({
                    rePost: this.props.rePost,
                    postFormTitle: "Make a Repost"

                })
            }
        }
    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    handleImageUpload = (e) => {
        if (e.target.files.length) {
            this.setState({
                image: e.target.files[0],
            })
        } else {
            this.setState({
                image: null,
            })
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.setState({
            postFormSubmitting: true
        })
        var form_data = new FormData();
        if (this.state.image !== null) {
            form_data.append('image', this.state.image, this.state.image.name);
        }
        form_data.append('text', this.state.text);
        if (this.state.mainPost !== null) {
            form_data.append('mainPost', this.state.mainPost);
        }
        if (this.state.rePost !== null) {
            form_data.append('rePost', this.state.rePost.id);
        }

        axios.post('http://nbmateus.pythonanywhere.com/postings/create-post/', form_data, {
            headers: {
                Authorization: Cookies.get('authtoken')
            }
        })
            .then(response => {

                var newPostFormTitle = this.state.postFormTitle
                if (newPostFormTitle === "Make a Repost") {
                    newPostFormTitle = "Your repost has been published!"
                }
                this.setState({
                    text: "",
                    image: null,
                    mainPost: null,
                    rePost: null,
                    postFormTitle: newPostFormTitle,
                    postFormSubmitting: false,
                }, () => {
                    this.props.updatePostList();
                    M.textareaAutoResize(document.querySelector('#text'));
                    document.getElementById("imageNameInput").value = ""
                })

            })
            .catch(error => {
            })

    }

    rePostHasImage() {
        if (this.state.rePost.image && this.state.rePost.image !== null) {
            return (
                <div className="materialboxed card-image waves-effect waves-block waves-light">
                    <div className="card-content container">
                        <img alt="" src={this.state.rePost.image} />
                    </div>
                    <br />
                </div>
            )
        }
        else {
            return (<div></div>)
        }
    }

    render() {

        var preloaderElement = this.state.postFormSubmitting ? (
            <div className="progress">
                <div className="indeterminate"></div>
            </div>
        ) : (
            <div></div>
        )

        var rePostDiv = this.state.rePost !== null ? (
            <div className="card">
                <div className="card-content">
                    <span className="card-title grey-text text-darken-4">@{this.state.rePost.user}</span>
                    <p>{this.state.rePost.text}</p>
                    {this.rePostHasImage()}
                </div>
            </div>
        ) : (
                <div></div>
            )

        var postFormView = this.state.postFormTitle === "Your repost has been published!" ? (
            <div className="card">
                <div className="card-content">
                    <span className="center">{this.state.postFormTitle}</span>
                </div>
            </div>
        ) : (
                <div className="card">
                    <div className="card-content">
                        <span className="center card-title">{this.state.postFormTitle}</span>
                        {preloaderElement}
                        <form onSubmit={this.handleSubmit}>
                            <div className="input-field">

                                <textarea className="materialize-textarea" value={this.state.text} id="text" type="textarea" required={this.state.rePost === null} maxLength="300" onChange={this.handleChange} />
                                <label>Type something...</label>
                            </div>
                            <div className="file-field input-field">
                                <div className="waves-effect waves-light btn-small">
                                    <span>Image</span>
                                    <input type="file" onChange={this.handleImageUpload} />
                                </div>
                                <div className="file-path-wrapper">
                                    <input id="imageNameInput" className="file-path validate" type="text" readOnly={true}/>
                                </div>
                            </div>
                            {rePostDiv}
                            <br />
                            <br />
                            <button className="waves-effect waves-light btn-small">Submit</button>
                        </form>
                    </div>
                </div>
            )

        return (
            postFormView
        )
    }
}

export default PostForm;