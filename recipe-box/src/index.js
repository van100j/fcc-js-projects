import React from "react";
import {render} from "react-dom";
import localforage from "localforage";

import Recipe from "./components/Recipe";
import Header from "./components/Header";
import RecipeForm from "./components/RecipeForm"

const STORAGE_KEY = '_user_recipes';
const getUserRecipes = (key) => {
    return localforage.getItem(key);
}
const saveUserRecipes = (key, value) => {
    return localforage.setItem(key, value);
}

class RecipeBox extends React.Component {

    constructor(props) {

        super(props);
        this.state = {
            recipe: {
              name: '',
              ingredients: []
            },
            recipeIx: -1,
            showForm: false,
            recipes: []
        };
    }

    componentDidMount() {

        getUserRecipes(STORAGE_KEY).then((response) => {

            if (!response) {
                const recipes = [
                    {
                        name: 'Pizza',
                        ingredients: [
                            "1 1/2 cups warm water (105°F-115°F)",
                            "1 package (2 1/4 teaspoons) of active dry yeast",
                            "3 1/2 cups bread flour",
                            "2 Tbsp olive oil",
                            "2 teaspoons salt",
                            "1 teaspoon sugar"
                        ]
                    }, {
                        name: "Pancakes",
                        ingredients: ["100g plain flour", "Pinch of salt", "1 Bord Bia Quality Assured egg", "300 ml milk", "1 tablsp. melted butter or sunflower oil"]
                    }
                ];

                saveUserRecipes(STORAGE_KEY, recipes)
                  .then((recipes) => {
                    this.setState({recipes});
                  })

            } else {

                this.setState({recipes: response});
            }
        }).catch((error) => {
            console.log(error);
        });

    }

    closeModalForm() {
      this.setState({
        showForm: false
      })
    }

    newRecipe() {
      this.setState({
        recipe: {
          name: '',
          ingredients: []
        },
        recipeIx: -1,
        showForm: true
      });
    }

    editRecipe(ix) {
      const {recipes} = this.state;
      this.setState({
        recipe: Object.assign({}, (recipes.slice(ix, ix + 1))[0] ),
        recipeIx: ix,
        showForm: true
      });
    }

    updateRecipeName(event) {
      const {recipe} = this.state;
      recipe.name = event.target.value;
      this.setState({
        recipe
      })
    }

    updateRecipeIngredients(event) {
      const {recipe} = this.state;
      recipe.ingredients = event.target.value.split(",");
      this.setState({
        recipe
      })
    }

    saveRecipe(ix) {
      const {recipes, recipeIx, recipe} = this.state;
      if(recipeIx === -1) { // add new
        saveUserRecipes(STORAGE_KEY, [...recipes, recipe])
          .then((value) => {
            this.setState({
              recipes: value
            });
          })
          .catch((error) => {
            console.log('Error while saving to local storage:', error);
          })
      } else { // update
        saveUserRecipes(STORAGE_KEY, [...recipes.slice(0, recipeIx), recipe, ...recipes.slice(recipeIx + 1)])
          .then((value) => {
            this.setState({
              recipes: value
            });
          })
          .catch((error) => {
            console.log('Error while updating local storage:', error);
          })
      }

      this.closeModalForm();
    }

    deleteRecipe(ix) {
      const {recipes} = this.state;

      saveUserRecipes(STORAGE_KEY, [...recipes.slice(0, ix), ...recipes.slice(ix + 1)])
        .then((value) => {
          this.setState({
            recipes: value
          });
        })
        .catch((error) => {
          console.log('Error while updating local storage:', error);
        });
    }

    render() {
        const {recipes, recipe, recipeIx} = this.state;
        return (
            <div>
              <Header addNewRecipe={() => this.newRecipe()} />
              {
                recipes.map((recipe, ix) => {
                  return <Recipe
                            {...recipe}
                            removeRecipe={() => this.deleteRecipe(ix)}
                            editRecipe={() => this.editRecipe(ix)}
                            key={"recipe-" + ix} />
                })
              }
              <RecipeForm
                show={this.state.showForm}
                recipeIx={recipeIx}
                recipe={recipe}
                changeName={(input) => this.updateRecipeName(input)}
                changeIngredients={(input) => this.updateRecipeIngredients(input)}
                changeRecipe={() => this.saveRecipe(recipeIx)}
                closeForm={() => this.closeModalForm()} />

            </div>
        )
    }
}

render(
    <RecipeBox/>, document.getElementById('app'));
