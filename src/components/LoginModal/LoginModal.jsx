import react from 'react';
import reactDom from 'react-dom';
import FormGroup from '../FormGroup/FormGroup';
import DataService from '../../services/data-service';
import { validateUserLogin, validateUserSignup } from './constants';
import './LoginModal.scss';

let ds = new DataService();

const INIT_STATE = {
    formMode: 'login',
    inputs: { email: '', password: '', confirmPassword: '', f_name: '', l_name: '', zip: '' },
    errors: {},
    errorMessage: ''
}

export default class LoginModal extends react.Component {
    state = {...INIT_STATE}

    handleSignupUser = inputs => {
        const errors = validateUserSignup(inputs);
        if (Object.keys(errors).length) {
            return this.setState({
                errorMessage: 'We\'re sorry, but one or more fields is incorrect.',
                errors: errors
            });
        }
        const signup = ds.createNewUser(inputs);
        if (!signup.success) {
            this.setState(prevState => ({
                errorMessage: signup.message,
                inputs: { ...prevState.inputs, password: '', confirmPassword: '' }
            }));
        }
    };

    handleUserLogin = inputs => {
        const errors = validateUserLogin(inputs);
        if (Object.keys(errors).length) {
            return this.setState({
                errorMessage: 'Invalid credentials. Please try again.',
                errors: errors
            });
        };
        const login = ds.logUserIn(inputs);
        if(!login.success) {
            this.setState(prevState => ({
                errorMessage: login.message,
                inputs: { ...prevState.inputs, password: '' }
            }));
        }
    }

    handleClickCloseButton = e => {
        e.preventDefault();
        this.props.closeModal();
    };

    handleToggleForm = e => {
        this.setState({ ...INIT_STATE, formMode: e.target.value });
    }

    handleChange = e => {
        const { name, value } = e.target;
        const pressedKey = e.nativeEvent.data;
        if (name === 'f_name' || name === 'l_name') {
            if (pressedKey && pressedKey.match(/^[\d ]*$/)) return;
        }
        if (name === 'zip') {
            if (pressedKey && !pressedKey.match(/^[\d ]*$/)) return;
        }
        this.setState(prevState => ({
            inputs: { ...prevState.inputs, [name]: value }
        }));
    }

    handleSubmit = e => {
        e.preventDefault();
        const { formMode, inputs } = this.state;
        this.setState({ errorMessage: '', errors: {} });
        if (formMode === 'signup') return this.handleSignupUser(inputs);
        if (formMode === 'login') return this.handleUserLogin(inputs);
    }

    renderForm = (inputs) => {
        return inputs && inputs.map(input => {
            return (
                <div key={input.name}>
                <FormGroup
                    {...input}
                    value={this.state.inputs[input.name]}
                    error={this.state.errors[input.name]}
                    onChange={this.handleChange}
                />
                {this.state.formMode === 'signup' && input.name === 'password' &&
                    <small>
                        Password must be 8-20 characters, including: at least one capital letter, at least one small letter,
                        one number, and one special character: - ! @ # $ % ^ &amp; * ( ) _ +
                    </small>
                }
                </div>
            )
        });
    }

    render() {
        const { formMode, errorMessage } = this.state;

        const FORM_MODES = [
            { name: 'formMode', type: 'radio', label: 'Sign In', value: 'login', checked: this.state.formMode === 'login' },
            { name: 'formMode', type: 'radio', label: 'Create Account', value: 'signup', checked: this.state.formMode === 'signup' }
        ];

        const LOGIN_INPUTS = [
            { name: 'email', type: 'email', label: 'Your E-Mail Address', required: true },
            { name: 'password', type: 'password', label: 'Create Password', required: true }
        ];

        const SIGNUP_INPUTS = [
            { name: 'email', type: 'email', label: 'Your E-Mail Address', required: true },
            { name: 'password', type: 'password', label: 'Create Password', required: true },
            { name: 'confirmPassword', type: 'password', label: 'Confirm Password', required: true },
            { name: 'f_name', type: 'text', label: 'First Name', required: true },
            { name: 'l_name', type: 'text', label: 'Surname', required: true },
            { name: 'zip', type: 'text', label: 'Postcode', required: false, maxLength: 5 }
        ];

        return reactDom.createPortal(
            <div className="login-modal">
                <div className="modal-container">
                    <button
                        className="modal-close-btn"
                        aria-label="Close"
                        onClick={this.handleClickCloseButton}>
                            <span aria-hidden="true">&times;</span>
                    </button>
                    <form onSubmit={this.handleSubmit}>
                        <div className="form-mode-btns">
                            {FORM_MODES && FORM_MODES.map(radio => {
                                return(
                                    <FormGroup
                                        key={radio.value}
                                        {...radio}
                                        onChange={this.handleToggleForm}
                                    />
                                )
                            })}
                        </div>
                        {errorMessage && <p className="form-error">{errorMessage}</p>}
                        {this.renderForm(formMode === 'login' ? LOGIN_INPUTS : SIGNUP_INPUTS)}
                        <div className="submit-button">
                            <button type="submit" className="btn btn-primary">
                                {formMode === 'signup' ? 'Create Account' : 'Sign In'}
                            </button>
                        </div>
                    </form>
                    <div className="or-divider" />
                    <div className="submit-button">
                            <div className="fb-login-button btn btn-facebook" data-width="" data-size="large" data-button-type="continue_with" data-layout="default" data-auto-logout-link="false" data-use-continue-as="false"></div>
                        </div>
                    <a className="cancel-link" href="/" onClick={this.handleClickCloseButton}>Cancel</a>
                </div>
            </div>,
            document.getElementById('portal')
        );
    }
}