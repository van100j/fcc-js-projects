import React from 'react';
import {render} from 'react-dom';
import Logo from './components/Logo';
import Loader from './components/Loader';
import Results from './components/Results';
import Pagination from './components/Pagination';
import 'whatwg-fetch';

const searchAPIUrl = '/api/search/';

class ImageSearch extends React.Component {

  constructor() {
      super();

      this.state = {
          searching: false,
          started: false,
          query: '',
          offset: 0,
          total: 0,
          loading: false,
          recent: [],
          results: []
      }

      this.handleChange = this.handleChange.bind(this);
      this.setOffset = this.setOffset.bind(this);
      this.setQuery = this.setQuery.bind(this);
      this.keyPressedDown = this.keyPressedDown.bind(this);
  }

  keyPressedDown(e) {
      const { key } = e;
      const { query } = this.state;

      if(key === 'Enter' && query && query.length > 1) {
        this.searchAPI();
      }
  }

  setOffset(offset) {

    this.setState({offset: offset});
    this.searchAPI(offset);
  }

  setQuery(query) {
    this.setState({ searching: true, query: query, offset: 0 });
    setTimeout( () => this.searchAPI(), 250 );
  }

  searchAPI(offset = 0) {

    const { query } = this.state;

    this.setState({ loading: true });

    const url = searchAPIUrl + query + (offset ? '?offset=' + offset : '');

    fetch(url)
      .then(response => response.json() )
      .then( json => {
        if(json.status) {

          this.setState({
            results: json.data,
            recent: json.recent,
            offset: json.offset,
            total: json.total,
            loading: false,
            started: true
          });

          window.scrollTo(0, 0);
        }

      })
      .catch( err => {
        this.setState({
          loading: false
        });
      })
  }

  componentDidMount() {

    /*
    fetch('/api/recent-search')
      .then(response => response.json() )
      .then( json => {
        this.setState({recent: json.recent});
      })
      .catch( err => {

      });
    */

    document.addEventListener('keydown', this.keyPressedDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.keyPressedDown);
  }

  handleChange(e) {
      const { searching } = this.state;

      this.setState({
          query: e.target.value,
          searching: searching || (e.target.value).length
      });
  }

  render () {
    const {
      searching,
      query,
      results,
      recent,
      loading,
      offset,
      total,
      started } = this.state;

    return (
      <div className={"wrapper " + (searching ? 'searching' : '')}>

          <div className="header">
              <Logo />

              <input type="text"
                     className="search"
                     placeholder="Search Images (enter text &amp; hit Enter)"
                     value={query}
                     onChange={this.handleChange}/>

              <div className="api-linkr">
                {!searching
                  ? <span>Or try popular searches: {['mountains', 'sky', 'stars', 'water', 'desktop'].map(r => <span onClick={e => this.setQuery(r)} key={r} className="recent">{r}</span>)}</span>
                  : (<a target="_blank" href={"/api/search/" + query}>Raw API JSON response</a>)
                }
              </div>
          </div>

          <Results
            results={results}
            recent={recent}
            query={query}
            loading={loading}
            started={started}
            onSetQuery={this.setQuery}
          />

          <Pagination
            onSetOffset={this.setOffset}
            total={total}
            offset={offset} />

          { loading ? <Loader width={100} height={100} /> : '' }

        </div>
    )
  }
}

render(<ImageSearch/>, document.getElementById('app'));
