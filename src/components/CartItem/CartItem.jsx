import react from 'react';
import FormGroup from '../FormGroup/FormGroup';
import DataService from '../../services/data-service';
import Helpers from '../../utils/helpers';
import './CartItem.scss';

let ds = new DataService();

export default class CartItem extends react.Component {

    getQtyOptions = () => {
        const { inStock } = this.props;
        let options = [];
        for (let i = 1; i < inStock + 1; i++) options.push(i);
        return options;
    }

    updateQty = (e) => {
        const { name, value } = e.target;
        ds.updateCartitem(name, value);
    }

    removeItem = e => ds.removeCartItem(e.target.name)

    render() {
        const { id, category, title, version, author, image, price, qty, total, view } = this.props;
        return (
            <div className={`cart-item ${view === 'summary' && 'summary'}`}>
                {!view &&
                    <button
                        className="remove-item-btn"
                        name={id}
                        onClick={this.removeItem}
                    >
                        &times;
                    </button>
                }
                <div className="item-img">
                    <img src={image} alt={title} />
                </div>
                <div className="item-info">
                    <div className="item-details">
                        <p className="item-category">{category}</p>
                        <h4 className="item-title">{title}</h4>
                        <div className="meta">
                            <p>Author: <span>{author}</span></p>
                            <p>Version: <span>{version}</span></p>
                        </div>
                    </div>
                    <div className="item-price-details">
                        { !view && <div className="price">{Helpers.currencyFormat.format(price)}</div>}
                        <div className="qty">
                            {
                                view === 'summary' ? qty : (
                                    <FormGroup
                                        name={id}
                                        type="select"
                                        options={this.getQtyOptions()}
                                        value={qty}
                                        onChange={this.updateQty}
                                    />
                                )
                            }
                        </div>
                        <div className="total">{Helpers.currencyFormat.format(total)}</div>
                    </div>
                </div>
            </div>
        )
    }
}