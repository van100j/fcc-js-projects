import React from 'react';

const Msg = ({type, msg}) => (
  <li className={msg.type}>
    {msg.msg}
  </li>
)

export default Msg;
