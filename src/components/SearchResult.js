import React from 'react'

class SearchResult extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            result: props.result
        }
    }

    render() {
        return (
            <li className="collection-item avatar" onClick={()=>{this.props.history.push('/profile/'+this.state.result.user)}}>
                <img src="https://f0.pngfuel.com/png/178/595/black-profile-icon-illustration-user-profile-computer-icons-login-user-avatars-png-clip-art.png" alt="" className="circle"/>
                <h6><b>{this.state.result.fullname}</b></h6>
                <h6>{"@"+this.state.result.user}</h6>
            </li>
        )
    }
}

export default SearchResult;