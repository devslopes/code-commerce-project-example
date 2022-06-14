import react from 'react';
import Helpers from '../../utils/helpers';
import NotificationService, { NOTIFY_CHANGE_SCREEN } from '../../services/notification-service';
import CartSummary from './components/CartSummary/CartSummary';
import MethodSummary from './components/MethodSummary/MethodSummary';
import PromoCode from './components/PromoCode/PromoCode';
import ShippingSummary from './components/ShippingSummary/ShippingSummary';
import AppData from '../../data/app-data';
import './SummarySection.scss';

let ns = new NotificationService();

export default class SummarySection extends react.Component {

    handleClickSubmit = () => ns.dispatch(NOTIFY_CHANGE_SCREEN, 'next')
    
    render() {

        const shippingMethods = AppData.shipping_methods;

        const { view, cart, orderTotal, shippingInfo } = this.props;
        return (
            <div className="summary-section">
                <h4 className="card-title">Summary</h4>
                {view === 1 && <PromoCode promo={this.props.promo} />}
                {view > 1 && <CartSummary cart={cart} />}
                <div className="summary-order-total">
                    <ul className="defaults-removed">
                        <li>
                            <span>Cart Subtotal:</span>
                            <span>{Helpers.currencyFormat.format(orderTotal.subTotal)}</span>
                        </li>
                        <li>
                            <span>Shipping &amp; Handling:</span>
                            <span>{Helpers.currencyFormat.format(orderTotal.shipping)}</span>
                        </li>
                        <li>
                            <span>Discount:</span>
                            <span className="discount">-{Helpers.currencyFormat.format(orderTotal.discount)}</span>
                        </li>
                        <li>
                            <span>Cart Total:</span>
                            <span className="grand-total">{Helpers.currencyFormat.format(orderTotal.total)}</span>
                        </li>
                    </ul>
                </div>
                {view === 3 && <ShippingSummary data={shippingInfo} methods={shippingMethods} currentUser={this.props.currentUser} />}
                {view === 4 && (
                    <>
                    <MethodSummary summary="shipping" methods={AppData.shipping_methods} {...this.props} />
                    <MethodSummary summary="payment" {...this.props} />
                    </>
                )}
                {view < 4 &&
                    <div className="checkout-button">
                        <button
                            className="btn btn-primary"
                            disabled={!this.props.checkoutEnabled}
                            onClick={this.handleClickSubmit}
                        >
                            {
                                view < 3
                                    ? 'Checkout'
                                    : `Pay ${Helpers.currencyFormat.format(this.props.orderTotal.total)}`
                            }
                        </button>
                    </div>
                }
            </div>
        )
    }
}