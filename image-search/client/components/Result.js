import React from 'react';

export default function Result(props) {

  const { result } = props;

  function formatDate(timestamp) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const date = new Date(+timestamp * 1000);
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return month + ' ' + day + ", " + year;
  }

  return <div className="result">
            <h3><a href={result.link} target="_blank">{result.title}</a></h3>
            <div className="result-info">
              <a href={result.link} target="_blank">
                <img src={`https://i.imgur.com/${result.is_album ? result.cover : result.id}b.jpg`}/>
              </a>
              <div className="result-desc">
                <span className="result-link">{result.link}
                  <span className="grey">{!result.is_album ? <span> &middot; {result.width} &times; {result.height}</span> : <span> &middot; Album </span>}</span>
                </span>
                <span className="result-info">
                  {formatDate(result.datetime)} {result.account_url ? <span> &middot; by {result.account_url}</span> : ''}
                </span>
                {result.description}
              </div>
            </div>
          </div>


}
