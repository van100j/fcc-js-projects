import React, { Component } from 'react';
import moment from 'moment';
import 'moment-timezone';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    //
    // initial state
    //
    this.state = {
      userMsg: '',
      botWaiting: false,
      tsLastUpdate: 0,
      msgs: [{
        type: 'bot',
        msg: '⏰ Hello there, TiBot here. Ask me something about date and time!',
        timestamp: Date.now()
      }]
    };

    this.handleUserChange = this.handleUserChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.scrollToBottom = this.scrollToBottom.bind(this);
    this.pushMsg = this.pushMsg.bind(this);
  }

  scrollToBottom() {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  }

  componentDidMount() {
    this.scrollToBottom();
    this.messageInput.focus();

    const intervalId = setInterval((function() {
      this.setState({ tsLastUpdate: Date.now() })
    }).bind(this), 5000);

    this.setState({ intervalId });

    fetch(`/api/session`)
      .then(result => result.json())
      .then(data => {
        const { msg } = data;

        this.setState({ sessionId: msg, tz: moment.tz.guess() });
      })
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  componentWillUnmount() {
    const { intervalId } = this.state;

    if (intervalId) {
      clearInterval(intervalId);
    }
  }

  pushMsg(msg) {
    const { msgs } = this.state;

    this.setState({
      msgs: [ ...msgs, { ...msg, timestamp: moment() } ]
    })
  }

  handleUserChange(event) {
    this.setState({ userMsg: event.target.value });
  }

  handleSubmit(event) {
    const { userMsg, sessionId, tz } = this.state;

    this.pushMsg({ type: 'user', msg: userMsg });
    this.setState({ userMsg: '', botWaiting: true });

    fetch(`/api/process`, {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({
        sessionId,
        tz,
        type: 'user',
        msg: userMsg,
      })
    })
      .then(result => result.json())
      .then(data => {
        const { msg } = data;

        this.pushMsg({ msg, type: 'bot' });
        this.setState({ botWaiting: false });
      });

    event.preventDefault();
  }

  render() {
    const chatMsgs = this.state.msgs.map((msg, ix) =>
      <li key={`msg-${ix}`} className={msg.type}>
        {msg.msg}
        <small>{moment(msg.timestamp).fromNow()}</small>
      </li>
    );

    const botTyping = this.state.botWaiting
      ? <li className="bot">
          <span className="dot">.</span>
          <span className="dot">.</span>
          <span className="dot">.</span>
        </li>
      : '';

    return (
      <div>
        <ul className="msgs">
          {chatMsgs}
          {botTyping}
        </ul>

        <div style={{ float:"left", clear: "both" }} ref={(el) => { this.messagesEnd = el; }}></div>

        <div className="chat-input">
          <form onSubmit={this.handleSubmit}>
            <input name="userMsg" className="chat-input-text" type="text" placeholder="Ask something..." value={this.state.userMsg} onChange={this.handleUserChange} ref={(el) => { this.messageInput = el; }} />
          </form>
        </div>
      </div>
    );
  }
}

export default App;
