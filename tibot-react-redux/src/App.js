import React, { Component } from 'react';
import './App.css';
import MsgList from './MsgList';
import ChatBox from './ChatBox'

import { connect } from "react-redux";

class App extends Component {

  componentDidMount() {
    this.props.onLoadSession();
  }

  componentDidUpdate() {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  }

  render() {
    const { userMsg, sessionId, error, onUserInput, onSubmitQuery } = this.props;

    return (
      <div>
        <MsgList />

        <ChatBox userMsg={userMsg} sessionId={sessionId} onUserInput={onUserInput} onSubmitQuery={onSubmitQuery} />

        <div style={{ float:"left", clear: "both" }} ref={(el) => { this.messagesEnd = el; }}></div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    sessionId: state.sessionId,
    userMsg: state.userMsg,
    error: state.error
  };
};

const mapDispatchToProps = dispatch => ({
  onUserInput: (event) => dispatch({
    type: "USER_INPUT",
    input: event.target.value
  }),
  onSubmitQuery: (event, msg, sessionId) => {
    event.preventDefault();

    dispatch({
      type: "API_CALL_REQUEST",
      payload: {
        msg,
        sessionId,
        type: 'user'
      }
    })
  },
  onLoadSession: () => dispatch({ type: 'API_LOAD_SESSION' })
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
