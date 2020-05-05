import React from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'

class PostForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            text: "",
            mainPost: null,
            rePost: props.rePost,
            postStatus: null,
        }
    }

    componentDidMount(){
        this.updateStateOnPropsChange()
    }

    componentDidUpdate(){
        this.updateStateOnPropsChange()
    }

    updateStateOnPropsChange(){
        if(this.props.mainPost && this.props.mainPost !== this.state.mainPost){
            this.setState({
                mainPost: this.props.mainPost
            })
        }
        if(this.props.rePost && this.props.rePost !== this.state.rePost){
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
                this.setState({
                    text: "",
                    mainPost: null,
                    rePost: null,
                },() => { 
                    this.props.updatePostList() })

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
                            <input placeholder="What are you thinking?..." value={this.state.text} id="text" type="text" className="validate" required maxLength="300" onChange={this.handleChange} />
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