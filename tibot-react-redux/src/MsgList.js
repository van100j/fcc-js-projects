import React, { Component } from 'react';
import Msg from './Msg'
import { connect } from "react-redux";

class MsgList extends Component {
  render() {
    const { botIsTyping, msgs } = this.props;

    return (
      <ul className="msgs">
        { msgs.map((msg, ix) => <Msg key={`msg-${ix}`} msg={msg} />) }

        {
          botIsTyping
            ? (
              <li className="bot">
                <span className="dot">.</span>
                <span className="dot">.</span>
                <span className="dot">.</span>
              </li>
            ) : ''
        }
      </ul>
    )
  }
}

const mapStateToProps = state => {
  return {
    msgs: state.msgs,
    botIsTyping: state.botIsTyping
  };
};

export default connect(mapStateToProps)(MsgList);
