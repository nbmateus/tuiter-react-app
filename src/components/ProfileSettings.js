import React from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import default_pfp from '../assets/default_pfp.jpg'

class ProfileSettings extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            username: props.loggedUsername,
            fullname: "",
            description: "",
            profilePictureUrl: null,
            profilePictureFile: null,
            isPrivate: false,
            old_password: "",
            new_password1: "",
            new_password2: "",
            passwordChangeStatus: null,
            profileChangesStatus: null,
            passwordChangeError: "",
            componentLoaded: false,


        }
    }

    componentDidMount() {
        window.scrollTo(0, 0)
        this.getProfile()
    }

    componentDidUpdate() {
        if (this.props.loggedUsername !== this.state.username) {
            if (this.props.loggedUsername === "") {
                this.props.history.push('/')
            } else {
                this.setState({
                    username: this.props.loggedUsername
                }, () => { this.getProfile() })
            }

        }
    }




    getProfile() {
        axios.get('http://nbmateus.pythonanywhere.com/accounts/profile/' + this.state.username + '/')
            .then(response => {
                this.setState({
                    fullname: response.data.fullname,
                    profilePictureUrl: response.data.profilePicture,
                    description: response.data.description,
                    isPrivate: response.data.isPrivate,
                    componentLoaded: true
                })
            })
            .catch(error => {

            })
    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value,
        })
    }

    handleSwitch = (e) => {
        this.setState({
            isPrivate: e.target.checked
        })
    }

    handleImageUpload = (e) => {
        if (e.target.files.length) {
            this.setState({
                profilePictureFile: e.target.files[0],
                profilePictureUrl: URL.createObjectURL(e.target.files[0])
            })
        } else {
            this.setState({
                profilePictureFile: null,
                profilePictureUrl: null
            })
        }
    }

    handleSubmitProfileChanges = (e) => {
        e.preventDefault();
        this.setState({
            profileChangesStatus: "loading"
        })
        this.sendProfileChanges()

    }

    sendProfileChanges() {
        var form_data = new FormData();
        if (this.state.profilePictureFile !== null) {
            form_data.append('profilePicture', this.state.profilePictureFile, this.state.profilePictureFile.name);
        }
        form_data.append('fullname', this.state.fullname);
        form_data.append('description', this.state.description);
        form_data.append('isPrivate', this.state.isPrivate);

        axios.put('http://nbmateus.pythonanywhere.com/accounts/profile/' + this.state.username + '/update/', form_data, {
            headers: {
                Authorization: Cookies.get('authtoken')
            }
        })
            .then(response => {
                this.setState({
                    profileChangesStatus: "done",
                    passwordChangeError: "",
                    passwordChangeStatus: null,
                })
            })
            .catch(error => {
            })
    }

    handleSubmitPasswordChange = (e) => {
        e.preventDefault();
        this.setState({
            passwordChangeStatus: "loading"
        })
        axios.post('http://nbmateus.pythonanywhere.com/accounts/password/change/', {
            old_password: this.state.old_password,
            new_password1: this.state.new_password1,
            new_password2: this.state.new_password2
        }, {
            headers: {
                Authorization: Cookies.get('authtoken')
            }
        })
            .then(response => {
                this.setState({
                    old_password: "",
                    new_password1: "",
                    new_password2: "",
                    passwordChangeStatus: "done",
                    passwordChangeError: "",
                    profileChangesStatus: null,
                })
            })
            .catch(error => {
                var fieldError = "";
                if (error.response.data.old_password) {
                    fieldError = "Old Password: " + error.response.data.old_password
                }
                else if (error.response.data.new_password1) {
                    fieldError = "New Password: " + error.response.data.new_password1
                }
                else if (error.response.data.new_password2) {
                    fieldError = "Confirm New Password: " + error.response.data.new_password2
                }
                this.setState({
                    passwordChangeStatus: "error",
                    passwordChangeError: fieldError,
                    profileChangesStatus: null,
                })
            })
    }


    render() {

        var profileChangesStatusDiv = <div></div>
        var passwordChangeStatusDiv = <div></div>

        ///profileChangesStatusDiv 
        if (this.state.profileChangesStatus === "loading") {
            profileChangesStatusDiv = (
                <div className="progress">
                    <div className="indeterminate"></div>
                </div>
            )
        }
        if (this.state.profileChangesStatus === "done") {
            profileChangesStatusDiv = (
                <div>
                    <h6 className="green-text">Profile Updated</h6>
                    <br />
                </div>
            )
        }

        ///passwordChangeStatusDiv
        if (this.state.passwordChangeStatus === "loading") {
            passwordChangeStatusDiv = (
                <div className="progress">
                    <div className="indeterminate"></div>
                </div>
            )
        }
        if (this.state.passwordChangeStatus === "done") {
            passwordChangeStatusDiv = (
                <div>
                    <h6 className="green-text">Password Changed</h6>
                    <br />
                </div>
            )
        }
        if (this.state.passwordChangeStatus === "error") {
            passwordChangeStatusDiv = (
                <div>
                    <h6 className="red-text">{this.state.passwordChangeError}</h6>
                    <br />
                </div>

            )
        }

        var profilePictureElement = this.state.profilePictureUrl == null ? (
            <img alt="" width="150" height="150" className="circle" src={default_pfp} />
        ) : (
                <img alt="" width="150" height="150" className="circle" src={this.state.profilePictureUrl} />
            )



        var componentView = !this.state.componentLoaded ? (
            <div className="progress">
                <div className="indeterminate"></div>
            </div>
        ) : (
                <div className="card-panel">
                    <form onSubmit={this.handleSubmitProfileChanges}>
                        <h4>Profile Settings</h4>
                        {profileChangesStatusDiv}
                        {profilePictureElement}
                        <div className="file-field input-field">
                            <div className="waves-effect waves-light btn-small">
                                <span>Profile Picture</span>
                                <input type="file" onChange={this.handleImageUpload} />
                            </div>
                            <div className="file-path-wrapper">
                                <input className="file-path validate" type="text" readOnly={true}/>
                            </div>
                        </div>
                        <label htmlFor="fullname">Fullname</label>
                        <input id="fullname" type="text" className="validate" maxLength="30" value={this.state.fullname} onChange={this.handleChange} />
                        <label htmlFor="description">Description</label>
                        <input id="description" type="text" className="validate" maxLength="200" value={this.state.description} onChange={this.handleChange} />
                        <br />
                        <br />
                        <div className="switch">
                            <label>
                                Public Profile
                                <input type="checkbox" checked={this.state.isPrivate} onChange={this.handleSwitch} />
                                <span className="lever"></span>
                                Private Profile
                            </label>
                        </div>
                        <br />
                        <button className="waves-effect waves-light btn-small">Save Profile Changes</button>
                    </form>
                    <br />
                    <li className="divider"></li>
                    <br />
                    <form onSubmit={this.handleSubmitPasswordChange}>
                        <h4 >Password Change</h4>
                        {passwordChangeStatusDiv}
                        <div className="input-field">
                            <input id="old_password" type="password" className="validate" value={this.state.old_password} onChange={this.handleChange} required />
                            <label htmlFor="old_password">Old Password</label>
                        </div>
                        <div className="input-field">
                            <input id="new_password1" type="password" className="validate" value={this.state.new_password1} onChange={this.handleChange} required />
                            <label htmlFor="new_password1">New Password</label>
                        </div>
                        <div className="input-field">
                            <input id="new_password2" type="password" className="validate" value={this.state.new_password2} onChange={this.handleChange} required />
                            <label htmlFor="new_password2">Confirm New Password</label>
                        </div>
                        <br />
                        <button className="waves-effect waves-light btn-small">Save Password Change</button>
                    </form>
                </div>
            )


        return (
            componentView
        )
    }
}

export default ProfileSettings