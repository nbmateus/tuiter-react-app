import React from 'react'
import default_pfp from '../assets/default_pfp.jpg'

class SearchResult extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            result: props.result
        }
    }

    render() {
        var profilePictureUrl = this.state.result.profilePicture !== null ? (this.state.result.profilePicture) : (default_pfp)
        
        return (
            <li className="collection-item avatar" onClick={()=>{this.props.history.push('/profile/'+this.state.result.user)}}>
                <img src={profilePictureUrl} alt="" className="circle"/>
                <h6><b>{this.state.result.fullname}</b></h6>
                <h6>{"@"+this.state.result.user}</h6>
            </li>
        )
    }
}

export default SearchResult;