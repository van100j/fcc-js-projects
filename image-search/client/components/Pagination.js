import React from 'react';

export default function Pagination(props) {
  const pages = Array(props.total || 0).fill(0).map((i, ix) => ix);

  return <div className="pagination">
         {pages.length && props.offset > 0
           ? <span className="page previous" onClick={e => props.onSetOffset(props.offset - 1)}>&laquo; Previous</span>
           : ''
         }
         {
           pages.map((p, ix) => <span
                      key={ix}
                      className={"page " + (ix == props.offset ? 'selected' : '')}
                      onClick={e => props.onSetOffset(p)}>{p + 1}</span>)
         }
         {pages.length && props.offset < pages.length - 1
           ? <span className="page next" onClick={e => props.onSetOffset(props.offset + 1)}>Next &raquo;</span>
           : ''
         }
         </div>
}
