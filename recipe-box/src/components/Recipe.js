import React from "react";
import {Panel, ButtonGroup, Button} from "react-bootstrap";
import RecipeIngredients from "./RecipeIngredients";

export default class Recipe extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const footer = <ButtonGroup bsStyle="text-right">
                    <Button bsStyle="default" onClick={this.props.editRecipe}>Edit</Button>
                    <Button bsStyle="danger" onClick={this.props.removeRecipe}>Delete</Button>
                  </ButtonGroup>;

    return <Panel fill collapsible defaultExpanded={false} header={<h3>{this.props.name}</h3>} footer={footer} bsStyle="primary">
            <RecipeIngredients name={this.props.name} ingredients={this.props.ingredients} />
          </Panel>;
  }
}
