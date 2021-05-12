import React from 'react';
import Result from './Result';
import Noresults from './Noresults';

export default function Results(props) {

  return <div className="results">
            {props.results.length
              ? props.results.map((result, ix) => <Result key={result.id} result={result} />)
              : (
                  !props.loading &&
                  props.started &&
                  <Noresults
                    onSetQuery={props.onSetQuery}
                    query={props.query}
                    recent={props.recent} />
                )
            }
         </div>
}
