import React from "react";

export default class GenerationsCounter extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return <div className="generations-counter">Generations: {this.props.generations}</div>
  }
}
