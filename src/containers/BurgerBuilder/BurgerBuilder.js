import React, { Component } from 'react';
import Aux from '../../hoc/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';

import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler';

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
}

class BurgerBuilder extends Component {
    
    state = {
        ingredients: null,
        totalPrice: 4,
        purchasable: false,
        purchasing: false,
        loading: false,
        errorState: false
    }

    componentDidMount () {
        axios.get('https://react-burger-build-app-b9252-default-rtdb.firebaseio.com/ingredients.json')
            .then(response => {
                this.setState({
                    ingredients: response.data
                })
            })
            .catch(error => {
                this.setState({errorState: true});
            });
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

    purchaseHandler = () => {
        this.setState({purchasing:true});
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing: false});
    }

    purchaseContinueHandler = () => {
        const queryParams = [];
        for(let i in this.state.ingredients){
            queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
        }
        queryParams.push('price='+this.state.totalPrice);
        const queryString = queryParams.join('&');
        this.props.history.push({
            pathname: '/checkout',
            search: '?' + queryString
        });
    }

    render(){
        const disabledInfo = {
            ...this.state.ingredients
        };
        for (let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <= 0
        }

        let orderSummary = null;

        let burger = this.state.errorState ? <p>Ingredient's can't be loaded</p> : <Spinner />;
        if (this.state.ingredients){
        burger = (
            <Aux>
                <Burger ingredients={this.state.ingredients}/>
                <BuildControls 
                    price={this.state.totalPrice}
                    ingredientAdded={this.addIngredientHandler} 
                    ingredientRemoved={this.removeIngredientHandle} 
                    purchasable={this.state.purchasable}
                    disabled={disabledInfo} 
                    ordered={this.purchaseHandler}
                    />
            </Aux>
            );
        orderSummary =  <OrderSummary 
        purchaseCancelled={this.purchaseCancelHandler}
        purchaseContinued={this.purchaseContinueHandler}
        ingredients={this.state.ingredients}
        price={this.state.totalPrice}/>;
        }

        if(this.state.loading) {
            orderSummary = <Spinner />;
        }

        return (
            <Aux>
                <Modal show={this.state.purchasing}
                        modalClosed = {this.purchaseCancelHandler}>
                        {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }
}

export default withErrorHandler(BurgerBuilder,axios);