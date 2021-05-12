import React from "react";

export default class Cell extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return <div
              onClick={this.props.handleClickCell}
              className={"cell " + (this.props.alive ? 'alive' : (this.props.baby ? 'baby' : ''))}>
          </div>
  }
}
