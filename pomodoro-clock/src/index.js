import React from 'react';
import {render} from 'react-dom';

class PomodoroClock extends React.Component {
  
  constructor(props) {
    super(props);
      
    this.state = {
        started: false,
        finished: false,
        currentState: 'session', /* session or pause (break) */
        ellapsedTime: 0,
        session: 25 * 60, /* seconds */
        pause: 5 * 60 /* seconds */
    }
  }
    
  updateTime(increase, time) {
    let {started, session, pause} = this.state
    
    if(started) {
        return;
    } else {
        
        if(time == 'session') {
            session += increase * 60
            session = session < 60 ? 60 : session
            this.setState({session: session})
        } else {
            pause += increase * 60
            pause = pause < 60 ? 60 : pause
            this.setState({pause: pause})
        }
    }
  }
    
  startSession() {
    if(this.timer) {
        clearInterval(this.timer)
    }
    this.timer = setInterval(this.tick.bind(this), 1000)
    this.setState({ started: true })
  }

  stopSession() {
    this.setState({
        started: false,
        finished: false,
        currentState: 'session', 
        ellapsedTime: 0
    })
    
    clearInterval(this.timer)
  }
  
  tick () {
    const {ellapsedTime, currentState, session, pause} = this.state
        
    if(currentState == 'session') {
        if(ellapsedTime >= session) {
            this.setState({
                ellapsedTime: 0,
                currentState: 'pause'
            })
        } else {
            this.setState({ ellapsedTime: ellapsedTime + 1})
        }
    } else {

        if(ellapsedTime >= pause) {
            this.setState({
                finished: true,
                started: false,
                currentState: 'session', 
                ellapsedTime: 0,
                session: 25 * 60, 
                pause: 5 * 60 
            })

            clearInterval(this.timer)
        } else {
            this.setState({ ellapsedTime: ellapsedTime + 1})
        }
    }
    
  }

  render () {
    
    const { currentState, finished, started, session, pause, ellapsedTime } = this.state
    
    const remainingSecs = (session - ellapsedTime) % 60
    const displayValue = Math.floor( (session - ellapsedTime) / 60 ) + ':' + ( remainingSecs < 10 ? '0' : '' ) + remainingSecs;
    const sessionDisplay = Math.floor( session / 60) 
    const pauseDisplay = Math.floor( pause / 60) 
    
    const angle = ellapsedTime / session  * 2 * Math.PI
    
    const wrapperStyle = {
        backgroundColor: currentState == 'session' ? '#3f51b5' : '#0b7fff'
    }
    
    return (
         <div className="wrapper" style={wrapperStyle}>
            <div className="clock-wrapper">
                <div className="settings">
                    <div className="settings-group">
                        <div className="settings-title">BREAK</div>
                        <button className="settings-button" onClick={() => this.updateTime(-1, 'pause')}>-</button>
                        <span className="seetings-label">{pauseDisplay}</span>
                        <button className="settings-button" onClick={() => this.updateTime(1, 'pause')}>+</button>
                    </div>

                    <div className="settings-group">
                        <div className="settings-title">SESSION</div>
                        <button className="settings-button" onClick={() => this.updateTime(-1, 'session')}>-</button>
                        <span className="seetings-label">{sessionDisplay}</span>
                        <button className="settings-button" onClick={() => this.updateTime(1, 'session')}>+</button>
                    </div>
                </div>

                <div className="circle">
                    <svg viewBox="0 0 300 300" width="300" height="300">
                        <circle cx="150" cy="150" r="150" fill="none" stroke="#fff" strokeWidth="0.25"/>
                    </svg>

                    <div className="time-display">
                        <span className="time-display-title">{currentState == 'pause' ? 'BREAK' : 'SESSION'}</span>
                        <span>{displayValue}</span>
                    </div>

                </div>

                <div className="control-buttons">
                { 
                    started ?
                    <svg viewBox="0 0 48 48" onClick={() => this.stopSession()}>
                        <path d="M41,7v34H7V7H41z"/>
                    </svg> :
                    <svg viewBox="0 0 48 48" onClick={() => this.startSession()}>
                        <path d="M37.803,23.998L11,41.869V6.131L37.803,23.998z"/>
                    </svg>
                }
                </div>
            </div>
        </div>
    )
  }
}

render(<PomodoroClock/>, document.getElementById('app'));
