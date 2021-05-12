import React from 'react';
import {render} from 'react-dom';

import fetchJsonp from 'fetch-jsonp';
    

class WikipediaViewer extends React.Component {
  
    constructor() {
        super();
        
        this.state = {
            searching: false,
            query: '',
            articles: {}
        }
    }
    
    keyPressedDown(e) {
        const { key } = e;
        const { query } = this.state;
        
        if(key === 'Enter' && query && query.length > 1) {  
        
            this.searchWikipedia();
        }
    }

    componentDidMount() {
        document.addEventListener('keydown', this.keyPressedDown.bind(this))
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.keyPressedDown)
    }
    
    handleChange(e) {
        const {searching} = this.state
        this.setState({
            query: e.target.value,
            searching: searching || (e.target.value).length
        });
    }
    
    searchWikipedia() {
        const {query} = this.state;
        
        const api = 'https://en.wikipedia.org/w/api.php?format=json&action=query&generator=search&gsrnamespace=0&gsrlimit=10&prop=pageimages|extracts&pilimit=max&exintro&explaintext&exsentences=1&exlimit=max&gsrsearch=';
        
        fetchJsonp(api + query)
            .then((response) => {
                if(response.status >= 400) {
                     throw new Error("Bad response from server");
                }
                return response.json()
            })
            .then((data) => {
                
                this.setState({
                    articles: data.query.pages
                });
            });
    }
    
    render () {
        
        const {searching, articles} = this.state;
        const ixs = Object.keys(articles);
        const results = ixs.map(function(ix) {
            const article = articles[ix];
            return (<div className="article" key={article.pageid}>
                        <div className="article-title">
                            <a target="_blank" href={"https://en.wikipedia.org/?curid=" + article.pageid}>{article.title}</a>
                        </div>
                        <div className="article-excerpt">{article.extract}</div>
                    </div>)
        })

        return (
            <div className={"wrapper " + (searching ? 'searching' : '')}>
                <div className="header" >
                    <img className="logo" width="103" height="94" src="https://upload.wikimedia.org/wikipedia/commons/8/80/Wikipedia-logo-v2.svg"/>
                    <input type="text" className="search" placeholder="Search Wikipedia (enter text &amp; hit Enter)" value={this.state.query} onChange={(event) => this.handleChange(event)} />

                    <div className="button-holder">
                        <a href="https://en.wikipedia.org/wiki/Special:Random" target="_blank" className="button">Random Article</a>
                    </div>
                </div>
                <div className="results">{results}</div>
            </div>
        )
    }
}

render(<WikipediaViewer/>, document.getElementById('app'));
