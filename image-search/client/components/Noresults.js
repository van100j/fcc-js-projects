import React from 'react';

export default function Results(props) {

  return <div className="noresults">
          No results found! Try searching again, or the recent searches:
          <ul>
          {
            props.recent.map( r => r.search !== props.query
              ? <li key={r.search}>
                  <span
                    className="recent"
                    onClick={e => props.onSetQuery(r.search)}>{r.search}</span>
                </li>
              : ''  
            )
          }
        </ul>
        </div>
}
