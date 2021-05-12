import React from "react";
import {Navbar, Nav, NavItem, Button} from "react-bootstrap";

export default class Header extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        return (
            <Navbar fixedTop>
              <Nav pullRight>
                <NavItem>
                  <Button bsStyle="success" onClick={this.props.addNewRecipe}>New Recipe</Button>
                </NavItem>
              </Nav>
            </Navbar>
        )
    }
}
