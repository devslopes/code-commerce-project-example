import react from 'react';
import './ProgressBar.scss';

export default class ProgressBar extends react.Component {
    render() {
        const { view } = this.props;
        return (
            <div className="progress-wrapper">
                <ul className="progress-bar">
                    <li className={ view > 1 ? 'selected' : null }>
                        <i className="fa fa-shopping-cart"></i>
                        Cart
                    </li>
                    <li className={ view > 2 ? 'selected' : null }>
                        <i className="fa fa-truck"></i>
                        Delivery
                    </li>
                    <li className={ view > 3 ? 'selected' : null }>
                        <i className="fa fa-credit-card"></i>
                        Payment
                    </li>
                    <li>
                        <i className="far fa-check-circle"></i>
                        Confirmation
                    </li>
                </ul>
            </div>
        )
    }
}