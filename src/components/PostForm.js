import React from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'

class PostForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            text: "",
            image: null,
            mainPost: null,
            rePost: null,
            postStatus: null,
        }
    }

    componentDidMount() {
        this.updateStateOnPropsChange()
    }

    componentDidUpdate() {
        this.updateStateOnPropsChange()
    }

    updateStateOnPropsChange() {
        if (this.props.mainPost && this.props.mainPost !== this.state.mainPost) {
            this.setState({
                mainPost: this.props.mainPost
            })
        }
        if (this.props.rePost && this.props.rePost !== this.state.rePost) {
            this.setState({
                rePost: this.props.rePost
            })
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
        var form_data = new FormData();
        if (this.state.image !== null) {
            form_data.append('image', this.state.image, this.state.image.name);
        }
        form_data.append('text', this.state.text);
        if(this.state.mainPost !== null){
            form_data.append('mainPost', this.state.mainPost);
        }
        if(this.state.rePost !== null){
            form_data.append('rePost', this.state.rePost);
        }        
        
        console.log(form_data)
        axios.post('http://nbmateus.pythonanywhere.com/postings/create-post/', form_data, {
            headers: {
                Authorization: Cookies.get('authtoken')
            }
        })
            .then(response => {
                console.log("RESPONSE ",response)
                this.setState({
                    text: "",
                    image: null,
                    mainPost: null,
                    rePost: null,
                }, () => {
                    this.props.updatePostList()
                })

            })
            .catch(error => {
            })

    }

    render() {



        return (
            <div className="row">
                <div className="card">
                    <div className="card-content">
                        <form onSubmit={this.handleSubmit}>
                            <input placeholder="What are you thinking?..." value={this.state.text} id="text" type="text" required maxLength="300" onChange={this.handleChange} />
                            <div className="file-field input-field">
                                <div className="waves-effect waves-light btn-small">
                                    <span>Image</span>
                                    <input type="file" onChange={this.handleImageUpload} />
                                </div>
                                <div className="file-path-wrapper">
                                    <input className="file-path validate" type="text" />
                                </div>
                            </div>
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