import react from 'react';
import NotificationService, { NOTIFY_SET_PROMO_CODE } from '../../../../services/notification-service';
import './PromoCode.scss';

let ns = new NotificationService();

const PROMO_CODES = [
    { code: '5OFF', discount: .05 }
];

const INIT_STATE = { code: '', message: {} };

export default class PromoCode extends react.Component {
    state = {...INIT_STATE};

    componentDidMount() {
        this.setState({ ...this.props.promo });
    }

    handleChange = e => this.setState({ code: e.target.value });
    
    handleSubmit = e => {
        e.preventDefault();
        const { code } = this.state;
        const discount = PROMO_CODES.find(promo => promo.code === code);
        if (!discount) return this.setState({ message: { type: 'danger', message: 'Invalid Promo Code' } });
        ns.dispatch(NOTIFY_SET_PROMO_CODE, discount);
        this.setState({ message: { type: 'success', message: 'Discount applied successfully' }})
    }

    render() {
        const { code, message } = this.state;
        return (
            <div className="summary-promo-code">
                <form onSubmit={this.handleSubmit}>
                    <label htmlFor="promoCode">Do you have a Promo Code?</label>
                    {message && <p className={`message ${message.type}`}>{message.message}</p>}
                    <div className="promo-form">
                    <input
                            type="text"
                            name="code"
                            id="promoCode"
                            placeholder="Code"
                            value={code}
                            onChange={this.handleChange}
                        />
                        <button className="btn btn-light" type="submit" disabled={code.length < 3}>Apply</button>
                    </div>
                </form>
            </div>
        )
    }
}