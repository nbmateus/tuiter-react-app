import React from 'react'

class Footer extends React.Component {
    render() {
        return (
            <footer className="page-footer teal z-depth-5">
                <div className="container">
                    <div className="row">
                        <div className="col l6 s12">
                            <h5 className="white-text">About Tuiter</h5>
                            <p className="grey-text text-lighten-4">Learning React and Django REST Framework is the reason why this project was created.
                            The idea was based on Twitter and its main functionality:
                             registered users can post short texts or images in their own profiles. They can also follow other users and comment
                             on their posts.</p>
                        </div>
                        <div className="col l4 offset-l2 s12">
                            <h5 className="white-text">Github Repositories</h5>
                            <ul>
                                <li>
                                    <a className="grey-text text-lighten-3" href="https://github.com/nbmateus/tuiter-react-app" target="_blank" rel="noopener noreferrer">
                                        <i className="material-icons">link</i> Tuiter-React-app</a>
                                </li>
                                <li>
                                    <a className="grey-text text-lighten-3" href="https://github.com/nbmateus/tuiter-django-rest-api" target="_blank" rel="noopener noreferrer">
                                        <i className="material-icons">link</i> Tuiter-Django-REST-API</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </footer >
        )
    }
}

export default Footer