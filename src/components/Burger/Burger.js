import React from 'react';
import classes from './Burger.css';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';

const burger = (props) => {
    const objectIngredients = {...props.ingredients};
    const arrayIngredients = Object.entries(objectIngredients);
    let transormedIngredients = arrayIngredients
    .map((value) => {
        return [...Array(value[1])]
        .map((_,i) => {
            return <BurgerIngredient key={value[0]+i} type={value[0]} />;
        })
    }).filter(e => e.length);

    if(transormedIngredients.length === 0){
        transormedIngredients = <p>Please start adding Ingredients!</p>
    }

    return (
        <div className={classes.Burger}>
            <BurgerIngredient type="bread-top" />
            {transormedIngredients}
            <BurgerIngredient type="bread-bottom" />
        </div>
    );
}

export default burger;