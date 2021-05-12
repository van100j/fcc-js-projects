// action types
const API_CALL_REQUEST = "API_CALL_REQUEST";
const API_CALL_SUCCESS = "API_CALL_SUCCESS";
const API_CALL_FAILURE = "API_CALL_FAILURE";

const API_LOAD_SESSION = "API_LOAD_SESSION";
const API_LOAD_SESSION_SUCCESS = "API_LOAD_SESSION_SUCCESS";
const API_LOAD_SESSION_FAILURE = "API_LOAD_SESSION_FAILURES";

const USER_INPUT = "USER_INPUT";

// reducer with initial state
const initialState = {
  botIsTyping: false,
  userMsg: '',
  sessionId: null,
  msgs: [{
    type: 'bot',
    msg: '⏰ Hello there, TiBot here. Ask me something about date and time!',
  }],
  error: null
};

export function reducer(state = initialState, action) {
  switch (action.type) {
    case API_CALL_REQUEST:
      return { ...state, botIsTyping: true, error: null, msgs: [ ...state.msgs, action.payload ], userMsg: '' };

    case API_CALL_SUCCESS:
      return {
        ...state,
        botIsTyping: false,
        userMsg: '',
        msgs: [
          ...state.msgs,
          action.payload
        ]
      };

    case API_CALL_FAILURE:
    case API_LOAD_SESSION_FAILURE:
      return { ...state, botIsTyping: false, error: action.error };

    case USER_INPUT:
      return { ...state, userMsg: action.input };

    case API_LOAD_SESSION_SUCCESS:
      return {
        ...state,
        sessionId: action.sessionId
      };

    default:
      return state;
  }
}
