import React from "react";
import {ListGroup, ListGroupItem} from "react-bootstrap";

export default class RecipeIngredients extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <ListGroup fill>
      {
        this.props.ingredients.map((ingredient) => {
          return <ListGroupItem key={this.props.name + ingredient}>{ingredient}</ListGroupItem>
        })
      }
    </ListGroup>;
  }
}
