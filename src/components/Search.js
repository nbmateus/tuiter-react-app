import React from 'react'
import axios from 'axios'
import SearchResult from './SearchResult'

class Search extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            searchInput: props.match.params.search_input,
            searchResults: [],
            numberOfResults: 0,
            resultsNextPage: null,
            componentLoaded: false,
        }
    }

    componentDidMount() {
        this.getSearchResults()
    }

    componentDidUpdate() {
        if (this.state.searchInput !== this.props.match.params.search_input) {
            this.setState({
                searchInput: this.props.match.params.search_input,
                searchResults: [],
                numberOfResults: 0,
                resultsNextPage: null,
                componentLoaded: false,
            }, () => { this.getSearchResults() })
        }

    }

    getSearchResults() {
        axios.get('http://nbmateus.pythonanywhere.com/accounts/profile-list/?search=' + this.state.searchInput)
            .then(response => {
                this.setState({
                    searchResults: response.data.results,
                    numberOfResults: response.data.count,
                    resultsNextPage: response.data.next,
                    componentLoaded: true,
                })
            })
            .catch(error => {

            })
    }

    loadNextPage() {
        axios.get(this.state.resultsNextPage)
            .then(response => {
                this.setState({
                    searchResults: [...this.state.searchResults, ...response.data.results],
                    resultsNextPage: response.data.next,
                })
            })
            .catch(error => {
            })
    }


    render() {

        var loadMore = this.state.resultsNextPage == null ? (
            <div></div>
        ) : (
                <div className="center">
                    <button className="waves-effect waves-light btn-small" onClick={() => this.loadNextPage()}>Load More</button>
                </div>
            )

        var searchResultsDiv = (
            <div className="progress">
                <div className="indeterminate"></div>
            </div>
        )

        if (this.state.componentLoaded) {
            if (this.state.searchResults.length) {
                searchResultsDiv = (
                    <div>
                        <ul className="collection">
                            {this.state.searchResults.map((result) => {
                                return (
                                    <SearchResult key={result.id} {...this.props} result={result} />
                                )
                            })}
                        </ul>
                    </div>
                
                )
            } else {
                searchResultsDiv = (
                    <div className="center">
                        <h4>{"we couldn't found any user."}</h4>
                    </div>
                )
            }
        }

        return (
            <div className="container">
                <div className="white-text center"><br />{this.state.numberOfResults + " results."}</div>
                {searchResultsDiv}
                {loadMore}
            </div>

        )
    }
}

export default Search;