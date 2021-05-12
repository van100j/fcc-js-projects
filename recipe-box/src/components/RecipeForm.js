import React from "react";
import {Modal, ModalBody, ModalHeader, ModalTitle, ModalFooter, Button, Form, FormGroup, ControlLabel, FormControl} from "react-bootstrap";

const FieldGroup = ({ id, label, ...props }) => {
  return (
    <FormGroup controlId={id}>
      <ControlLabel>{label}</ControlLabel>
      <FormControl {...props} />
    </FormGroup>
  );
}

export default class RecipeForm extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
      const {recipeIx, recipe} = this.props;

        return (
          <Modal show={this.props.show} onHide={this.props.closeForm}>
            <Modal.Header closeButton>
              <Modal.Title>{recipeIx === -1 ? 'Add' : 'Edit'} Recipe</Modal.Title>
            </Modal.Header>
            <ModalBody>
              <Form>

                <FieldGroup
                  type="text"
                  value={recipe.name}
                  onChange={this.props.changeName}
                  label="Recipe Name"
                  placeholder="Recipe Name" />

                <FieldGroup
                  type="textarea"
                  value={recipe.ingredients.join(",")}
                  onChange={this.props.changeIngredients}
                  label="Recipe Ingredients"
                  placeholder="Recipe Ingredients (comma separated)" />

              </Form>
            </ModalBody>
            <Modal.Footer>
              <Button bsStyle="success" onClick={this.props.changeRecipe}>{recipeIx === -1 ? 'Save' : 'Update'}</Button>
              <Button onClick={this.props.closeForm}>Close</Button>
            </Modal.Footer>
          </Modal>
        )
    }
}
