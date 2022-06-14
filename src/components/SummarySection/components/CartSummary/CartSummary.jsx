import react from 'react';
import CartItem from '../../../CartItem/CartItem';
import './CartSummary.scss';

export default class CartSummary extends react.Component {

    render() {
        const { cart } = this.props;
        if (cart && cart.length) return (
            <div className="summary-cart-summary">
                <p className="cart-count"><strong>{cart.length} item{cart.length !== 1 && 's'}</strong> in your bag.</p>
                {cart && cart.map(item => {
                    return (
                        <CartItem
                            key={item.id}
                            view="summary"
                            {...item}
                        />
                    )
                })}
            </div>
        )
        return null;
    }
}