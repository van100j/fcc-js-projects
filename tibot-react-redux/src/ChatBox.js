import React from 'react';

const ChatBox = ({userMsg, sessionId, onUserInput, onSubmitQuery}) => (
  <div className="chat-input">
    <form onSubmit={event => onSubmitQuery(event, userMsg, sessionId)}>
      <input name="userMsg" className="chat-input-text" type="text" placeholder="Ask something..." value={userMsg} onChange={onUserInput} />
    </form>
  </div>
)

export default ChatBox;
