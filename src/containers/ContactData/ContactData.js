import React, {Component} from 'react';
import Button from '../../components/UI/Button/Button'
import classes from './ContactData.css';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';

class ContactData extends Component {
    state = {
        name: '',
        email: '',
        address: {
            street: '',
            postalCode: ''
        },
        loading: false
    }

    orderHandler = (event) => {
        event.preventDefault();
        this.setState({loading:true});
        const order = {
            ingredients: this.props.ingredients,
            price: this.props.price,
            customer: {
                name: 'Palash Gupta',
                address: {
                    street: 'Helfjksad',
                    zipCode: '131212',
                    country: 'Germany'
                },
                email: 'askdhkjas@gmail.com'
            },
            deliveryMethod: 'fastest'
        }

        axios.post('/orders.json',order)
            .then(response => {
                this.setState({loading:false});
                this.props.history.push('/');
            })
            .catch(error => {
                this.setState({loading: false});
            });
    } 

    render() {
        let form = (
            <form>
                <input className={classes.Input} type="text" name="Name" placeholder="Your name"></input>
                <input className={classes.Input} type="email" name="Email" placeholder="Your email"></input>
                <input className={classes.Input} type="text" name="Street" placeholder="Street"></input>
                <input className={classes.Input} type="text" name="postal" placeholder="Postal Code"></input>
                <Button btnType="Success" clicked={this.orderHandler}>ORDER</Button>
            </form>
        );
        if(this.state.loading){
            form = <Spinner />
        }
        return (
            <div className={classes.ContactData}>
                <h4>Enter your Contact Data</h4>
                {form}
            </div>
        );
    }
}

export default ContactData;