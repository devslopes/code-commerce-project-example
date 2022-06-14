import react from 'react';
import './ConfirmationBar.scss';

export default class ConfirmationBar extends react.Component {
    render() {
        return (
            <ul className="confirmation-bar">
                <li>Cart</li>
                <li>Delivery</li>
                <li>Payment</li>
                <li className="selected">Confirmation</li>
            </ul>
        )
    }
}