import react from 'react';
import './ShippingSummary.scss';

export default class ShippingSummary extends react.Component {

    shippingMethod = () => {
        const method = this.props.data.method;
        if (method === 'standard') return 'Delivery in 4-6 Business Days';
        if (method === 'express') return 'Delivery in 1-3 Business Days';
    }

    render() {
        const { f_name, l_name, street, city, state, zip, method } = this.props.data;
        const { email } = this.props.currentUser;
        return (
            <>
            <div className="summary-shipping-details">
                <h4>Shipment Address</h4>
                <address>
                    <p>{f_name} {l_name}</p>
                    <p>{street}</p>
                    <p>{city}, {state} {zip}</p>
                    <p>E-Mail: {email}</p>
                </address>
            </div>
            <div className="summary-shipping-details">
                <h4>Shipment Method</h4>
                <p className="method">{method}</p>
                <p>{this.shippingMethod()}</p>
            </div>
            </>
        )
    }
}