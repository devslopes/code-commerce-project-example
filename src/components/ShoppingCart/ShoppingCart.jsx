import react from 'react';
import NotificationService, { NOTIFY_CAN_SUBMIT, NOTIFY_USER_MESSAGE } from '../../services/notification-service';
import CartItem from '../CartItem/CartItem';
import './ShoppingCart.scss';

let ns = new NotificationService();

export default class ShoppingCart extends react.Component {

    componentDidMount() {
        if (!this.props.cart.length) ns.dispatch(NOTIFY_CAN_SUBMIT, false);
        else ns.dispatch(NOTIFY_CAN_SUBMIT, true);
        ns.dispatch(NOTIFY_USER_MESSAGE, true);
    }

    componentWillUnmount() {
        ns.dispatch(NOTIFY_USER_MESSAGE, false);
    }

    render() {
        const { cart } = this.props;
        return (
            <div className="shopping-cart-container">
                <div className="card-header">
                    <ul className="shopping-cart-headers">
                        <li>Product</li>
                        <li>Price</li>
                        <li>Quantity</li>
                        <li>Total</li>
                    </ul>
                </div>
                { !cart.length && <p className="cart-empty">Your Shopping Cart is empty.</p>}
                { cart && cart.map(item => {
                    return (
                        <CartItem
                            key={item.id}
                            {...item}
                        />
                    )
                }) }
            </div>
        )
    }
}