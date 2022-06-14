import react from 'react';
import './ConfirmationScreen.scss';

export default class ConfirmationScreen extends react.Component {

    reloadApp = () => window.location.reload();

    render() {
        return (
            <>
            <h4 className="card-title">Confirmation</h4>
            <div className="confirmation-container">
                <div className="check-icon">
                    <i className="far fa-check-circle"></i>
                </div>
                <h3>
                    Congratulations.<br />
                    Your order is accepted.
                </h3>
                <p>You will receive email confirmation of your order shortly.</p>
                <button className="btn btn-lg btn-dark">Track Order</button>
                <button className="btn btn-light" onClick={this.reloadApp}>Back to Homepage</button>
            </div>
            </>
        )
    }
}