import React, { Component } from 'react';
import Aux from '../../hoc/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
}

class BurgerBuilder extends Component {
    
    state = {
        ingredients: {
            salad: 0,
            bacon: 0,
            cheese: 0,
            meat: 0
        },
        totalPrice: 4,
        purchasable: false
    }

    updatePurchaseState = (ingredients) => {
        const sum = Object.keys(ingredients)
            .map(key => {
                return ingredients[key];
            })
            .reduce((curSum,el) => {
                return curSum+el;
            },0);
        
        this.setState({
            purchasable: sum > 0
        });
    }

    addIngredientHandler = (type) => {
        const oldcount = this.state.ingredients[type];
        const oldPrice = this.state.totalPrice;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = oldcount + 1;


        this.setState({
            totalPrice:  oldPrice + INGREDIENT_PRICES[type],
            ingredients: updatedIngredients
        });
        this.updatePurchaseState(updatedIngredients);
    }

    removeIngredientHandle = (type) => {
        const oldcount = this.state.ingredients[type];
        if (oldcount <= 0) {
            return;
        }
        const oldPrice = this.state.totalPrice;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = oldcount - 1;


        this.setState({
            totalPrice:  oldPrice - INGREDIENT_PRICES[type],
            ingredients: updatedIngredients
        });
        this.updatePurchaseState(updatedIngredients);
    }

    render(){
        const disabledInfo = {
            ...this.state.ingredients
        };
        for (let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <= 0
        }

        return (
            <Aux>
                <Burger ingredients={this.state.ingredients}/>
                <BuildControls 
                    price={this.state.totalPrice}
                    ingredientAdded={this.addIngredientHandler} 
                    ingredientRemoved={this.removeIngredientHandle} 
                    purchasable={this.state.purchasable}
                    disabled={disabledInfo} />
            </Aux>
        );
    }
}

export default BurgerBuilder;