import react from 'react';
import Helpers from '../../../../utils/helpers';
import './MethodSummary.scss';

export default class MethodSummary extends react.Component {

    handleClick = e => e.preventDefault();

    shippingMethod = () => {
        const method = this.props.shippingInfo.method;
        if (method === 'standard') return 'Delivery in 4-6 Business Days';
        if (method === 'express') return 'Delivery in 1-3 Business Days';
    }

    renderContent = () => {
        const { summary, shippingInfo, paymentInfo, orderTotal } = this.props;
        if (summary === 'shipping') return (
            <p><span>{shippingInfo.method}</span> {this.shippingMethod()}</p>
        )
        if (summary === 'payment') return (
            <p>
                <span className="summary-card-icon">
                    <img src={paymentInfo.icon} alt={paymentInfo.cardType} />
                </span>
                <span>{paymentInfo.cardType} - {paymentInfo.cardNum.slice(-4)}</span>
                Total payment: {Helpers.currencyFormat.format(orderTotal.total)}
            </p>
        )
    }

    render() {
        const { summary } = this.props;
        return (
            <div className="summary-method-summary">
                <div className="summary-title">
                    <h5>{summary === 'shipping' ? 'Shipping' : 'Payment'}</h5>
                    <a href="/" onClick={this.handleClick}>View {summary === 'shipping' ? 'Shipping' : 'Payment'} Details</a>
                </div>
                {this.renderContent()}
            </div>
        )
    }
}