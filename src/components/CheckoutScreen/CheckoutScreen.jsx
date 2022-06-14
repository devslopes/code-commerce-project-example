import react from 'react';
import ConfirmationBar from '../ConfirmationBar/ConfirmationBar';
import ConfirmationScreen from '../ConfirmationScreen/ConfirmatonScreen';
import PaymentForm from '../PaymentForm/PaymentForm';
import PushNotification from '../PushNotification/PushNotification';
import ProgressBar from '../ProgressBar/ProgressBar';
import ShippingForm from '../ShippingForm/ShippingForm';
import ShoppingCart from '../ShoppingCart/ShoppingCart';
import SummarySection from '../SummarySection/SummarySection';
import NotificationService, {
    NOTIFY_CAN_SUBMIT,
    NOTIFY_CHANGE_SCREEN,
    NOTIFY_PUSH_ALERT,
    NOTIFY_SET_PROMO_CODE,
    NOTIFY_UPDATE_CART,
} from '../../services/notification-service';
import AppData from '../../data/app-data';
import { debounce } from '../../utils/helpers';
import './CheckoutScreen.scss';

let ns = new NotificationService();
const INIT_STATE = {
    view: 1,
    cart: [...AppData.Cart],
    checkoutEnabled: true,
    promo: { code: '', discount: 0 },
    orderTotal: {},
    shippingInfo: { title: '', f_name: '', l_name: '', street: '', city: '', state: '', zip: '', cell: '', tel: '', method: 'standard' },
    paymentInfo: { cardName: '', cardNum: '', cardType: '', expMonth: '', expYear: '', cvv: '' }
};

export default class CheckoutScreen extends react.Component {
    state = {...INIT_STATE};

    componentDidMount() {
        ns.addObserver(NOTIFY_UPDATE_CART, this, this.updateCart);
        ns.addObserver(NOTIFY_PUSH_ALERT, this, this.handleSetAlert);
        ns.addObserver(NOTIFY_CAN_SUBMIT, this, this.setCheckout);
        ns.addObserver(NOTIFY_CHANGE_SCREEN, this, this.handleChangeScreen);
        ns.addObserver(NOTIFY_SET_PROMO_CODE, this, this.setPromo);
        this.setOrderTotal(this.state.cart);
    }

    componentWillUnmount() {
        ns.removeObserver(NOTIFY_UPDATE_CART, this);
        ns.removeObserver(NOTIFY_PUSH_ALERT, this);
        ns.removeObserver(NOTIFY_CAN_SUBMIT, this);
        ns.removeObserver(NOTIFY_CHANGE_SCREEN, this);
        ns.removeObserver(NOTIFY_SET_PROMO_CODE, this);
    }

    setOrderTotal = (items = this.state.cart) => {
        const subTotal = items.reduce((prev, cur) => prev + cur.total, 0); 
        const shippingMethod = AppData.shipping_methods.find(
            method => method.method === this.state.shippingInfo.method);
        let shipping = shippingMethod.method === 'standard' && subTotal >= 40 ? 0 : shippingMethod.cost;
        if (subTotal === 0) shipping = 0;
        let discount = this.state.promo.discount * (subTotal + shipping);
        if (subTotal === 0) discount = 0;
        const total = subTotal + shipping - discount;
        this.setState({ orderTotal: { subTotal, shipping, discount, total } });
    }

    handleSetAlert = alert => {
        this.setState({ alert: alert });
        debounce(this.handleClearAlert, 1500);
    };
    
    handleClearAlert = () => this.setState({ alert: null });
    
    updateCart = payload => {
        this.setState({ cart: [...payload] });
        this.setOrderTotal(payload);
    }
    
    handleChangeScreen = (dir) => {
        const direction = dir === 'next' ? 1 : -1;
        this.setState(prevState => ({view: prevState.view + direction}));
    }

    setCheckout = value => this.setState({ checkoutEnabled: value });

    updateFormData = (data, values) => {
        this.setState({ [data]: { ...values } });
        this.setOrderTotal();
    }

    setPromo = promo => {
        if (!promo) return;
        this.setState({promo: { ...promo } });
        debounce(this.setOrderTotal)
    }

    renderView = () => {
        const { view, cart, shippingInfo, paymentInfo } = this.state;
        switch(view) {
            case 1: return <ShoppingCart cart={cart} />;
            case 2: return <ShippingForm data={shippingInfo} updateFormData={this.updateFormData} />;
            case 3: return <PaymentForm data={paymentInfo} total={this.state.orderTotal.total} updateFormData={this.updateFormData} />;
            case 4: return <ConfirmationScreen />;
            default: return null;
        }
    }

    render() {
        const { view, alert } = this.state;
        return (
            <>
                { view === 4 && <ConfirmationBar /> }
                <div className="flex-container">
                    <div className="flex-child" style={{flex: view === 4 ? 1.75 : 2.5}}>
                        {alert
                            ? <PushNotification message={alert} dismiss={this.handleClearAlert} />
                            : view < 4 && <ProgressBar view={view} />
                        }
                        <div className="content-card">
                            {this.renderView()}
                            {view > 1 && view < 4 &&
                                <div className="prev-btn">
                                    <button className="btn btn-light" onClick={this.handleChangeScreen}>
                                        Back to {view === 2 ? 'Cart' : 'Address'}
                                    </button>
                                </div>
                            }
                        </div>
                    </div>
                    <div className="flex-child">
                        <div className="content-card">
                            <SummarySection {...this.state} currentUser={this.props.currentUser} />
                        </div>
                    </div>
                </div>
            </>
        )
    }
}