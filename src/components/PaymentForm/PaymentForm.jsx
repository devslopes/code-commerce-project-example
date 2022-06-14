import react from 'react';
import FormGroup from '../FormGroup/FormGroup.jsx';
import NotificationService, { NOTIFY_CAN_SUBMIT, NOTIFY_CHANGE_SCREEN } from '../../services/notification-service.js';
import { 
    YEAR_OPTIONS,
    MONTH_OPTIONS,
    formatCardNumber,
    validatePaymentForm,
    checkExpDate,
    getCardType
} from './constants';
import Helpers, { debounce } from '../../utils/helpers.js';
import './PaymentForm.scss';

let ns = new NotificationService();

const INIT_STATE = {
    cardInfo: { name: '', cardNum: '', expMonth: '', expYear: '', cvv: '', cardType: '', icon: '' },
    errors: {},
    cardMax: 19,
    cvvMax: 3,
    canSubmit: false
}

export default class PaymentForm extends react.Component {
    state = {...INIT_STATE};

    componentDidMount() {
        ns.dispatch(NOTIFY_CAN_SUBMIT, false);
        this.checkCanSubmit();
    }
    
    handleChange = e => {
        const { name, value } = e.target;
        const keyPressed = e.nativeEvent.data;
        debounce(this.checkCanSubmit, 500);
        if (name === 'cvv' || name === 'cardNum') {
            if (keyPressed && !keyPressed.match(/^[\d ]*$/)) return;
            if (name === 'cardNum') return this.handleCardData(value);
        } 
        if (name === 'name') {
            if (keyPressed && !keyPressed.match(/^[a-zA-Z ]*$/)) return;
        }
        this.setState(prevState => ({
            cardInfo: { ...prevState.cardInfo, [name]: value }
        }));
    }

    handleCardData = number => {
        const cardFormat = formatCardNumber(number);
        const cardType = getCardType(number);
        if (cardFormat.error) {
            return this.setState(prevState => ({
                cardInfo: { ...prevState.cardInfo, cardNum: cardFormat.mask, ...cardType },
                errors: { ...prevState.errors, cardNum: cardFormat.error }
            }));
        }
        this.setState(prevState => ({
            cardInfo: { ...prevState.cardInfo, cardNum: cardFormat.mask, ...cardType },
            errors: { ...prevState.errors, cardNum: '' },
            cardMax: cardFormat.max, cvvMax: cardFormat.cvv
        }));
    }

    handleBlur = e => {
        const { name, value } = e.target;
        const error = validatePaymentForm(e, this.state.cvvMax);
        this.setState(prevState => ({ errors: { ...prevState.errors, [name]: error } }));
        if (name === 'cardNum') return this.handleCardData(value);
        if (name ==='expMonth' || name === 'expYear') {
            const { expMonth, expYear } = this.state.cardInfo;
            const dateError = checkExpDate(expMonth, expYear);
            this.setState(prevState => ({
                errors: { ...prevState.errors, expMonth: dateError, expYear: dateError }
            }));
        };
        this.checkCanSubmit();
    }

    handleSubmit = e => {
        e.preventDefault();
        ns.dispatch(NOTIFY_CHANGE_SCREEN, 'next');
    }

    checkCanSubmit = () => {
        ns.dispatch(NOTIFY_CAN_SUBMIT, false);
        this.setState({ canSubmit: false });
        this.props.updateFormData('paymentInfo', this.state.cardInfo);
        for (const [key, value] of Object.entries(this.state.cardInfo)) {
            if (!value) return key;
            if (key === 'cvv' && value.length < this.state.cvvMax) return;
        }
        for (const [key, value] of Object.entries(this.state.errors)) {
            if (value && value.length > 1 && value !== '') return key;
        }
        ns.dispatch(NOTIFY_CAN_SUBMIT, true);
        this.setState({ canSubmit: true });
    }
    
    render() {

        const FORM_INPUTS = [
            { name: 'name', type: 'text', label: 'Cardholder Name', required: true },
            { name: 'cardNum', type: 'text', label: 'Card Number', required: true, maxLength: this.state.cardMax, card: this.state.cardInfo.icon },
            { name: 'expMonth', type: 'select', label: 'Exp. Date', options: ['Month', ...MONTH_OPTIONS], required: true },
            { name: 'expYear', type: 'select', options: ['Year', ...YEAR_OPTIONS()], required: true },
            { name: 'cvv', type: 'text', label: 'CVV', required: true, maxLength: this.state.cvvMax }
        ];

        const { cardInfo, errors } = this.state;
        return (
            <>
                <h4 className="card-title">Payment Information</h4>
                <div className="payment-form">
                    <form onSubmit={this.handleSubmit}>
                        {
                            FORM_INPUTS && FORM_INPUTS.map(input => {
                                return (
                                    <FormGroup
                                        key={input.name}
                                        {...input}
                                        value={cardInfo[input.name]}
                                        error={errors[input.name]}
                                        onChange = {this.handleChange}
                                        onBlur={this.handleBlur}
                                    />
                                )
                            })
                        }
                        <div className="pay-button">
                            <button
                                className="btn btn-primary btn-full"
                                disabled={!this.state.canSubmit}
                                >
                                    Pay {Helpers.currencyFormat.format(this.props.total)}
                                </button>
                        </div>
                        <div className="cvv-tooltip">
                            <p>
                                The CVV Number ("Card Verification Value") on your credit card or debit card is a 3 digit
                                number on VISA®, MasterCard® and Discover® branded credit and debit cards. On your American
                                Express® branded credit or debit card it is a 4 digit numeric code.
                            </p>
                        </div>
                    </form>
                </div>
            </>
        )
    }
}