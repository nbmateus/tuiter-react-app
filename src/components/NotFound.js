import React from 'react'

class NotFound extends React.Component {

    render() {
        return (
            <div className="grey darken-3 ">
                <span className="white-text">
                    <br />
                    <h4 className="center">Error 404: Not Found</h4>
                    <h5 className="center">The content that you are looking for does not exist.</h5>
                </span>
            </div>
        )
    }
}

export default NotFound;