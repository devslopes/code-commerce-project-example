import react from 'react';
import './PushNotification.scss';

export default class PushNotification extends react.Component {

    handleClickDismiss = e => {
        e.preventDefault();
        this.props.dismiss();
    }

    render() {
        const { message } = this.props;
        return (
            <div className="push-notification">
                <i className="fas fa-exclamation-triangle" />
                <div className="message">
                    <p>{message}</p>
                </div>
                <a href="/" onClick={this.handleClickDismiss}>Dismiss</a>
            </div>
        )
    }
}