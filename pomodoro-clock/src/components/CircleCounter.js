import React from 'react';

export default class CircleCounter extends React.Component {

    
  render () {
      
      const { angle, ...props } = this.props
      const rad = 150
      const y = rad - rad * Math.cos(angle)
      const x = rad + rad * Math.sin(angle)
    
      const d = "M" + rad + " 0 A " + rad + " " + rad + " 0 " + (angle > Math.PI ? 1 : 0) + " 1 " + x + " " + y
      return (
          <svg viewBox="0 0 300 300" width="304" height="304">
                <circle cx="150" cy="150" r="150" fill="none" stroke="#fff" strokeWidth="0.25"/>
                
                <path d={d} fill="none" stroke="#fff" strokeWidth="3" />
                <circle cx={x} cy={y} r="2" fill="#fff"/>
                
            </svg>
      )
      
      /*
      const { angle, duration } = this.props
      const rad = 150
      const y = rad - rad * Math.cos(angle)
      const x = rad + rad * Math.sin(angle)
      
      const pathStyle = {
        transitionDuration: this.state.transitionDuration + 's'
      }
    
      const d = "M" + rad + " 0 A " + rad + " " + rad + " 0 " + (angle > Math.PI ? 1 : 0) + " 1 " + x + " " + y
      return (
          <svg viewBox="0 0 300 300" width="304" height="304">
                <circle cx="150" cy="150" r="150" fill="none" stroke="#fff" strokeWidth="0.25"/>
                
                <path className="animated-path" d="M150 0 A 150 150 0 0 1 300 150 A 150 150 0 0 1 150 300 A 150 150 0 0 1 150 0" fill="none" stroke="#fff" strokeWidth="3" style={pathStyle} />
            </svg>
      )
      */
  }
}
