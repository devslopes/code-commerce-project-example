import react from 'react';
import FormGroup from '../FormGroup/FormGroup.jsx';
import AppData from '../../data/app-data.js';
import DataService from '../../services/data-service.js';
import NotificationService, { NOTIFY_CAN_SUBMIT } from '../../services/notification-service.js';
import { formatPhoneNumber, STATE_OPTIONS, validateShippingForm  } from './constants.js';
import { debounce } from '../../utils/helpers.js';
import './ShippingForm.scss';

let ds = new DataService();
let ns = new NotificationService();

const INIT_STATE = {
    inputs: { title: '', f_name: '', l_name: '', street: '', city: '', state: '', zip: '', cell: '', tel: '', method: 'standard' },
    errors: {},
    submit: false
}

export default class ShippingForm extends react.Component {
    state = { ...INIT_STATE, inputs: { ...this.props.data } };

    componentDidMount() {
        this.checkCanSubmit();
    }

    handleChange = e => {
        let { name, value } = e.target;
        const pressedKey = e.nativeEvent.data;
        debounce(this.checkCanSubmit, 500);
        if (name === 'cell' || name === 'tel' || name === 'zip') {
            if (pressedKey && !pressedKey.match(/^[\d ]*$/)) return;
        }
        if (name === 'cell' || name === 'tel') value = formatPhoneNumber(value);
        if (name === 'f_name' || name === 'l_name') {
            if (pressedKey && pressedKey.match(/^[\d ]*$/)) return;
        }
        this.setState(prevState => ({ inputs: { ...prevState.inputs, [name]: value } }));
    }

    handleBlur = async e => {
        let { name, value } = e.target;
        const error = validateShippingForm(e);
        this.setState(prevState => ({ errors: { ...prevState.errors, [name]: error } }));
        if (name === 'zip') {
            const location = await ds.getZipLocation(value);
            if (location.error) this.setState(prevState => ({ errors: { ...prevState.errors, [name]: location.error } }));
            else this.setState(prevState => ({ inputs: { ...prevState.inputs, ...location } }));
        }
        debounce(this.checkCanSubmit, 500);
    }

    checkCanSubmit = () => {
        ns.dispatch(NOTIFY_CAN_SUBMIT, false);
        this.props.updateFormData('shippingInfo', this.state.inputs);
        for (const [key, value] of Object.entries(this.state.inputs)) {
            if (!value) return;
            if (key === 'tel' || key === 'cell') {
                if (value.length < 14) return;
            }
        }
        for (const [key, value] of Object.entries(this.state.errors)) {
            if (value && value.length > 1 && value !== '') return key;
        }
        ns.dispatch(NOTIFY_CAN_SUBMIT, true);
    }

    handleSubmit = e => e.preventDefault();

    render() {

        const STATES = STATE_OPTIONS();

        const FORM_INPUTS = [
            { name: 'title', type: 'text', label: 'Address Title', required: true },
            { name: 'f_name', type: 'text', label: 'First Name', required: true },
            { name: 'l_name', type: 'text', label: 'Surname', required: true },
            { name: 'street', type: 'text', label: 'Your Address', required: true },
            { name: 'zip', type: 'text', label: 'Zip Code', required: true, maxLength: 5 },
            { name: 'city', type: 'text', label: 'City', required: true },
            { name: 'state', type: 'select', label: 'State', options: [...STATES], required: true },
            { name: 'cell', type: 'text', label: 'Cell Phone', required: true, maxLength: 14 },
            { name: 'tel', type: 'text', label: 'Telephone', required: true, maxLength: 14 }
        ];

        const SHIPPING_METHODS = AppData.shipping_methods;

        const { inputs, errors } = this.state;
        return (
            <div className="shipping-form">
                <h4 className="card-title">Shipping Information</h4>
                <form onSubmit={this.handleSubmit}>
                    {
                        FORM_INPUTS && FORM_INPUTS.map(input => {
                            return (
                                <FormGroup
                                    key={input.name}
                                    {...input}
                                    value={inputs[input.name]}
                                    error={errors[input.name]}
                                    onChange={this.handleChange}
                                    onBlur={this.handleBlur}
                                />
                            )
                        })
                    }
                    <h4 className="card-title">Shipping Method</h4>
                    { SHIPPING_METHODS && SHIPPING_METHODS.map(option => {
                        return <FormGroup
                                key={option.method}
                                name="method"
                                type="radio"
                                label={option.name}
                                value={option.method}
                                onChange={this.handleChange}
                                checked={inputs.method === option.method}
                                description={option.description}
                            />
                    })}
                </form>
            </div>
        )
    }
}